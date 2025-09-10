import { ROLES, SIDES } from "../game/shared/sharedTypes.js"
import { MatchSettingsT } from "./MatchFactory.js"

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
    readonly id: number,
    hostID: number,
    name: string,
    type: LobbyTypeT
    matchSettings: MatchSettingsT
    users: LobbyUserT[]
}

//The inbound object received when a user creates a lobby
export type LobbyCreationConfigsT = {
    name: string,
    type: LobbyTypeT,
    matchSettings: MatchSettingsT
}

class LobbyFactory {
    createLobby(configs: LobbyCreationConfigsT, userID: number) {
        const newLobby: LobbyT = {
            id: this._currentID++,
            hostID: userID,
            name: configs.name,
            type: configs.type,
            matchSettings: configs.matchSettings,
            users: []
        }
        return newLobby
    }

    private _currentID: number = 0;
}

const lobbyFactory = new LobbyFactory();
export default lobbyFactory;