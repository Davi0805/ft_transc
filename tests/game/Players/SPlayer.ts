import { TControlsState } from "../shared/sharedTypes.js"
import SPaddle, { MOVEMENT } from "../Objects/SPaddle.js";

export default abstract class SPlayer {
    constructor(paddle: SPaddle) {
            this._controls = {
                left: { pressed: false },
                right: { pressed: false },
            };
            this._paddle = paddle;
        }
    
        SetPaddleMovement() {
            if (this.controls.left.pressed && !this.controls.right.pressed) {
                this.paddle.nextMovement = MOVEMENT.LEFT;
            } else if (this.controls.right.pressed && !this.controls.left.pressed) {
                this.paddle.nextMovement = MOVEMENT.RIGHT;
            } else {
                this.paddle.nextMovement = MOVEMENT.NONE
            }
        }
    
        private _controls: TControlsState;
        set controls(controls: TControlsState) {
            this._controls = controls;
        }
        get controls(): TControlsState { return this._controls; }
    
        private _paddle: SPaddle;
        set paddle(paddle: SPaddle) { this._paddle = paddle; }
        get paddle(): SPaddle { return this._paddle; }
}