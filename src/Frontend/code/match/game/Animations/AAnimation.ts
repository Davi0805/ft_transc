import Point from "../../matchSharedDependencies/Point";
import Sprite from "../../system/framework/Sprite";
import BitmapText from "../../system/framework/BitmapText";

export interface ObjectAnimationView {
    sprite: Sprite | BitmapText,
    spriteOffset: Point
}

export default abstract class AAnimation {
    constructor(object: ObjectAnimationView, duration: number, loop: boolean = false) {
        this._object = object;
        this._timer = duration;
        this._duration = duration;
        this._loop = loop;
    }

    update() {
        this._timer--;
        if (this._timer <= 0) {
            if (this._loop) {
                this._timer = this._duration;
            } else {
                this._isDone = true;
            }
        }
        //console.log(this._timer)
    };

    protected _object: ObjectAnimationView;
    protected _timer: number;
    protected _duration: number;
    private _loop: boolean;
    private _isDone: boolean = false;
    get isDone() { return this._isDone; }
}