import { SIDES, ROLES, point, TPaddle, TBall } from "./sharedTypes"

export type TControls = {
    left: string,
    right: string,
}

export type TUserCustoms = {
    field: {
        size: point
        backgroundSpriteID: number
    },
    matchLength: number,
    startingScore: number,
    paddles: {
        id: number
        side: SIDES,
        role: ROLES,
        spriteID: number,
    }[],
    clients: {
        id: number,
        humans: {
            id: number,
            paddleID: number,
        }[],
    }[]
    // For now, there are no user customs for team. If added, an array for team should be added here
    
    bots: {
        paddleID: number,
        difficulty: number
    }[],
}

export type TGameConfigs = {
    field: {
        size: point
        backgroundSpriteID: number
    },
    matchLength: number,
    teams: {
        side: SIDES,
        score: {
            score: number
            pos: point
        }
    }[]
    paddles: TPaddle[],
    clients: {
        id: number,
        humans: {
            id: number,
            paddleID: number,
        }[],
    }[]
    bots: {
        paddleID: number,
        difficulty: number
    }[],
    startingScore: number
}

export type CGameState = {
    teams: {
        side: SIDES,
        score: {
            score: number,
            pos: point
        }
    }[]
    paddles: Pick<TPaddle, "id" | "side" | "size" | "speed" | "pos" | "spriteID">[],
    balls: TBall[],
    gameLength: number
}

export type CGameSceneConfigs = {
    fieldSize: point
    controls: {
        humanID: number,
        controls: TControls
    }[] | null
    gameInitialState: CGameState
}


export type CAppConfigs = {
    appConfigs: { width: number, height: number },
    gameSceneConfigs: CGameSceneConfigs
}