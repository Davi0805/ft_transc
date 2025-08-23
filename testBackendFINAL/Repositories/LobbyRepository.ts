import { ROLES, SIDES } from "../game/shared/sharedTypes.js"
import { getMaxPlayersFromMap, getParticipantsAm } from "../tempHelpers.js"
import { MatchSettingsT } from "./MatchRepository.js"
import { userRepository } from "./UserRepository.js"

export type LobbyTypeT = "friendly" | "ranked" | "tournament"
export type LobbyUserT = {
    id: number,
    username: string,
    spriteID: number,
    rating: number,

    ready: boolean,
    player: FriendlyPlayerT[] | RankedPlayerT | TournamentPlayerT | null
}
export type FriendlyPlayerT = {
    id: number,
    nickname: string,
    spriteID: number,
    team: SIDES,
    role: ROLES
}
export type RankedPlayerT = {
    team: SIDES,
    role: ROLES
}
export type TournamentPlayerT = {
    /* score: number,
    prevOpponents: number[],
    teamPref: number */

    //SHOULD NOT NEED ANY OF THESE, AS THEY ARE CREATED WHEN THE TOURNAMENT STARTS!
}

export type LobbyT = {
    id: number,
    hostID: number,
    name: string,
    type: LobbyTypeT
    matchSettings: MatchSettingsT
    users: LobbyUserT[]
}

export type LobbyForDisplayT = {
    id: number,
    name: string,
    host: string,
    type: LobbyTypeT
    capacity: { taken: number, max: number }
}

export type LobbyCreationConfigsT = {
    name: string,
    type: LobbyTypeT,
    matchSettings: MatchSettingsT
}

class LobbyRepository {
    
    getLobbyByID(lobbyID: number) {
        const lobby = this._lobbies.find(lobby => lobby.id === lobbyID)
        if (!lobby) { throw Error(`Lobby with lobbyID ${lobbyID} not found!`)}
        return lobby
    }

    getLobbyUserByID(lobbyID: number, userID: number) {
        const lobby = lobbyRepository.getLobbyByID(lobbyID);
        const user = lobby.users.find(user => user.id === userID);
        if (!user) {throw Error("User could not be found in lobby!")};
        return user;
    }

    getAllLobbiesForDisplay() {
        const out: LobbyForDisplayT[] = []
        this._lobbies.forEach(lobby => {
            out.push({
                id: lobby.id,
                name: lobby.name,
                host: userRepository.getUserByID(lobby.hostID).username,
                type: lobby.type,
                capacity: {
                    taken: getParticipantsAm(lobby.users),
                    max: getMaxPlayersFromMap(lobby.matchSettings.map)
                },
            })
        })
        return out 
    }

    createLobby(configs: LobbyCreationConfigsT, userID: number) {
        console.log(configs.matchSettings)
        const newLobby: LobbyT = {
            id: this._currentID,
            hostID: userID,
            name: configs.name,
            type: configs.type,
            matchSettings: configs.matchSettings,
            users: []
        }
        this._lobbies.push(newLobby)

        return this._currentID++
    }

    private _lobbies: LobbyT[] = []

    private _currentID: number = 0;
}

export const lobbyRepository = new LobbyRepository()