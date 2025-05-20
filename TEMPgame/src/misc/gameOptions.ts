import { SIDES } from "./types.js"

const WINDOW_SIZE = { x: 200, y: 200 } // Has to be a square if it can accept four players, BUT in that case a better angle calculation for the ball is needed to avoid repetitive paths
const PADDLE_COMMON_VARS = {
    size: { x: 16, y: 64 },
    speed: 150
}

export const DevCustoms = {
    window: {
        size: WINDOW_SIZE
    },
    ball: {
        pos: { x: WINDOW_SIZE. x / 2, y: WINDOW_SIZE.y / 2 },
        direction: { x: Math.random() * 2 - 1, y: Math.random() * 2 - 1 },
        size: { x: 4, y: 4 },
        speed: 100
    },
    paddles: [
        {
            side: SIDES.LEFT,
            pos: { x: 20, y: WINDOW_SIZE.y / 2 },
            size: PADDLE_COMMON_VARS.size,
            speed: PADDLE_COMMON_VARS.speed
        },
        {
            side: SIDES.RIGHT,
            pos: { x: WINDOW_SIZE.x - 20, y: WINDOW_SIZE.y / 2 },
            size: PADDLE_COMMON_VARS.size,
            speed: PADDLE_COMMON_VARS.speed
        },
        {
            side: SIDES.BOTTOM,
            pos: { x: WINDOW_SIZE.x / 2, y: WINDOW_SIZE.y - 20 },
            size: PADDLE_COMMON_VARS.size,
            speed: PADDLE_COMMON_VARS.speed
        },
        {
            side: SIDES.TOP,
            pos: { x: WINDOW_SIZE.x / 2, y: 20 },
            size: PADDLE_COMMON_VARS.size,
            speed: PADDLE_COMMON_VARS.speed
        }
    ]
}

export const UserCustoms = {
    window: {
        backgroundSprite: 0
    },
    gameLength: 3.0,
    ball: {
        spriteID: 0
    },
    paddlesAmount: 4,
    clients: [
        {
            side: SIDES.LEFT,
            paddleSprite: 0,
            controls: {
                left: "a",
                right: "z",
                pause: " "
            }
        },
        {
            side: SIDES.RIGHT,
            paddleSprite: 1,
            controls: {
                left: "m",
                right: "k",
                pause: " "
            }
        }
    ]
}
