const lobbyRepo = require('../../Adapters/outbound/LobbyDataRepository');
const mapRepo = require('../../Adapters/outbound/MapRepository');
const mapper = require('../../Infrastructure/Mappers/LobbyMapper');
const connPlyrsRepo = require('../../Adapters/outbound/ConnectedUsersRepository'); 
const exception = require('../../Infrastructure/config/CustomException');
const broadcast = require('./LobbyBroadcastService');

class LobbyService {


    /* 
    *    @brief Main method to create and validate lobby
    *    @throws 400 - Bad request
    *    @returns {TLobby}
    */
    async createLobby(data, user_id)
    {
        const id = Math.floor(Math.random() * 99999);
        await this.validateLobbyConfig(data);
        const map = await this.validateMap(data.map);
        const lobby = mapper.buildLobbyData(id, data, map, user_id);
        await lobbyRepo.save(id, lobby, user_id);
        return mapper.lobbyDataToTLobby(lobby);
    }


    /* 
    *    @brief Method to add user to lobby
    *    @throws 400 - Bad request
    *    @returns {TLobby} that is going to be send to user
    *    that joined the lobby
         TODO: remove the TTL CHECK FROM ADD USER REPO METHOD 
    */
    async addUserToLobby(lobbyId, user_id, socket)
    {
        const lobby = await lobbyRepo.addUser(lobbyId, user_id);
        connPlyrsRepo.addUser(lobbyId, user_id, socket);
        // todo: create a service or a message builder, no need to await
        connPlyrsRepo.broadcastToOtherLobbyUsers(lobbyId, {type: "user_joined_event",
                                                            user_id: user_id}, user_id);
        socket.send(JSON.stringify(mapper.lobbyDataToTLobby(lobby)));
    }

    async removeUserFromLobby(lobbyId, userId)
    {
        connPlyrsRepo.deleteUser(lobbyId, userId);
        //connPlyrsRepo.broadcastToLobby(lobbyId, {type: "user_left_event",
        //                                        user_id: userId});
        let lobbyUsers = await lobbyRepo.getLobbyUsers(lobbyId);
        lobbyUsers = lobbyUsers.filter(u => u.id != userId);
        await lobbyRepo.updateUsers(lobbyId, lobbyUsers);
    }

    async setUserState(lobbyId, user_id, readyState)
    {
        const lobbyUsers = await lobbyRepo.getLobbyUsers(lobbyId);
        const user = lobbyUsers.find(u => u.id == user_id);
        user.ready = readyState;
        await lobbyRepo.updateUsers(lobbyId, lobbyUsers);
        broadcast.updateReadiness(lobbyId, user_id, readyState);
    }

    async updateLobbySettings(lobbyId, userId, newLobbySettings)
    {
        const lobby = await lobbyRepo.get(lobbyId);
        if (userId != lobby.hostID) return;
        try {
            await this.validateDuration(newLobbySettings.duration);
            await this.validateMode(newLobbySettings.mode);
            await this.validateMap(newLobbySettings.map);
        } catch (error) {
            return ; //todo: broadcast an error to host
        }
        lobby.map = newLobbySettings.map;
        lobby.mode = newLobbySettings.mode;
        lobby.duration = newLobbySettings.duration;
        await lobbyRepo.updateSettings(lobbyId, lobby);
    }

    // this 2 are more focused first in the ranked but then will be created
    // a more scalable solution to all modes
    async setPlayerPosition(lobbyId, user_id, data)
    {
        const lobbyUsers = await lobbyRepo.getLobbyUsers(lobbyId);
        // todo: validation to check if someone is already there or the map allows
        const user = await lobbyUsers.find(u => u.id == parseInt(user_id));
        user.team = data.team;
        user.role = data.role;
        await lobbyRepo.updateUsers(lobbyId, lobbyUsers);
        broadcast.addRankedPlayer(lobbyId, user_id, user);
    }

    async removePlayerPosition(lobbyId, userId)
    {
        let lobbyUsers = await lobbyRepo.getLobbyUsers(lobbyId);
        const user = lobbyUsers.find(u => u.id == userId);
        if (user) {
            delete user.team;
            delete user.role;
        }
        await lobbyRepo.updateUsers(lobbyId, lobbyUsers);
        broadcast.removeRankedPlayer(lobbyId, userId);
    }

    async validateLobbyEntry(lobbyId, socket)
    {
        let lobbyData = await lobbyRepo.get(lobbyId);
        if (Object.keys(lobbyData).length == 0) socket.close();
    }

    async getAllLobbies()
    {
        const lobbies = await lobbyRepo.getAllLobbies();
        return mapper.lobbyDataArrayToResponse(lobbies);
    }

    async getLobbyById(id)
    {
        const lobby = await lobbyRepo.get(id);
        return mapper.lobbyDataToTLobby(lobby);
    }


    async validateLobbyConfig(data)
    {
        await this.validateDuration(data.duration);
        await this.validateMode(data.mode);
        await this.validateLobbyType(data.type);
    }


    async validateMap(mapName)
    {
        const map = await mapRepo.getByName(mapName);
        if (map.length == 0) throw exception('Invalid map', 400);
        return map;
    }

    async validateDuration(duration)
    {
        const validDurations = ["blitz", "rapid", "classical", "long", "marathon"];
        if (!validDurations.includes(duration)) throw exception('Invalid duration', 400);
    }

    async validateMode(mode)
    {
        const validModes = ["modern", "classic"];
        if (!validModes.includes(mode)) throw exception('Invalid mode', 400);
    }

    async validateLobbyType(type)
    {
        const lobbyType = ["friendly", "ranked", "tournament"];
        if (!lobbyType.includes(type)) throw exception('Invalid type', 400);
    }
};

module.exports = new LobbyService();