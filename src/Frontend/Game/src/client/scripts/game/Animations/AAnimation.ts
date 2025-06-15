import { BitmapText, Sprite } from "pixi.js";

export default abstract class AAnimation {
    constructor(image: Sprite | BitmapText, timer: number) {
        this._image = image;
        this._timer = timer;
    }

    update() {
        this._timer--;
        if (this._timer <= 0) {
            this._isDone = true;
        }
    };

    protected _image: Sprite | BitmapText;
    protected _timer: number;
    private _isDone: boolean = false;
    get isDone() { return this._isDone; }
}