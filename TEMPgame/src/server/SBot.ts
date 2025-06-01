import { point } from "../misc/types";
import SPaddle from "./SPaddle";
import SPlayer from "./SPlayer.js";
import SBall from "./SBall";

export default class SBot extends SPlayer {
    constructor(paddle: SPaddle, difficulty: number) {
        super(paddle);
        this._difficulty = difficulty;
    }

    setControlsBasedOnBall(ball: SBall, windowSize: point) {
        if (ball.pos.y > this.paddle.pos.y) {
            this.controls.left.pressed = false;
            this.controls.right.pressed = true;
        } else {
            this.controls.left.pressed = true;
            this.controls.right.pressed = false;
        }
    }

    private _difficulty: number;
    get difficulty(): number { return this._difficulty; }
}