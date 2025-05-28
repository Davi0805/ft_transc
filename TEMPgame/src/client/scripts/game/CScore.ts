import { BitmapText } from "pixi.js";

export default class CScore {
    constructor(score: number, text: BitmapText) {
        this._score = score;
        this._text = text;
    }

    private _score: number;
    set score(score: number) { 
        this._score = score;
        this.text.text = score.toString();
    }
    get score(): number { return this._score; }

    private _text: BitmapText;
    get text(): BitmapText { return this._text; }
}