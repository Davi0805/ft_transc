import { BitmapText, Sprite } from "pixi.js";
import Point from "../../../../misc/Point";

export interface ObjectAnimationView {
    sprite: Sprite | BitmapText,
    spriteOffset: Point
}

export default abstract class AAnimation {
    constructor(object: ObjectAnimationView, timer: number) {
        this._object = object;
        this._timer = timer;
    }

    update() {
        this._timer--;
        if (this._timer <= 0) {
            this._isDone = true;
        }
    };

    protected _object: ObjectAnimationView;
    protected _timer: number;
    private _isDone: boolean = false;
    get isDone() { return this._isDone; }
}