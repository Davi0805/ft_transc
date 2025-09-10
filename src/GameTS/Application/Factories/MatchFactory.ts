import { ROLES, SIDES } from "../game/shared/sharedTypes.js"

/* type MatchT = {
    id: number,
    match: ServerGame,
    userIDs: number[],
    broadcastLoop: LoopController
} */

export type MatchSettingsT = {
    map: MatchMapT,
    mode: MatchModeT,
    duration: MatchDurationT
}

//This type is only created for match creation purposes.
// It is a unification that allows a match to parse players no matter the type
export type MatchPlayerT = {
    id: number,
    userID: number,
    nickname: string,
    spriteID: number,
    team: SIDES,
    role: ROLES
}

export type MatchMapT = "2-players-small" | "2-players-medium" | "2-players-big" | "4-players-small" | "4-players-medium" | "4-players-big"
    | "2-teams-small" | "2-teams-medium" | "2-teams-big" | "4-teams-small" | "4-teams-medium" | "4-teams-big"
export type MatchModeT = "classic" | "modern"
export type MatchDurationT = "blitz" | "rapid" | "classical" | "long" | "marathon"
