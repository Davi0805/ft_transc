import { TControlsState } from "../misc/types.js"
import SPaddle from "./SPaddle.js"

export default class SPlayer {
    constructor(controls: TControlsState, paddle: SPaddle) {
        this._controls = controls;
        this._paddle = paddle;
    }

    private _controls: TControlsState;
    set controls(value: TControlsState) {
        this._controls = value;
    }
    get controls() {
        return this._controls;
    }

    private _paddle: SPaddle;
    set paddle(value: SPaddle) {
        this._paddle = value;
    }
    get paddle() {
        return this._paddle
    }
}