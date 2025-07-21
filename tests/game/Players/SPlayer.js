import { MOVEMENT } from "../Objects/SPaddle.js";
export default class SPlayer {
    constructor(paddle) {
        this._controls = {
            left: { pressed: false },
            right: { pressed: false },
            pause: { pressed: false }
        };
        this._paddle = paddle;
    }
    SetPaddleMovement() {
        if (this.controls.left.pressed && !this.controls.right.pressed) {
            this.paddle.nextMovement = MOVEMENT.LEFT;
        }
        else if (this.controls.right.pressed && !this.controls.left.pressed) {
            this.paddle.nextMovement = MOVEMENT.RIGHT;
        }
        else {
            this.paddle.nextMovement = MOVEMENT.NONE;
        }
    }
    _controls;
    set controls(controls) { this._controls = controls; }
    get controls() { return this._controls; }
    _paddle;
    set paddle(paddle) { this._paddle = paddle; }
    get paddle() { return this._paddle; }
}
