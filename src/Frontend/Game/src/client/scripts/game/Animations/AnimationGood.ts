import { BitmapText, Sprite } from "pixi.js";
import AAnimation from "./AAnimation";

export default class AnimationGood extends AAnimation {
    constructor(image: Sprite | BitmapText) {
        super(image, 30);
    }

    override update(): void {
        switch (this._timer) {
            case (30): {
                this._image.tint = 0x00FF00
                break;
            }
            case (1): {
                this._image.tint = 0xFFFFFF;
            }
        }
        super.update();
    }
}