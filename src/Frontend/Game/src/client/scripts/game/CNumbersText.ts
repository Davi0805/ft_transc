import { BitmapText, Container } from "pixi.js";
import { point } from "../../../misc/types";
import CAnimation, { ANIMATION_TYPES } from "./CAnimation";

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
        this.value = value;
        if (activateAnimation) {
            this._animations.push(new CAnimation(this._text, ANIMATION_TYPES.BAD))
            this._animations.push(new CAnimation(this._text, ANIMATION_TYPES.SHAKE))
        }
    }

    updateAnimations() { 
        for (let i = this._animations.length - 1; i >= 0; i--) {
            console.log(i)
            const animation = this._animations[i];
            animation.update();
            if (animation.animationDone) {
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

    private _animations: CAnimation[] = []; // TODO: Probably should change this to an Animation manager?
}