import { TUserCustoms } from "../../match/matchSharedDependencies/SetupDependencies"
import { SIDES, ROLES } from "../../match/matchSharedDependencies/sharedTypes"

export type InboundDTOMap = {
    inviteUserToLobby: {
        userID: number
    }
    updateMyReadiness: {
        ready: boolean 
    },
    addMatchPlayer: {
        player: TMatchPlayer
    },
    removeMatchPlayer: null, //TODO: Backend needs to know which player to remove
    addTournPlayer: null,
    withdrawTournPlayer: null,
    leaveLobby: null,
    startGame: {
        settings: TUserCustoms,
    }
}

export type OutboundDTOMap = {
    updateSettings: {
        settings: TLobby
    },
    updatePlayers: {
        players: TMatchPlayer[] | TTournPlayer[],
    },
    startMatch: {
        settings: TLobby,
        players: TMatchPlayer[] | TTournPlayer[]
    }
}

export type InboundDTO<T extends keyof InboundDTOMap = keyof InboundDTOMap> = {
    requestType: T,
    lobbyID: number,
    data: InboundDTOMap[T]
}

export type OutboundDTO = {
    [K in keyof OutboundDTOMap]: {
        requestType: K,
        data: OutboundDTOMap[K]
    }
}[keyof OutboundDTOMap]





export type TLobbyType = "friendly" | "ranked" | "tournament"
export type TMapType = "2-players-small" | "2-players-medium" | "2-players-big" | "4-players-small" | "4-players-medium" | "4-players-big"
    | "2-teams-small" | "2-teams-medium" | "2-teams-big" | "4-teams-small" | "4-teams-medium" | "4-teams-big"
export type TMatchCapacity = { taken: number, max: number }
export type TMatchMode = "classic" | "modern"
export type TMatchDuration = "blitz" | "rapid" | "classical" | "long" | "marathon"

export type TLobby = {
    id: number,
    hostID: number,
    name: string,
    host: string,
    type: TLobbyType,
    capacity: TMatchCapacity,
    map: TMapType,
    mode: TMatchMode,
    duration: TMatchDuration,
    round: number
}

export type TStaticLobbySettings = Pick<TLobby, "id" | "hostID" | "name" | "host" | "type">;
export type TDynamicLobbySettings = Pick<TLobby, "map" | "mode" | "duration">

export type TMatchPlayer = {
    userID: number | null, //To be taken from auth
    id: number | null, //To be generated.
    nick: string | null //If null, take the nick from userid
    //paddleID: number, //Maybe not necessary? Connection might be only necessary to be created later
    spriteID: number | null, //If null, take spriteID from settings of userid
    team: SIDES,
    role: ROLES,
    leftControl: string,
    rightControl: string
}

export type TTournPlayer = {
    id: number | null // To be taken from auth
    nick: string | null // To be taken from userid
    score: number //default: 0
    rating: number //get from userid
    prevOpponents: number[] //default[]
    teamDist: number //default: 0
    participating: boolean //default: true
    //TODO: IN TOURNAMENT SERVICE, ONLY PAIR PLAYERS THAT HAVE THIS FLAG SET TO TRUE!!!!
}