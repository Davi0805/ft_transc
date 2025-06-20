import VisualContainer from "./VisualContainer";


type TextStyle = {
    fontFamily: string,
    fontSize: number,
    fill: string
}
export type BitmapTextConfigs = {
    text: string | number,
    style: TextStyle
}

export default class BitmapText extends VisualContainer {
    constructor(configs: BitmapTextConfigs) {
        super();
        this._text = configs.text;
        this._style = configs.style;
    }

    private _text: string | number;
    set text(text: string | number) { this._text = text; }
    get text(): string | number { return this._text; }

    private _style: TextStyle;
    set style(style: TextStyle) { this._style = style; }
    get style(): TextStyle { return this._style; }

    
}