import { LobbiesListDTO, LobbyCreationConfigsDTO, TDynamicLobbySettings, TLobby, TLobbyUser } from "./dependencies/lobbyTyping.js";
import { getMaxPlayersFromMap, getParticipantsAm } from "./helpers.js";
import { lobbySocketService } from "./testLobbySocketService.js";

type TUser = {
    id: number,
    username: string,
    spriteID: number,
    rating: number
}


class LobbyRepository {
    constructor() {}

    getLobbiesList(): LobbiesListDTO {
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
    getLobbyByID(lobbyID: number) {
        const correctLobby = this._lobbies.find(lobby => lobby.id === lobbyID)
        if (!correctLobby) {throw Error("Lobby requested does not exist!")}
        return correctLobby
    }
    createLobby(configs: LobbyCreationConfigsDTO, selfData: {id: number, username: string}): TLobby {
        let userInfo = this._getUserByID(selfData.id, selfData.username)

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
    //Second argument should not be neccessary. Or at least only id is necessary, username is only to register user if it does not exist, which in production always should
    addUserToLobby(lobbyID: number, userData: {id: number, username: string}) {
        const lobby = this.getLobbyByID(lobbyID);
        const userInfo = this._getUserByID(userData.id, userData.username);
        const user = {
            id: userInfo.id,
            username: userInfo.username,
            spriteID: userInfo.spriteID,
            rating: userInfo.rating,
            ready: false,
            player: null
        }
        lobby.users.push(user)
        lobbySocketService.broadcast(lobbyID, "addLobbyUser", { user: user })
    }




    updateSettings(lobbyID: number, settings: TDynamicLobbySettings): TLobbyUser[] | null { //returns whether users must be updated in broadcast
        const lobby = this.getLobbyByID(lobbyID);
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
    
    
    
    _getUserByID(userID: number, username: string | null = null) {
        let userInfo = this._users.find(user => user.id === userID)
        if (!userInfo) {
            //This substitutes the register system
            if (!username) {throw Error("user should have been init by now")}
            userInfo = {
                id: userID,
                username: username,
                spriteID: 0,
                rating: 1500
            }
            this._users.push(userInfo)
        }
        return userInfo
    }

    private _lobbies: TLobby[] = []
    private _currentLobbyID: number = 0;
    
    private _users: TUser[] = []
}

export const testLobbyRepository = new LobbyRepository()