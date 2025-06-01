import { point } from "../misc/types";
import SPaddle from "./SPaddle";
import SPlayer from "./SPlayer.js";
import SBall from "./SBall";

export default class SBot extends SPlayer {
    constructor(windowSize: point, paddle: SPaddle, difficulty: number) {
        super(paddle);
        this._difficulty = difficulty;
        this._timeSinceLastUpdate = 0;
        this._windowSize = windowSize
        this._targetPos = 0;
    }

    updateGameState(ball: SBall) {
        console.log("Prediction made");
        this._targetPos = ball.pos.y;
    }

    setupMove() {
        if (this._targetPos > this.paddle.pos.y) {
            this.controls.left.pressed = false;
            this.controls.right.pressed = true;
        } else {
            this.controls.left.pressed = true;
            this.controls.right.pressed = false;
        }
    }

    private _difficulty: number;
    get difficulty(): number { return this._difficulty; }

    private _timeSinceLastUpdate: number;
    set timeSinceLastUpdate(timeSinceLastUpdate: number) {
        this._timeSinceLastUpdate = timeSinceLastUpdate;
    }
    get timeSinceLastUpdate(): number {
        return this._timeSinceLastUpdate;
    }

    private _windowSize: point;

    private _targetPos: number;
}