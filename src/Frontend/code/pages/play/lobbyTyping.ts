import { ROLES, SIDES } from "../../../../../TempIsolatedMatchLogic/src/misc/types"

export type RequestResponseMap = {
    GETmySettings: {
        request: null,
        response: TLobby
    }
    GETamIParticipating: {
        request: null
        response: boolean
    },
    GETisEveryoneReady: {
        request: null,
        response: boolean
    },
    GETmatchPlayers: {
        request: null,
        response: TMatchPlayer[]
    },
    GETtournPlayers: {
        request: null,
        response: TTournPlayer[]
    }
    GETselectedMap: {
        request: null,
        response: TMapType
    },
    GETcurrentRoundNo: {
        request: null,
        response: number
    },
    POSTupdateLobby: {
        request: TDynamicLobbySettings,
        response: null
    },
    POSTinviteUserToLobby: {
        request: number,
        response: null
    }
    POSTupdateMyReadiness: {
        request: boolean,
        response: null
    },
    POSTaddMatchPlayer: {
        request: TMatchPlayer,
        response: null
    },
    POSTaddTournPlayer: {
        request: null,
        response: null
    },
    POSTwithdrawTournPlayer: {
        request: null,
        response: null
    }
    POSTleaveLobby: {
        request: null,
        response: null
    }
}

export type lobbyRequestDTO<T extends keyof RequestResponseMap = keyof RequestResponseMap> = {
    requestType: T,
    lobbyID: number,
    requestID: number,
    data: RequestResponseMap[T]['request']
}

export type lobbyResponseDTO<T extends keyof RequestResponseMap = keyof RequestResponseMap> = {
    requestID: number,
    data: RequestResponseMap[T]['response']
}





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