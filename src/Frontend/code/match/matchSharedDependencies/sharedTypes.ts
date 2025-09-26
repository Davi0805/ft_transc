export type point = { x: number, y: number }
export type rectangle = { x: number, y: number, width: number, height: number }

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

export enum BALL_TYPES {
    BASIC,
    EXPAND,
    SHRINK,
    SPEED_UP,
    SLOW_DOWN,
    EXTRA_BALL,
    RESTORE,
    DESTROY,
    MASSIVE_DAMAGE,
    MYSTERY,
    BALL_TYPE_AM
}

export type TWindow = {
    size: point,
    backgroundSprite: number
}

export type TBall = {
    id: number
    type: BALL_TYPES
    size: point
    pos: point,
    direction: point,
    speed: number,
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
}