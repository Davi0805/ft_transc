import Point from "../../../../misc/Point";
import Container from "./Container";

export type BitmapTextConfigs = {
    text: string | number,
    style: {
        fontFamily: string,
        fontSize: number,
        fill: string
    }
}

export default class BitmapText extends Container {
    constructor(configs: BitmapTextConfigs) {
        super();
        this._text = "";
        this._anchor = new Point(0, 0);
    }

    private _text: string | number;
    set text(text: string | number) { this._text = text; }
    get text(): string | number { return this._text; }

    private _anchor: Point;
    set anchor(anchor: Point) { this._anchor = anchor}
    get anchor(): Point { return this._anchor; }
}