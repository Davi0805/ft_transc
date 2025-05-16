import APaddle from "../../../abstracts/APaddle";
import { SIDES } from "../../../misc/types.js";
import { Sprite } from "pixi.js";
import { Point } from "@pixi/math";


export default class CPaddle extends APaddle {
    constructor(side: SIDES, pos: Point, sprite: Sprite) {
        super(side, pos);
        this._sprite = sprite;
        this._sprite.anchor.set(0.5);
        this._sprite.position.set(pos.x, pos.y);
        this._sprite.rotation = Math.atan2(this._orientation.y, this._orientation.x);
    }

    private _sprite: Sprite;

    get pos() {
        return this._pos;
    }
    set pos(value: Point) {
        this._pos = value;
        this._sprite.position.set(value.x, value.y);
    }
}