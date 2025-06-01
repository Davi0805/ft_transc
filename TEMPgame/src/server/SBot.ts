import { point } from "../misc/types";
import SPaddle from "./SPaddle";
import SPlayer from "./SPlayer.js";
import SBall from "./SBall";

const EPSILON = 2

export default class SBot extends SPlayer {
    constructor(windowSize: point, paddle: SPaddle, difficulty: number) {
        super(paddle);
        this._updateRate = difficulty;
        this._timeSinceLastUpdate = 0;
        
        this._windowSize = windowSize
        
        this._movementAxis = paddle.orientation.x != 0 ? 'y' : 'x';
        
        const orientationAxis = paddle.orientation.x != 0 ? 'x' : 'y';

        this._targetPos = 0;

        if ((orientationAxis === 'x' && this.paddle.orientation[orientationAxis] > 0)
                || (orientationAxis === 'y' && this.paddle.orientation[orientationAxis] < 0)) {
            this._mustMoveLeft = (() => this._targetPos > this.paddle.pos[this._movementAxis]);
        } else {
            this._mustMoveLeft = (() => this._targetPos < this.paddle.pos[this._movementAxis]);
        }
    }

    updateGameState(ball: SBall) {
        console.log("Prediction made");
        this._targetPos = ball.pos[this._movementAxis];
    }

    setupMove() {
        if (this._aproxCompare(this._targetPos, this.paddle.pos[this._movementAxis])) {
            this.controls.left.pressed = false;
            this.controls.right.pressed = false;
            return ;
        }
        if (this._mustMoveLeft()) {
            this.controls.left.pressed = false;
            this.controls.right.pressed = true;
        } else {
            this.controls.left.pressed = true;
            this.controls.right.pressed = false;
        }
    }

    private _updateRate: number;
    get updateRate(): number { return this._updateRate; }

    private _timeSinceLastUpdate: number;
    set timeSinceLastUpdate(timeSinceLastUpdate: number) {
        this._timeSinceLastUpdate = timeSinceLastUpdate;
    }
    get timeSinceLastUpdate(): number {
        return this._timeSinceLastUpdate;
    }

    private _windowSize: point;

    private _movementAxis: 'x' | 'y';

    private _targetPos: number;

    private _aproxCompare(n1: number, n2: number) {
        return (Math.abs(n1 - n2) < EPSILON);
    }

    private _mustMoveLeft;
}