import { SIDES, ROLES, point, TUserCustoms, TGameConfigs } from "./types.js"


export const UserCustoms: TUserCustoms = {
    field: {
        size: { x: 800, y: 800 },
        backgroundSpriteID: 0 //NOT USED YET
    },
    matchLength: 200,
    paddles: [
        {
            id: 0,
            side: SIDES.LEFT,
            role: ROLES.BACK,
            spriteID: 0
        },
        {
            id: 1,
            side: SIDES.RIGHT,
            role: ROLES.BACK,
            spriteID: 0
        },
/*         {
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
        {
            id: 4,
            side: SIDES.LEFT,
            role: ROLES.FRONT,
            spriteID: 0
        } */
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
                },
                {
                    id: 2,
                    paddleID: 1,
                    controls: {
                        left: "m",
                        right: "k",
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
                    paddleID: 2,
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
        /* {
            paddleID: 1,
            difficulty: 1 // Number of seconds between predictions (1 is hardest and also minimum!!)
        }, */
        /* {
            paddleID: 2,
            difficulty: 1 // Number of seconds between predictions (1 is hardest and also minimum!!)
        }, */
        /* {
            paddleID: 3,
            difficulty: 1 // Number of seconds between predictions (1 is hardest and also minimum!!)
        }, */
    ]
}


export function applyDevCustoms(userCustoms: TUserCustoms): TGameConfigs {

    const out: TGameConfigs = {
        field: userCustoms.field,
        matchLength: userCustoms.matchLength,
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
        const scoreOffset = 140
        const paddleOffset = (paddle.role === ROLES.BACK ? 40 : 80);
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
            size: { x: 32, y: 128 },
            speed: 400
        })
    })

    return out;
}

