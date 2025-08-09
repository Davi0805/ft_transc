import { getMaxPlayersFromMap, getParticipantsAm } from "./dependencies/helpers.js";
import { LobbiesListDTO, LobbyCreationConfigsDTO, TLobby } from "./dependencies/lobbyTyping.js";
import { userRepository } from "./UserRepository.js";

class LobbyRepository {
    getAllLobbies() {
        const out: LobbiesListDTO = []
        this._lobbies.forEach(lobby => {
            out.push({
                id: lobby.id,
                name: lobby.name,
                host: userRepository.getUserByID(lobby.hostID).username,
                type: lobby.type,
                capacity: {
                    taken: getParticipantsAm(lobby.users),
                    max: getMaxPlayersFromMap(lobby.map)
                },
                map: lobby.map,
                mode: lobby.mode,
                duration: lobby.duration
            })
        })
        return out
    }

    getLobbyByID(lobbyID: number) {
        const correctLobby = this._lobbies.find(lobby => lobby.id === lobbyID)
        if (!correctLobby) {throw Error("Lobby requested does not exist!")}
        return correctLobby
    }

    getUserInLobby(lobbyID: number, userID: number) {
        const lobby = lobbyRepository.getLobbyByID(lobbyID);
        const user = lobby.users.find(user => user.id === userID);
        if (!user) {throw Error("User could not be found in lobby!")}
        return user
    }

    createLobby(configs: LobbyCreationConfigsDTO, userID: number): number {
        let userInfo = userRepository.getUserByID(userID)

        const newLobby: TLobby = {
            id: this._currentID,
            hostID: userID,
            name: configs.name,
            type: configs.type,
            map: configs.map,
            mode: configs.mode,
            duration: configs.duration,
            round: 1,
            users: []
        }
        this._lobbies.push(newLobby)
        
        return this._currentID++
    }

    deleteLobby(lobbyID: number) {
        this._lobbies = this._lobbies.filter(lobby => lobby.id !== lobbyID)
        console.log("Lobby was deleted!");
    }

    private _currentID: number = 0;
    private _lobbies: TLobby[] = []
}

export const lobbyRepository = new LobbyRepository()