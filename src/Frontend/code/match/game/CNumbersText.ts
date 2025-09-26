import { point } from "../matchSharedDependencies/sharedTypes";
import Point from "../matchSharedDependencies/Point";
import Container from "../system/framework/Container";
import BitmapText from "../system/framework/BitmapText";
import AnimationBad from "./Animations/AnimationBad";
import AnimationGood from "./Animations/AnimationGood";
import AnimationShake from "./Animations/AnimationShake";
import AAnimation from "./Animations/AAnimation";
import AnimationScaleUp from "./Animations/AnimationScaleUp";

type TextOptions = {
    size: number,
    position: point,
}

export default class CNumbersText {
    constructor(value: number, textOptions: TextOptions, canvas: Container) {
        this._value = value;
        this._sprite = new BitmapText({
            text: value,
            style: {
                fontFamily: 'gameFont',
                fontSize: textOptions.size,
                fill: 0x666666
            }
        });
        this._sprite.anchor.setPoint(0.5, 0.5);
        this._sprite.position.setPoint(textOptions.position.x, textOptions.position.y);
        canvas.addChild(this._sprite);
        this._pos = Point.fromObj(textOptions.position)
        this._spriteOffset = new Point(0, 0);
    }

    update(value: number, activateAnimation: boolean) {
        /* if (activateAnimation) {
            this._animations.push((value < this.value) ? new AnimationBad(this) : new AnimationGood(this))
            this._animations.push(new AnimationShake(this))
            this._animations.push(new AnimationScaleUp(this))
        } */
        this.value = value;
    }

    addAnimations(animations: (new (obj: CNumbersText, loop: boolean) => AAnimation)[], loop: boolean = false) {
        animations.forEach(animation => {
            const animationObj = new animation(this, loop)
            this._animations.push(animationObj);
        })
        console.log("Animation added")
    }

    updateAnimations() { 
        for (let i = this._animations.length - 1; i >= 0; i--) {
            const animation = this._animations[i];
            animation.update();
            if (animation.isDone) {
                this._animations.splice(i, 1);
            }
        }
        this._updatePos();
        //console.log(this._animations.length)
    }

    

    private _value: number;
    set value(value: number) { 
        this._value = value;
        this._sprite.text = value.toString();
    }
    get value(): number { return this._value; }

    private _sprite: BitmapText;
    get sprite(): BitmapText { return this._sprite; }
    private _pos: Point;
    private _spriteOffset: Point;
    get spriteOffset(): Point { return this._spriteOffset; }
    set spriteOffset(spriteOffset: Point) { this._spriteOffset = spriteOffset}

    private _animations: AAnimation[] = [];

    _updatePos() {
        const newPos = Point.fromObj(this._pos).add(this._spriteOffset);
        this._sprite.position.setPoint(newPos.x, newPos.y);
    }
}