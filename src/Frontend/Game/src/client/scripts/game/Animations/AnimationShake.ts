import { BitmapText, Sprite } from "pixi.js";
import AAnimation from "./AAnimation";

export default class AnimationShake extends AAnimation {
    constructor(image: Sprite | BitmapText) {
        super(image, 30);
        this._originalPos = image.position;
    }

    override update(): void {
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
        super.update();
    }

    private _originalPos;
}