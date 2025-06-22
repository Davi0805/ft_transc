import AAnimation, { ObjectAnimationView } from "./AAnimation";

export default class AnimationScaleUp extends AAnimation {
    constructor(object: ObjectAnimationView) {
        super(object, 30);
    }

    override update(): void {
        switch (this._timer) {
            case (30): {
                this._object.sprite.scale = 2
                break;
            }
            case (1): {
                this._object.sprite.scale = 1;
            }
        }
        super.update();
    }
}