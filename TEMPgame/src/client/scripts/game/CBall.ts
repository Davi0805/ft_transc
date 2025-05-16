import ABall from "../../../abstracts/ABall";
import { Sprite, Point } from "pixi.js";

export default class CBall extends ABall {
    constructor(pos: Point, sprite: Sprite) {
        super();
        this._pos = pos;
        this._sprite = sprite;
        this._sprite.anchor.set(0.5);
        this._sprite.position.set(pos.x, pos.y);
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