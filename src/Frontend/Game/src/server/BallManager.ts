import { point, SIDES } from "../misc/types.js";
import SBall, { BALL_TYPES, SBALL_DEFAULT_SIZE, SBallState, TSBallConfigs } from "./SBall.js";
import SPaddle from "./SPaddle";
import Point from "../misc/Point.js";
import STeam from "./STeam";
import { getRandomInt } from "../misc/utils.js";

export default class BallManager {
    constructor(windowSize: point,  firstBallConfigs: TSBallConfigs) {
        this._windowSize = windowSize;
        this._currentID = 0;
        this.addBall(firstBallConfigs);
    }

    addBallOfType(type: BALL_TYPES) {
        const configs = {
            type: type,
            size: SBALL_DEFAULT_SIZE,
            pos: { x: this._windowSize.x / 2, y: this._windowSize.y / 2 },
            direction: { x: Math.random() * 1.8 - 0.9, y: Math.random() * 1.8 - 0.9},
            speed: getRandomInt(50, 250)
        };
        this.addBall(configs);
    }

    addBall(ballConfigs: TSBallConfigs) {
        console.log("Ball added with id: ", this._currentID)
        this.balls.push(new SBall(
            this._currentID++,
            Point.fromObj(ballConfigs.pos),
            Point.fromObj(ballConfigs.size),
            ballConfigs.speed,
            Point.fromObj(ballConfigs.direction),
            ballConfigs.type
        ))
    }

    moveBalls(delta: number) {
        this.balls.forEach(ball => {
            ball.move(delta);
        })
    }

    handleLimitCollision(teams: STeam[]) {
        this.balls.forEach(ball => {
            if (ball.cbox.x < 0) {
                ball.pos = Point.fromObj({ x: ball.cbox.width / 2, y: ball.pos.y })
                ball.direction.x *= -1
                const team = teams.find(team => team.side == SIDES.LEFT)
                if (team ) {
                    team.score += 1;
                }
            } else if (ball.cbox.x + ball.cbox.width > this._windowSize.x) {
                ball.pos = Point.fromObj({ x: this._windowSize.x - ball.cbox.width / 2, y: ball.pos.y })
                ball.direction.x *= -1;
                const team = teams.find(team => team.side == SIDES.RIGHT)
                if (team) {
                    team.score += 1;
                }
            } else if (ball.cbox.y < 0) {
                ball.pos = Point.fromObj({ x: ball.pos.x, y: ball.cbox.height / 2 })
                ball.direction.y *= -1;
                const team = teams.find(team => team.side == SIDES.TOP)
                if (team) {
                    team.score += 1;
                }
            } else if (ball.cbox.y + ball.cbox.height > this._windowSize.y) {
                ball.pos = Point.fromObj({ x: ball.pos.x, y: this._windowSize.y - ball.cbox.height / 2 })
                ball.direction.y *= -1;
                const team = teams.find(team => team.side == SIDES.BOTTOM)
                if (team) {
                    team.score += 1;
                }
            }
        })
    }

    handlePaddleCollision(paddle: SPaddle) {
        for (let i = this.balls.length - 1; i >= 0; i--) {
            const ball = this.balls[i];
            const collision = ball.cbox.areColliding(paddle.cbox);
            if (collision !== null) {
                if (ball.type === BALL_TYPES.EXPAND) {
                    paddle.size = paddle.size.add(Point.fromObj({ x: 0, y: 10 }))
                    this.balls.splice(i, 1);
                } else if (ball.type === BALL_TYPES.SHRINK) {
                    paddle.size = paddle.size.add(Point.fromObj({ x: 0, y: -10 }))
                    this.balls.splice(i, 1);
                } else {
                    switch (collision) {
                        case SIDES.LEFT: {
                            ball.pos = Point.fromObj({ x: paddle.pos.x + ((paddle.cbox.width / 2) + (ball.size.x / 2)), y: ball.pos.y})
                            if (ball.direction.x < 0) {
                                ball.direction.x *= -1;
                            }
                            break;
                        } case SIDES.RIGHT: {
                            ball.pos = Point.fromObj({ x: paddle.pos.x - ((paddle.cbox.width / 2) + (ball.size.x / 2)), y: ball.pos.y})
                            if (ball.direction.x > 0) {
                                ball.direction.x *= -1;
                            }
                            break ;
                        } case SIDES.TOP: {
                            ball.pos = Point.fromObj({ x: ball.pos.x, y: paddle.pos.y + ((paddle.cbox.height / 2) + (ball.size.y / 2)) })
                            if (ball.direction.y < 0) {
                                ball.direction.y *= -1;
                            }
                            break ;
                        } case SIDES.BOTTOM: {
                            ball.pos = Point.fromObj({ x: ball.pos.x, y: paddle.pos.y - ((paddle.cbox.height / 2) + (ball.size.y / 2)) })
                            if (ball.direction.y > 0) {
                                ball.direction.y *= -1;
                            }
                        }
                    }
                    if (ball.speed < 600) { //TODO put this in ball object as speed cap and maybe put it in speed getter
                        //ball.speed += 5;
                    }
                    paddle.speed += 1;
                }
            }
        }
    }

    private _windowSize: point;

    private _balls: SBall[] = []
    set balls(balls: SBall[]) { this._balls = balls; }
    get balls(): SBall[] { return this._balls; }

    private _currentID: number;
}