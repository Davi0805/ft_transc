import AAnimation from "./AAnimation";
import Point from "../../matchSharedDependencies/Point";
import CNumbersText from "../CNumbersText";
import CObject from "../CObject";

export default class AnimationShake extends AAnimation {
    constructor(object: CObject | CNumbersText) {
        super(object, 30);
    }

    override update(): void {
        switch (this._timer) {
            case (30): {
                this._object.spriteOffset = new Point(10, 10);
                break;
            }
            case (24): {
                this._object.spriteOffset = new Point(-10, -10);
                break;
            }
            case (18): {
                this._object.spriteOffset = new Point(10, -10);
                break;
            }
            case (12): {
                this._object.spriteOffset = new Point(-10, 10);
                break;
            }
            case (6): {
                this._object.spriteOffset = new Point(0, 0);
            }
        }
        super.update();
    }
}