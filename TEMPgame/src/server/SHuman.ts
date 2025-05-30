import { TControlsState } from "../misc/types.js"
import SPaddle from "./SPaddle.js"

export default class SHuman {
    constructor(id: number, controls: TControlsState, paddle: SPaddle) {
        this._id = id;
        this._controls = controls;
        this._paddle = paddle;
    }

    private _id: number;
    get id(): number { return this._id; }

    private _controls: TControlsState;
    set controls(controls: TControlsState) { this._controls = controls; }
    get controls(): TControlsState { return this._controls; }

    private _paddle: SPaddle;
    set paddle(paddle: SPaddle) { this._paddle = paddle; }
    get paddle(): SPaddle { return this._paddle; }
}