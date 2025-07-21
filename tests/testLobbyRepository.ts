import { LobbiesListDTO, LobbyCreationConfigsDTO, TDynamicLobbySettings, TLobby, TLobbyUser } from "./dependencies/lobbyTyping.js";
import { getMaxPlayersFromMap, getParticipantsAm } from "./helpers.js";

type TUser = {
    id: number,
    username: string,
    spriteID: number,
    rating: number
}


class LobbyRepository {
    constructor() {}

    getLobbiesList(): LobbiesListDTO {
        console.log("getAllLobbies called")
        console.log(`Lobbies: ${this._lobbies}`)

        const out: LobbiesListDTO = []
        this._lobbies.forEach(lobby => {
            out.push({
                id: lobby.id,
                name: lobby.name,
                host: this._getUserByID(lobby.hostID).username,
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

    createLobby(configs: LobbyCreationConfigsDTO, selfData: {id: number, username: string}): TLobby {
        let userInfo = this._users.find(user => user.id === selfData.id)
        if (!userInfo) {
            userInfo = {
                id: selfData.id,
                username: selfData.username,
                spriteID: 0,
                rating: 1500
            }
            this._users.push(userInfo)
        }


        const newLobby: TLobby = {
            id: this._currentLobbyID++,
            hostID: selfData.id,
            name: configs.name,
            type: configs.type,
            map: configs.map,
            mode: configs.mode,
            duration: configs.duration,
            round: 1,
            users: [{
                id: userInfo.id,
                username: userInfo.username,
                spriteID: userInfo.spriteID,
                rating: userInfo.rating,
                ready: false,
                player: null
            }]
        }
        this._lobbies.push(newLobby)
        
        return newLobby
    }





    updateSettings(lobbyID: number, settings: TDynamicLobbySettings): TLobbyUser[] | null { //returns whether users must be updated in broadcast
        const lobby = this._getLobbyByID(lobbyID);
        let updateUsers = lobby.map !== settings.map && lobby.type !== "tournament"
        console.log(updateUsers)
        lobby.map = settings.map;
        lobby.mode = settings.mode;
        lobby.duration = settings.duration
        if (updateUsers) {
            lobby.users.forEach(user => {
                user.player = null;
            })
            return lobby.users
        } else {
            return null
        }
        
    }

    _getLobbyByID(lobbyID: number) {
        const correctLobby = this._lobbies.find(lobby => lobby.id === lobbyID)
        if (!correctLobby) {throw Error("Lobby requested does not exist!")}
        return correctLobby
    }
    _getUserByID(userID: number) {
        const correctUser = this._users.find(user => user.id === userID)
        if (!correctUser) {throw Error("Lobby requested does not exist!")}
        return correctUser
    }

    private _lobbies: TLobby[] = []
    private _currentLobbyID: number = 0;
    
    private _users: TUser[] = []
}

export const testLobbyRepository = new LobbyRepository()