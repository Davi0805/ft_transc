import { BitmapText, Container } from "pixi.js";
import { point } from "../../../misc/types";
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
        this._text = new BitmapText({
            text: value,
            style: {
                fontFamily: 'gameFont',
                fontSize: textOptions.size,
                fill: '#666666'
            }
        });
        this._text.anchor.set(0.5, 0.5);
        this._text.position.set(textOptions.position.x, textOptions.position.y);
        canvas.addChild(this._text);
    }

    update(value: number, activateAnimation: boolean) {
        if (activateAnimation) {
            this._animations.push((value < this.value) ? new AnimationBad(this.text) : new AnimationGood(this.text))
            this._animations.push(new AnimationShake(this.text))
            this._animations.push(new AnimationScaleUp(this._text))
        }
        this.value = value;
    }

    updateAnimations() { 
        for (let i = this._animations.length - 1; i >= 0; i--) {
            const animation = this._animations[i];
            animation.update();
            if (animation.isDone) {
                this._animations.splice(i, 1);
            }
        }
    }

    private _value: number;
    set value(value: number) { 
        this._value = value;
        this.text.text = value.toString();
    }
    get value(): number { return this._value; }

    private _text: BitmapText;
    get text(): BitmapText { return this._text; }

    private _animations: AAnimation[] = [];
}