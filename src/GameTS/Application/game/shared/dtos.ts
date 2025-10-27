import { TMatchResult } from "../ServerGame.js"
import { CEndSceneConfigs } from "./SetupDependencies.js"
import { point, BALL_TYPES, SIDES, TControlsState } from "./sharedTypes.js"

// DTO type
export type Adto = | { type: "AssignID", dto: DTOAssignID }
                    | { type: "SGameDTO", dto: SGameDTO}
                    | { type: "CGameDTO", dto: CGameDTO}

// Server to Client
export type DTOAssignID = {
    clientID: number,
    humansID: number[]
}

export type SGameDTO = { type: "GameUpdateDTO", data: GameUpdateDTO }
                        | { type: "GameResult", data: CEndSceneConfigs }

export type GameUpdateDTO = {
    balls: {
        ballsState: {
            id: number,
            pos: point,
            speed: number
        }[],
        newBalls: {
            id: number,
            type: BALL_TYPES,
            size: point,
            speed: number,
            pos: point
        }[]
    }
    teams: {
        side: SIDES,
        score: number
    }[]
    paddles: {
        id: number
        pos: { x: number, y: number }
        size: { x: number, y: number }
        speed: number
    }[],
    timeLeft: number
    audioEvent: AudioEvent | null
}

export type AudioEvent = "start" | "paddleHit" | "wallHit" | "damageHit" | "faster" | "slower" | "longer" | "shorter" | "heal" | "bomb" | "skull" | "noHealth"


// Client to server
export type CGameDTO = {
    controlsState: {
        humanID:  number,
        controlsState: TControlsState
    }
}