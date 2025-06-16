import { BitmapText, Sprite } from "pixi.js";
import AAnimation from "./AAnimation";

export default class AnimationShake extends AAnimation {
    constructor(image: Sprite | BitmapText) {
        super(image, 30);
        this._originalPos = image.position.clone();
    }

    override update(): void {
        switch (this._timer) {
            case (30): {
                this._image.position.set(this._originalPos.x + 4, this._originalPos.y + 4);
                console.log(this._image.position)
                break;
            }
            case (24): {
                this._image.position.set(this._originalPos.x - 4, this._originalPos.y - 4);
                console.log(this._image.position)
                break;
            }
            case (18): {
                this._image.position.set(this._originalPos.x - 4, this._originalPos.y + 4);
                console.log(this._image.position)
                break;
            }
            case (12): {
                this._image.position.set(this._originalPos.x + 4, this._originalPos.y - 4);
                console.log(this._image.position)
                break;
            }
            case (6): {
                this._image.position.set(this._originalPos.x, this._originalPos.y)
                console.log(this._image.position)
            }
        }
        super.update();
    }

    private _originalPos;
}