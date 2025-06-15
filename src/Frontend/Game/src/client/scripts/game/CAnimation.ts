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


        this._originalPos = image.position.clone();
    }

    update() {
        switch (this._type) {
            case (ANIMATION_TYPES.BAD): {
                this._performBad();
                break;
            }
            case (ANIMATION_TYPES.SHAKE): {
                this._performShake();
            }
        }
        this._timer--;
        if (this._timer <= 0) {
            this._animationDone = true;
        }
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
            case (1): {
                this._image.tint = 0xFFFFFF;
            }
        }
    }

    private _performShake() {
        switch (this._timer) {
            case (30): {
                this._image.position.set(this._originalPos.x + 2, this._originalPos.y + 2);
                break;
            }
            case (24): {
                this._image.position.set(this._originalPos.x - 2, this._originalPos.y - 2);
                break;
            }
            case (18): {
                this._image.position.set(this._originalPos.x - 2, this._originalPos.y + 2);
                break;
            }
            case (12): {
                this._image.position.set(this._originalPos.x + 2, this._originalPos.y - 2);
                break;
            }
            case (6): {
                this._image.position.set(this._originalPos.x, this._originalPos.y)
            }
        }
    }

    private _originalPos;
}