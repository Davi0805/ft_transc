import { SIDES, BALL_TYPES } from "../shared/sharedTypes.js";
import SBall from "./SBall.js";
import Point from "../shared/Point.js";
import { getRandomInt } from "../shared/sharedUtils.js";
export default class SBallsManager {
    constructor(windowSize) {
        this._windowSize = windowSize;
        this._ballSpawnRate = 4;
        this._currentID = 0;
    }
    update(loop) {
        if (loop.isEventTime(this._ballSpawnRate)) {
            this.addBallOfType(getRandomInt(1, BALL_TYPES.BALL_TYPE_AM)); // 0 is basic, so this way only powerups are spawned
        }
        this.balls.forEach(ball => {
            ball.move(loop.delta);
        });
    }
    addBallOfType(type) {
        const damage = getRandomInt(1, 5);
        const direction = {
            x: (Math.random() + 0.3) * (Math.floor(Math.random() * 2) === 1 ? 1 : -1),
            y: (Math.random() + 0.3) * (Math.floor(Math.random() * 2) === 1 ? 1 : -1)
        };
        const configs = {
            type: type,
            size: { x: 8 + damage * 8, y: 8 + damage * 8 },
            pos: { x: this._windowSize.x / 2, y: this._windowSize.y / 2 },
            direction: direction,
            speed: 500 - (damage * 75),
            damage: damage
        };
        this.addBall(configs);
    }
    addBall(ballConfigs) {
        const newBall = new SBall(this._currentID++, Point.fromObj(ballConfigs.pos), Point.fromObj(ballConfigs.size), ballConfigs.speed, Point.fromObj(ballConfigs.direction), ballConfigs.type, ballConfigs.damage);
        this.balls.push(newBall);
        this._newBalls.push(newBall);
    }
    removeBall(index) {
        this.balls.splice(index, 1);
    }
    handleLimitCollision(teamsManager) {
        this.balls.forEach(ball => {
            let team = null;
            if (ball.cbox.x < 0) {
                ball.pos = Point.fromObj({ x: ball.cbox.width / 2, y: ball.pos.y });
                ball.direction.x *= -1;
                team = SIDES.LEFT;
            }
            else if (ball.cbox.x + ball.cbox.width > this._windowSize.x) {
                ball.pos = Point.fromObj({ x: this._windowSize.x - ball.cbox.width / 2, y: ball.pos.y });
                ball.direction.x *= -1;
                team = SIDES.RIGHT;
            }
            else if (ball.cbox.y < 0) {
                ball.pos = Point.fromObj({ x: ball.pos.x, y: ball.cbox.height / 2 });
                ball.direction.y *= -1;
                team = SIDES.TOP;
            }
            else if (ball.cbox.y + ball.cbox.height > this._windowSize.y) {
                ball.pos = Point.fromObj({ x: ball.pos.x, y: this._windowSize.y - ball.cbox.height / 2 });
                ball.direction.y *= -1;
                team = SIDES.BOTTOM;
            }
            if (team != null) {
                teamsManager.damageTeam(team, ball.damage);
            }
        });
    }
    handlePaddleCollision(paddle, teamsManager) {
        for (let i = this.balls.length - 1; i >= 0; i--) {
            const ball = this.balls[i];
            const collisionSide = ball.cbox.areColliding(paddle.cbox);
            if (collisionSide !== null) {
                if (ball.type === BALL_TYPES.BASIC) {
                    this._computeCollisionResult(collisionSide, ball, paddle);
                }
                else {
                    this._applyPowerupEffect(ball, paddle, teamsManager);
                    this.removeBall(i);
                }
            }
        }
    }
    getBallsDTO() {
        const out = {
            ballsState: this._balls.map(ball => ({
                id: ball.id,
                pos: ball.pos.toObj(),
                speed: ball.speed
            })),
            newBalls: this._newBalls.map(ball => ({
                id: ball.id,
                type: ball.type,
                size: ball.size.toObj(),
                speed: ball.speed,
                pos: ball.pos.toObj()
            }))
        };
        this._newBalls.length = 0;
        return out;
    }
    _windowSize;
    _balls = [];
    get balls() { return this._balls; }
    _newBalls = [];
    _ballSpawnRate;
    get ballSpawnRate() { return this._ballSpawnRate; }
    _currentID;
    _computeCollisionResult(collisionSide, ball, paddle) {
        switch (collisionSide) {
            case SIDES.LEFT: {
                ball.pos = Point.fromObj({ x: paddle.pos.x + ((paddle.cbox.width / 2) + (ball.size.x / 2)), y: ball.pos.y });
                if (ball.direction.x < 0) {
                    ball.direction.x *= -1;
                }
                break;
            }
            case SIDES.RIGHT: {
                ball.pos = Point.fromObj({ x: paddle.pos.x - ((paddle.cbox.width / 2) + (ball.size.x / 2)), y: ball.pos.y });
                if (ball.direction.x > 0) {
                    ball.direction.x *= -1;
                }
                break;
            }
            case SIDES.TOP: {
                ball.pos = Point.fromObj({ x: ball.pos.x, y: paddle.pos.y + ((paddle.cbox.height / 2) + (ball.size.y / 2)) });
                if (ball.direction.y < 0) {
                    ball.direction.y *= -1;
                }
                break;
            }
            case SIDES.BOTTOM: {
                ball.pos = Point.fromObj({ x: ball.pos.x, y: paddle.pos.y - ((paddle.cbox.height / 2) + (ball.size.y / 2)) });
                if (ball.direction.y > 0) {
                    ball.direction.y *= -1;
                }
            }
        }
    }
    _applyPowerupEffect(ball, paddle, teamsManager, type = ball.type) {
        switch (type) {
            case (BALL_TYPES.EXPAND): {
                paddle.size = paddle.size.add(Point.fromObj({ x: 0, y: 20 }));
                break;
            }
            case (BALL_TYPES.SHRINK): {
                paddle.size = paddle.size.add(Point.fromObj({ x: 0, y: -20 }));
                break;
            }
            case (BALL_TYPES.SPEED_UP): {
                paddle.speed += 100;
                break;
            }
            case (BALL_TYPES.SLOW_DOWN): {
                paddle.speed -= 100;
                break;
            }
            case (BALL_TYPES.EXTRA_BALL): {
                this.addBallOfType(BALL_TYPES.BASIC);
                break;
            }
            case (BALL_TYPES.RESTORE): {
                teamsManager.damageTeam(paddle.side, -ball.damage);
                break;
            }
            case (BALL_TYPES.DESTROY): {
                for (const team of Object.values(SIDES)) {
                    if (typeof team === "number" && team !== paddle.side) {
                        teamsManager.damageTeam(team, ball.damage);
                    }
                }
                break;
            }
            case (BALL_TYPES.MASSIVE_DAMAGE): {
                teamsManager.damageTeam(paddle.side, ball.damage * 10);
                break;
            }
            case (BALL_TYPES.MYSTERY): {
                this._applyPowerupEffect(ball, paddle, teamsManager, getRandomInt(1, BALL_TYPES.BALL_TYPE_AM));
            }
        }
    }
}
