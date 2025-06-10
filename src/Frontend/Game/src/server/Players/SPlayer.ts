import { TControlsState } from "../../misc/types.js"
import SPaddle from "../Objects/SPaddle.js";

export default abstract class SPlayer {
    constructor(paddle: SPaddle) {
            this._controls = {
                left: { pressed: false },
                right: { pressed: false },
                pause: { pressed: false }
            };
            this._paddle = paddle;
        }
    
        movePaddleFromControls(delta: number) {
            if (this.controls.left.pressed || this.controls.right.pressed) {
                let movVector = this.paddle.orientation.multiplyScalar(this.paddle.speed * delta)
                                .rotate(this.controls.left.pressed ? -90 : 90);
                this.paddle.move(movVector);
            }
        }
    
        private _controls: TControlsState;
        set controls(controls: TControlsState) { this._controls = controls; }
        get controls(): TControlsState { return this._controls; }
    
        private _paddle: SPaddle;
        set paddle(paddle: SPaddle) { this._paddle = paddle; }
        get paddle(): SPaddle { return this._paddle; }
}