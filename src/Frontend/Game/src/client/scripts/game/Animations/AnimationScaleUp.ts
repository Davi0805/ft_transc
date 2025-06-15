import { BitmapText, Sprite } from "pixi.js";
import AAnimation from "./AAnimation";

export default class AnimationScaleUp extends AAnimation {
    constructor(image: Sprite | BitmapText) {
        super(image, 30);
    }

    override update(): void {
        switch (this._timer) {
            case (30): {
                this._image.scale = 2
                break;
            }
            case (1): {
                this._image.scale = 1;
            }
        }
        super.update();
    }
}