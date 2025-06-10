import SPaddle, { TSPaddleConfigs } from "./SPaddle.js";
import Point from "../../misc/Point.js";
import { point } from "../../misc/types.js";
import SBallsManager from "./SBallsManager.js";

export default class SPaddlesManager {
    constructor(paddles: TSPaddleConfigs, windowSize: point) {
        this._windowSize = windowSize
        paddles.forEach(paddle => {
            this._paddles.push( 
                new SPaddle(
                    paddle.id,
                    paddle.side,
                    Point.fromObj(paddle.pos),
                    Point.fromObj(paddle.size),
                    paddle.speed
                ),
            )
        })
    }

    handleCollisions(ballsManager: SBallsManager) {
        this.paddles.forEach(paddle => {
            ballsManager.handlePaddleCollision(paddle);
            this._handlePaddleLimitsCollision(paddle);
        })
    }

    getPaddlesDTO() {
        return this._paddles.map(paddle => ({
            id: paddle.id,
            pos: paddle.pos.toObj(),
            size: paddle.size.toObj()
        }))
    }

    private _paddles: SPaddle[] = []
    get paddles() { return this._paddles; }

    private _windowSize: point;

    private _handlePaddleLimitsCollision(paddle: SPaddle) {
        if (paddle.cbox.x < 0) {
            paddle.pos.x = paddle.cbox.width / 2;
        }
        if (paddle.cbox.x + paddle.cbox.width > this._windowSize.x) {
            paddle.pos.x = this._windowSize.x - paddle.cbox.width / 2;
        }
        if (paddle.cbox.y < 0) {
            paddle.pos.y = paddle.cbox.height / 2;
        }
        if (paddle.cbox.y + paddle.cbox.height > this._windowSize.y) {
            paddle.pos.y = this._windowSize.y - paddle.cbox.height / 2;
        }
    }
}