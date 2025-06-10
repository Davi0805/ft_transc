import { BALL_TYPES, SBALL_DEFAULT_SIZE } from "../server/Objects/SBall.js"
import { SIDES, ROLES, point, TUserCustoms, TGameConfigs } from "./types.js"

const PADDLE_COMMON_VARS = {
    size: { x: 16, y: 64 },
    speed: 150
}


export const UserCustoms: TUserCustoms = {
    field: {
        size: { x: 400, y: 400 },
        backgroundSpriteID: 0 //NOT USED YET
    },
    gameLength: 0, //NOT USED YET
    ball: { spriteID: 0 },
    paddles: [
        {
            id: 0,
            side: SIDES.LEFT,
            role: ROLES.BACK,
            spriteID: 1
        },
        {
            id: 1,
            side: SIDES.TOP,
            role: ROLES.BACK,
            spriteID: 0
        },
        {
            id: 2,
            side: SIDES.RIGHT,
            role: ROLES.BACK,
            spriteID: 0
        },
        {
            id: 3,
            side: SIDES.BOTTOM,
            role: ROLES.BACK,
            spriteID: 0
        },
    ],
    // Clients are the sockets. Each one can have a different human playing. This allows for couch coop
    clients: [
        {
            id: 0,
            humans: [
                {
                    id: 0,
                    paddleID: 0,
                    controls: {
                        left: "ArrowUp",
                        right: "ArrowDown",
                        pause: " "
                    }
                }
            ]
        },
        /* {
            id: 1,
            humans: [
                {
                    id: 1,
                    paddleID: 3,
                    controls: {
                        left: "ArrowDown",
                        right: "ArrowUp",
                        pause: " "
                    }
                }
            ]
        } */
    ],
    bots: [
        /* {
            paddleID: 0,
            difficulty: 1 // Number of seconds between predictions (1 is hardest and also minimum!!)
        }, */
        {
            paddleID: 1,
            difficulty: 1 // Number of seconds between predictions (1 is hardest and also minimum!!)
        },
        {
            paddleID: 2,
            difficulty: 1 // Number of seconds between predictions (1 is hardest and also minimum!!)
        },
        {
            paddleID: 3,
            difficulty: 1 // Number of seconds between predictions (1 is hardest and also minimum!!)
        },
    ]
}


export function applyDevCustoms(userCustoms: TUserCustoms): TGameConfigs {

    const out: TGameConfigs = {
        field: userCustoms.field,
        gameLength: userCustoms.gameLength,
        ball: {
            id: 0,
            type: BALL_TYPES.BASIC,
            spriteID: userCustoms.ball.spriteID,
            pos: { x: UserCustoms.field.size.x / 2, y: UserCustoms.field.size.y / 2 },
            direction: { x: Math.random() - 0.5, y: Math.random() - 0.5 },
            
            //pos: { x: 20, y: 50},
            //direction: { x: 0, y: 1 }, 
            size: SBALL_DEFAULT_SIZE,
            speed: 100
        },
        teams: [],
        paddles: [],
        clients: userCustoms.clients,
        bots: userCustoms.bots,
        startingScore: 0
    }

    // Apply dev customs for each individual paddle and team
    userCustoms.paddles.forEach(paddle => {
        let scorePos: point;
        let paddlePos: point;
        const scoreOffset = 70
        const paddleOffset = (paddle.role === ROLES.BACK ? 20 : 40);
        switch (paddle.side) {
            case (SIDES.LEFT): {
                scorePos = { x: scoreOffset, y: userCustoms.field.size.y / 2}
                paddlePos = { x: paddleOffset, y: userCustoms.field.size.y / 2 };
                break;
            }
            case (SIDES.RIGHT): {
                scorePos = { x: userCustoms.field.size.x - scoreOffset, y: userCustoms.field.size.y / 2 }
                paddlePos = { x: userCustoms.field.size.x - paddleOffset, y: userCustoms.field.size.y / 2 }
                break; 
            }
            case (SIDES.TOP): {
                scorePos = { x: userCustoms.field.size.x / 2, y: scoreOffset };
                paddlePos = { x: userCustoms.field.size.x / 2, y: paddleOffset };
                break;
            }
            case (SIDES.BOTTOM): {
                scorePos = { x: userCustoms.field.size.x / 2, y: userCustoms.field.size.y - scoreOffset}
                paddlePos = { x: userCustoms.field.size.x / 2, y: userCustoms.field.size.y - paddleOffset}
            }
        }

        if (out.teams.find(team => team.side === paddle.side) === undefined) {
            out.teams.push({
                side: paddle.side,
                score: {
                    score: 100,
                    pos: scorePos
                }
            })
        }
        out.paddles.push({
            id: paddle.id,
            side: paddle.side,
            role: paddle.role,
            spriteID: paddle.spriteID,
            pos: paddlePos,
            size: { x: 16, y: 64 },
            speed: 200
        })
    })

    return out;
}

