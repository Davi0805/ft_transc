import AAnimation, { ObjectAnimationView } from "./AAnimation";

export default class AnimationBad extends AAnimation {
    constructor(object: ObjectAnimationView) {
        super(object, 30);
    }

    override update(): void {
        switch (this._timer) {
            case (30): {
                this._object.sprite.tint = 0xFF0000
                break;
            }
            case (1): {
                this._object.sprite.tint = 0xFFFFFF;
            }
        }
        super.update();
    }
}