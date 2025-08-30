const redis = require('../../Infrastructure/config/Redis');
const connectedUsersRepository = require('../outbound/ConnectedUsersRepository');
const eventBus = require('../../Adapters/outbound/EventBusUserRepository');
const lobbyMapper = require('../../Infrastructure/Mappers/LobbyMapper');

/* 
*   {
*    "name": "Pato Caolho",
*    "type": "friendly",
*    "mode": "modern",
*    "duration": 120,
*    "map": "2v2-small",
*    "map_usr_max": 4,
*    "users": []
*   }
*/
class LobbyDataRepository {

    async save(lobby_id, data, user_id)
    {
        console.log('Lobby id = ' + lobby_id + ' | Data = ' + data);

        // TODO: later find the documentation to send it all at once
        redis.hSet(`lobby:${lobby_id}`, 'id', data.id);
        redis.hSet(`lobby:${lobby_id}`, 'name', data.name);
        redis.hSet(`lobby:${lobby_id}`, 'type', data.type);
        redis.hSet(`lobby:${lobby_id}`, 'mode', data.mode);
        redis.hSet(`lobby:${lobby_id}`, 'hostID', user_id);
        redis.hSet(`lobby:${lobby_id}`, 'duration', data.duration);
        redis.hSet(`lobby:${lobby_id}`, 'map', data.map);
        redis.hSet(`lobby:${lobby_id}`, 'slots_taken', data.slots_taken);
        redis.hSet(`lobby:${lobby_id}`, 'map_usr_max', data.map_usr_max);
        redis.hSet(`lobby:${lobby_id}`, 'round', data.round);

        redis.hSet(`lobby:${lobby_id}`, 'users', JSON.stringify([]));

        await redis.expire(`lobby:${lobby_id}`, 60);
    }

    async updateSettings(lobby_id, data)
    {
        redis.hSet(`lobby:${lobby_id}`, 'mode', data.mode);
        redis.hSet(`lobby:${lobby_id}`, 'duration', data.duration);
        redis.hSet(`lobby:${lobby_id}`, 'map', data.map);
    }


    // TTL - Time To Leave
    // method to check and remove TTL
    async isTemp(lobby_id)
    {
        const ttl = await redis.ttl(`lobby:${lobby_id}`);
        if (ttl == -1) console.log('No ttl on it');
        else if (ttl > 0) 
        {
            const result = await redis.persist(`lobby:${lobby_id}`);
            console.log(result ? 'ttl removed' : 'tll failed to remove');
        }
    }

    async addUser(lobby_id, user_id)
    {
        const lobby = await this.get(lobby_id);
        if (lobby) this.isTemp(lobby_id);
        lobby.users.push({id: user_id, ready: false});
        await redis.hSet(`lobby:${lobby_id}`, 'users', JSON.stringify(lobby.users));
        return lobby;
    }

    async updateSettings(lobby_id, new_settings) {
        const prevSettings = await this.get(lobby_id);
        redis.hSet(`lobby:${lobby_id}`, 'map', new_settings.map)
        redis.hSet(`lobby:${lobby_id}`, 'mode', new_settings.mode)
        redis.hSet(`lobby:${lobby_id}`, 'duration', new_settings.duration)
        const settings = await this.getLobbyToGameBuild(lobby_id)
        connectedUsersRepository.broadcastToLobby(lobby_id, {
            requestType: "updateSettings",
            data: { settings: settings, updateSlots: prevSettings.map != settings.map }
        })
    }

    // todo: make verifications on the service and decouple everything with the services
    async setPlayerPosition(lobby_id, user_id, data)
    {
        const lobby = await this.get(lobby_id);
        const user = lobby.users.find(u => u.id == user_id);
        user.team = data.team;
        user.role = data.role;
        await redis.hSet(`lobby:${lobby_id}`, 'users', JSON.stringify(lobby.users));

        // todo: this is reallyy coupled
        connectedUsersRepository.broadcastToLobby(lobby_id, {type: "position_update_event",
                                                            user_id: user_id, team: data.team,
                                                            role: data.role})
    }

    async getLobbyUsers(lobbyId)
    {
        const lobby = await this.get(lobbyId);
        return lobby.users;
    }


    async removeUser(lobby_id, user_id)
    {
    }

    async updateUsers(lobbyId, users)
    {
        await redis.hSet(`lobby:${lobbyId}`, 'users', JSON.stringify(users));
    }

    async setUserPosition(lobby_id, position)
    {

    }


    


    /*
    export type TUser = {
    //Stuff from database
    id: number,
    nickname: string,
    spriteID: number
    rating: number

    //Stuff about lobby
    ready: boolean, //Default is false
    participating: boolean //Default is false
    player: TFriendlyPlayer[] | TRankedPlayer | TTournamentPlayer //Depends on the type of lobby
    }
    */
   async getUsersToGameBuild(lobby_id)
    {
        const lobby = await this.get(lobby_id);
        const TUsers = [];
        for (const u of lobby.users) {
            TUsers.push({
                id: u.id,
                nickname: await eventBus.getNicknamesByUserId(u.id),
                spriteID: 1, //!!!! LEMBRAR DE TIRAR ESSE HARDCODED
                rating: 2, //!!! FAZ PARTE DO USER SERVICE
                ready: u.ready,
                participating: (u.team && u.role) ? true : false,
                player: {}
            });
        }
        return TUsers;
    }

    async get(lobby_id)
    {
        const result = await redis.hGetAll(`lobby:${lobby_id}`);
        //console.log('RAW GET = ' + result.name + ' | JSON GET = ' + JSON.stringify(result));
        result.users = JSON.parse(result.users);
        return result;
    }

    async getAllLobbies() {
        const lobbies = [];
        for await (const key of redis.scanIterator({
            MATCH: 'lobby:*',
            COUNT: 100
        })) {
            const data = await redis.hGetAll(key);
            data.id = key.substring(6);
            data.users = JSON.parse(data.users);
            if (data.users.length != 0) lobbies.push(data);
        }
        return lobbies;
    }

    async deleteLobby(lobbyId)
    {
        const result = await redis.del(`lobby:${lobbyId}`);

    }
}

module.exports = new LobbyDataRepository();