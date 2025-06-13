import { ApplicationOptions } from "pixi.js"
import { BALL_TYPES } from "../server/Objects/SBall"
 
export enum SIDES {
    LEFT,
    TOP,
    RIGHT,
    BOTTOM
}

export enum ROLES {
    BACK,
    FRONT
}

export type point = { x: number, y: number }
export type rectangle = { x: number, y: number, width: number, height: number }

// Common


type TWindow = {
    size: point,
    backgroundSprite: number
}

export type TBall = {
    id: number
    type: BALL_TYPES
    size: point
    pos: point,
    direction: point,
    speed: number
    spriteID: number,
    damage: number
}

export type TPaddle = {
    id: number
    side: SIDES,
    role: ROLES
    size: point,
    pos: point,
    speed: number,
    spriteID: number
}

export type TControlsState = {
    left: {
        pressed: boolean;
    },
    right: {
        pressed: boolean;
    },
    pause: {
        pressed: boolean;
    }
}

export type TControls = {
    left: string,
    right: string,
    pause: string
}


export type TUserCustoms = {
    field: {
        size: point
        backgroundSpriteID: number
    },
    gameLength: number,
    ball: { spriteID: number },
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
            controls: TControls
        }[],
    }[]
    // For now, there are no user customs for team. If added, an array for team should be added here
    
    bots: {
        paddleID: number,
        difficulty: number
    }[]
}

export type TGameConfigs = {
    field: {
        size: point
        backgroundSpriteID: number
    },
    gameLength: number,
    ball: TBall,
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
            controls: TControls
        }[],
    }[]
    bots: {
        paddleID: number,
        difficulty: number
    }[],
    startingScore: number
}


// Client

export type CGameState = {
    ball: Pick<TBall, "id" | "size" | "pos" | "spriteID">
    teams: {
        side: SIDES,
        score: {
            score: number,
            pos: point
        }
    }[]
    paddles: Pick<TPaddle, "id" | "side" | "size" | "pos" | "spriteID">[],
    gameLength: number
}

export type CGameSceneConfigs = {
    fieldSize: point
    controls: Map<number, TControls>
    gameInitialState: CGameState
}

export type CAppConfigs = {
    websocket: WebSocket,
    appConfigs: Partial<ApplicationOptions>,
    gameSceneConfigs: CGameSceneConfigs
}


export type ExampleSceneConfigs = {
    
}

export type SceneChangeDetail = | { sceneName: "exampleScene", configs: ExampleSceneConfigs }
                                | { sceneName: "gameScene", configs: CGameSceneConfigs }

// Server

export type SGameState = {
    ball: Pick<TBall,"type" | "pos" | "size" | "speed" | "direction" | "damage">,
    paddles: Pick<TPaddle, "id" | "side" | "size" | "pos" | "speed">[]
}

export type SGameConfigs = {
    window: Pick<TWindow, "size">,
    gameLength: number
    teams: {
        side: SIDES,
        score: number
    }[]
    humans: {
        id: number,
        paddleID: number,
    }[]
    bots: {
        paddleID: number,
        difficulty: number
    }[],
    gameInitialState: SGameState,
}

// DTO type
export type Adto = | { type: "AssignID", dto: DTOAssignID }
                    | { type: "SGameDTO", dto: SGameDTO}
                    | { type: "CGameDTO", dto: CGameDTO}

// Server to Client
export type DTOAssignID = {
    clientID: number,
    humansID: number[]
}

export type SGameDTO = {
    balls: {
        ballsState: {
            id: number,
            pos: point
        }[],
        newBalls: {
            id: number,
            type: BALL_TYPES,
            size: point
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
    }[],
    timeLeft: number
}

// Client to server
export type CGameDTO = {
    controlsState: {
        humanID:  number,
        controlsState: TControlsState
    }
}