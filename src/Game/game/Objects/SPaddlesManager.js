import SPaddle from "./SPaddle.js";
import Point from "../shared/Point.js";
;
export default class SPaddlesManager {
    constructor(paddles, windowSize) {
        this._windowSize = windowSize;
        paddles.forEach(paddle => {
            this._paddles.push(new SPaddle(paddle.id, paddle.side, Point.fromObj(paddle.pos), Point.fromObj(paddle.size), paddle.speed));
        });
    }
    update(loop) {
        this._paddles.forEach(paddle => {
            paddle.move(loop.delta);
        });
    }
    handleCollisions(ballsManager, teamsManager) {
        this._handleLimitsCollision();
        this._paddles.forEach(paddle => {
            ballsManager.handlePaddleCollision(paddle, teamsManager);
        });
    }
    deactivatePaddles(team) {
        const paddlesOfTeam = this.paddles.filter(paddle => paddle.side === team);
        paddlesOfTeam.forEach(paddle => {
            paddle.active = false;
        });
    }
    getPaddlesDTO() {
        return this._paddles.map(paddle => ({
            id: paddle.id,
            pos: paddle.pos.toObj(),
            size: paddle.size.toObj(),
            speed: paddle.speed
        }));
    }
    _paddles = [];
    get paddles() { return this._paddles; }
    _windowSize;
    _handleLimitsCollision() {
        this._paddles.forEach(paddle => {
            if (paddle.cbox.x < 0) { // LEFT
                paddle.pos.x = paddle.cbox.width / 2;
            }
            if (paddle.cbox.x + paddle.cbox.width > this._windowSize.x) { // RIGHT
                paddle.pos.x = this._windowSize.x - paddle.cbox.width / 2;
            }
            if (paddle.cbox.y < 0) { // TOP
                paddle.pos.y = paddle.cbox.height / 2;
            }
            if (paddle.cbox.y + paddle.cbox.height > this._windowSize.y) { // BOTTOM
                paddle.pos.y = this._windowSize.y - paddle.cbox.height / 2;
            }
        });
    }
}
