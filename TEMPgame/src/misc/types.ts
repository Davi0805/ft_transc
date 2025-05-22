import { ApplicationOptions } from "pixi.js"
import Point from "./Point"


export type Rectangle = {
    x: number,
    y: number,
    width: number,
    height: number
}
 
export enum SIDES {
    LEFT,
    RIGHT,
    BOTTOM,
    TOP
}

// Common

type TWindow = {
    size: Point,
    backgroundSprite: number
}

type TBall = {
    size: Point
    pos: Point,
    direction: Point,
    speed: number
    spriteID: number,
}

type TPaddle = {
    side: SIDES,
    size: Point,
    pos: Point,
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

export type TPlayer = {
    keyboardState: TControlsState
    paddleSide: SIDES 
}

export type TControls = {
    left: string,
    right: string,
    pause: string
}

// Client

export type CGameState = {
    ball: Pick<TBall, "size" | "pos" | "spriteID">
    paddles: Pick<TPaddle, "side" | "size" | "pos" | "spriteID">[]
}

export type CGameSceneConfigs = {
    controls: TControls
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
    ball: Pick<TBall, "pos" | "size" | "speed" | "direction">,
    paddles: Pick<TPaddle, "side" | "size" | "pos" | "speed">[]
}

export type SGameConfigs = {
    window: Pick<TWindow, "size">,
    players: TPlayer[],
    gameInitialState: SGameState,
}

// DTO type
export type Adto = | { type: "AssignID", dto: DTOAssignID }
                    | { type: "SGameDTO", dto: SGameDTO}
                    | { type: "CGameDTO", dto: CGameDTO}

// Server to Client
export type DTOAssignID = {
    id: number
}

export type SGameDTO = {
    ball: {
        pos: { x: number, y: number}
    }
    paddles: {
        side: SIDES,
        pos: { x: number, y: number }
    }[]
}

// Client to server
export type CGameDTO = {
    controlsState: TControlsState
}