import { ROLES, SIDES } from "../../../../../TempIsolatedMatchLogic/src/misc/types"

export type RequestResponseMap = {
    GETamIParticipating: {
        request: null //TODO check if it is necessary to send the userid
        response: boolean
    },
    GETisEveryoneReady: {
        request: null,
        response: boolean
    },
    GETparticipatingPlayers: {
        request: null,
        response: TMatchPlayer[]
    },
    POSTupdateMyReadiness: {
        request: boolean,
        response: null
    }
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
    userID: number,
    id: number, //This is the same as userID if in a friendly match
    nick: string
    paddleID: number, //Maybe not necessary? Connection might be only necessary to be created later
    spriteID: number,
    team: SIDES,
    role: ROLES
    leftControl: string,
    rightControl: string
}

export type TTournPlayer = {
    id: number
    nick: string
    score: number
    rating: number
    prevOpponents: number[]
    teamDist: number
}