import { ROLES, SIDES } from "../game/shared/sharedTypes.js"
import { MatchMapT, MatchSettingsT } from "./MatchRepository.js"
import { tournamentRepository } from "./TournamentRepository.js"
import { userRepository } from "./UserRepository.js"

export type LobbyTypeT = "friendly" | "ranked" | "tournament"

//LOBBY USER TYPES
//A user present in a lobby.
export type LobbyUserT = {
    id: number,
    username: string,
    spriteID: number,
    rating: number,

    ready: boolean,
    player: FriendlyPlayerT[] | RankedPlayerT | TournamentPlayerT | null
}
//The following three types represent the players that a lobby user controls when it applies to the event the lobby represents
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
export type TournamentPlayerT = {} //No need to have any members, as they will only be generated when the tournament starts

//LOBBY-RELATED TYPES
//General Lobby type
export type LobbyT = {
    id: number,
    hostID: number,
    name: string,
    type: LobbyTypeT
    matchSettings: MatchSettingsT
    users: LobbyUserT[]
}
//When a client wants to see the list of lobbies available, receives an array of these
export type LobbyForDisplayT = {
    id: number,
    name: string,
    host: string,
    type: LobbyTypeT
    capacity: { taken: number, max: number }
}
//The inbound object received when a user creates a lobby
export type LobbyCreationConfigsT = {
    name: string,
    type: LobbyTypeT,
    matchSettings: MatchSettingsT
}

class LobbyRepository {
    
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
                    taken: this._getParticipantsAm(lobby.users),
                    max: lobby.type === "tournament"
                        ? tournamentRepository.MAX_PARTICIPANTS
                        : this._getMaxPlayersFromMap(lobby.matchSettings.map)
                },
            })
        })
        return out 
    }

    private _lobbies: LobbyT[] = []

    private _currentID: number = 0;


    private _getParticipantsAm(users: LobbyUserT[]): number {
        const participants = users.filter(user => user.player !== null);
        return participants.length
    }

    private _getMaxPlayersFromMap(map: MatchMapT): number {
        const [amountStr, type, _size] = map.split("-");
        const amount = Number(amountStr);

        return (amount * (type === "teams" ? 2 : 1))
    }
}

export const lobbyRepository = new LobbyRepository()