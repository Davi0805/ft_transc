import { BitmapText, Sprite } from "pixi.js";

export enum ANIMATION_TYPES {
    SHAKE,
    BAD,
    GOOD
}

export default class CAnimation {
    constructor(image: Sprite | BitmapText, type: ANIMATION_TYPES) {
        this._image = image;
        this._type = type;
        this._timer = 30;
    }

    update() {
        switch (this._type) {
            case (ANIMATION_TYPES.BAD): {
                this._performBad();
            }
        }
        this._timer--;
    }

    private _image: Sprite | BitmapText;
    private _type: ANIMATION_TYPES;
    private _timer: number;
    private _animationDone: boolean = false;
    get animationDone(): boolean { return this._animationDone; }

    private _performBad() {
        switch (this._timer) {
            case (30): {
                this._image.tint = 0xFF0000
                break;
            }
            case (0): {
                this._image.tint = 0xFFFFFF;
                this._animationDone = true;
            }
        }
    }
}