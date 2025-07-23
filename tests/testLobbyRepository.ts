import { LobbiesListDTO, LobbyCreationConfigsDTO, TDynamicLobbySettings, TFriendlyPlayer, TLobby, TLobbyUser, TRankedPlayer, TTournamentPlayer } from "./dependencies/lobbyTyping.js";
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
    createLobby(configs: LobbyCreationConfigsDTO, userID: number): number {
        let userInfo = this._getUserByID(userID)

        const newLobby: TLobby = {
            id: this._currentUID,
            hostID: userID,
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
        
        return this._currentUID++
    }
    //Second argument should not be neccessary. Or at least only id is necessary, username is only to register user if it does not exist, which in production always should
    addUserToLobby(lobbyID: number, userID: number) {
        const lobby = this.getLobbyByID(lobbyID);
        const userInfo = this._getUserByID(userID);
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

    removeUserFromLobby(lobbyID: number, userID: number) {
        const lobby = this.getLobbyByID(lobbyID)
        lobby.users = lobby.users.filter(user => user.id !== userID)
        lobbySocketService.broadcast(lobbyID, "removeLobbyUser", { id: userID })
        //If lobby has no users, clean it up
        console.log(lobby.users)
        console.log(lobby.users.length)
        if (lobby.users.length === 0) {
            console.log("lobby was supposedly deleted")
            this._lobbies = this._lobbies.filter(lobby => lobby.id !== lobbyID)
        }
    }


    updateSettings(lobbyID: number, settings: TDynamicLobbySettings): TLobbyUser[] | null { //returns whether users must be updated in broadcast
        const lobby = this.getLobbyByID(lobbyID);
        let updateUsers = lobby.map !== settings.map && lobby.type !== "tournament"
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

    updateReadiness(lobbyID: number, userID: number, ready: boolean) {
        const lobby = this.getLobbyByID(lobbyID);
        const user = this._getLobbyUserByID(lobby, userID);
        user.ready = ready
    }
    
    addFriendlyPlayer(lobbyID: number, userID: number, player: TFriendlyPlayer) {
        const lobby = this.getLobbyByID(lobbyID)
        const user = this._getLobbyUserByID(lobby, userID)
        player.id = this._currentUID++;
        if (!user.player) {
            user.player = [player]
        } else {
            (user.player as TFriendlyPlayer[]).push(player)
        }
        console.log("friendly player added. players are now: ")
        console.log(user.player)
    }
    removeFriendlyPlayer(lobbyID: number, userID: number, playerID: number) {
        const lobby = this.getLobbyByID(lobbyID)
        const user = this._getLobbyUserByID(lobby, userID)
        if (!user.player) {throw Error()}
        user.player = (user.player as TFriendlyPlayer[]).filter(player => player.id !== playerID)
        if (user.player.length === 0) { user.player = null}
        console.log("friendly player removed. players are now: ")
        console.log(user.player)
    }
    
    addRankedPlayer(lobbyID: number, userID: number, player: TRankedPlayer) {
        const lobby = this.getLobbyByID(lobbyID)
        const user = this._getLobbyUserByID(lobby, userID)
        user.player = player
    }
    removeRankedPlayer(lobbyID: number, userID: number) {
        const lobby = this.getLobbyByID(lobbyID)
        const user = this._getLobbyUserByID(lobby, userID)
        user.player = null
    }

    addTournamentPlayer(lobbyID: number, userID: number): TTournamentPlayer {
        const lobby = this.getLobbyByID(lobbyID)
        const user = this._getLobbyUserByID(lobby, userID)
        if (user.player) {
            (user.player as TTournamentPlayer).participating = true
        } else {
            user.player = {
                participating: true,
                score: 0,
                prevOpponents: [],
                teamPref: 0
            } as TTournamentPlayer
        }
        return (user.player as TTournamentPlayer)
    }
    removeTournamentPlayer(lobbyID: number, userID: number) {
        const lobby = this.getLobbyByID(lobbyID)
        const user = this._getLobbyUserByID(lobby, userID);
        (user.player as TTournamentPlayer).participating = false
    }

    leaveLobby(lobbyID: number, userID: number) {
        const lobby = this.getLobbyByID(lobbyID)
        lobby.users = lobby.users.filter(user => user.id === userID)
    }
    //TODO startgame

    _getLobbyUserByID(lobby: TLobby, userID: number): TLobbyUser {
        const user = lobby.users.find(user => user.id === userID);
        if (!user) {throw Error("user does not exist")}
        return user
    }
    _getUserByID(userID: number) {
        let userInfo = this._users.find(user => user.id === userID)
        if (!userInfo) {
            //This substitutes the register system. Should not be done in production
            userInfo = {
                id: userID,
                username: `User${userID}`,
                spriteID: 0,
                rating: 1500
            }
            this._users.push(userInfo)
        }
        return userInfo
    }

    private _lobbies: TLobby[] = []
    private _currentUID: number = 0;
    
    private _users: TUser[] = []
}

export const testLobbyRepository = new LobbyRepository()