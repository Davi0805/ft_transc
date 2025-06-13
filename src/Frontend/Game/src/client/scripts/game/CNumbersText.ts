import { BitmapText, Container } from "pixi.js";
import { point } from "../../../misc/types";

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
                fill: '#444444'
            }
        });
        this._text.anchor.set(0.5, 0.5);
        this._text.position.set(textOptions.position.x, textOptions.position.y);
        canvas.addChild(this._text);
    }

    update(score: number) {
        this.value = score
    }

    private _value: number;
    set value(value: number) { 
        this._value = value;
        this.text.text = value.toString();
    }
    get value(): number { return this._value; }

    private _text: BitmapText;
    get text(): BitmapText { return this._text; }
}