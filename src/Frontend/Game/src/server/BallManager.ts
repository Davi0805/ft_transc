import { point, SIDES } from "../misc/types.js";
import SBall from "./SBall";
import SPaddle from "./SPaddle";
import Point from "../misc/Point.js";
import STeam from "./STeam";

export default class BallManager {
    constructor(firstBall: SBall) {
        this._balls.push(firstBall);
    }

    moveBalls(delta: number) {
        this.balls.forEach(ball => {
            ball.move(delta);
        })
    }

    handleLimitCollision(windowSize: point, teams: STeam[]) {
        this.balls.forEach(ball => {
            if (ball.cbox.x < 0) {
                ball.pos = Point.fromObj({ x: ball.cbox.width / 2, y: ball.pos.y })
                ball.direction.x *= -1
                const team = teams.find(team => team.side == SIDES.LEFT)
                if (team) {
                    team.score += 1;
                }
            } else if (ball.cbox.x + ball.cbox.width > windowSize.x) {
                ball.pos = Point.fromObj({ x: windowSize.x - ball.cbox.width / 2, y: ball.pos.y })
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
            } else if (ball.cbox.y + ball.cbox.height > windowSize.y) {
                ball.pos = Point.fromObj({ x: ball.pos.x, y: windowSize.y - ball.cbox.height / 2 })
                ball.direction.y *= -1;
                const team = teams.find(team => team.side == SIDES.BOTTOM)
                if (team) {
                    team.score += 1;
                }
            }
        })
    }

    handlePaddleCollision(paddle: SPaddle) {
        this.balls.forEach(ball => {
            const collision = ball.cbox.areColliding(paddle.cbox);
            if (collision !== null) {
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
                    ball.speed += 5;
                }
                paddle.speed += 1;
            }
        })
        
    }

    private _balls: SBall[] = []
    set balls(balls: SBall[]) { this._balls = balls; }
    get balls(): SBall[] { return this._balls; }
}