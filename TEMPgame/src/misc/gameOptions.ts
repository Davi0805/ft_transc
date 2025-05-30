import { SIDES, ROLES, point, TUserCustoms, TGameConfigs } from "./types.js"

const PADDLE_COMMON_VARS = {
    size: { x: 16, y: 64 },
    speed: 150
}


export const UserCustoms: TUserCustoms = {
    field: {
        size: { x: 500, y: 500 },
        backgroundSpriteID: 0 //NOT USED YET
    },
    gameLength: 0, //NOT USED YET
    ball: { spriteID: 0 },
    paddles: [
        {
            id: 0,
            side: SIDES.LEFT,
            role: ROLES.BACK,
            spriteID: 0
        },
        {
            id: 1,
            side: SIDES.LEFT,
            role: ROLES.FRONT,
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
            side: SIDES.RIGHT,
            role: ROLES.FRONT,
            spriteID: 0
        }
    ],
    clients: [
        {
            id: 0,
            humans: [
                {
                    id: 0,
                    paddleID: 0,
                    controls: {
                        left: "a",
                        right: "z",
                        pause: " "
                    }
                },
                {
                    id: 1,
                    paddleID: 1,
                    controls: {
                        left: "f",
                        right: "c",
                        pause: " "
                    }
                },
            ]
        },
        {
            id: 1,
            humans: [
                {
                    id: 2,
                    paddleID: 2,
                    controls: {
                        left: "m",
                        right: "k",
                        pause: " "
                    }
                },
                {
                    id: 3,
                    paddleID: 3,
                    controls: {
                        left: "b",
                        right: "g",
                        pause: " "
                    }
                }
            ]
        },
    ],
    bots: [
        {
            paddleID: 1,
            difficulty: 0 //NOT USED YET
        }
    ]
}


export function applyDevCustoms(userCustoms: TUserCustoms): TGameConfigs {

    const out: TGameConfigs = {
        field: userCustoms.field,
        gameLength: userCustoms.gameLength,
        ball: {
            spriteID: userCustoms.ball.spriteID,
            pos: { x: UserCustoms.field.size.x / 2, y: UserCustoms.field.size.y / 2 },
            direction: { x: Math.random() * 2 - 1, y: Math.random() * 2 - 1 },
            size: { x: 4, y: 4 },
            speed: 150
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
                    score: 0,
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
            speed: 150
        })
    })

    return out;
}

