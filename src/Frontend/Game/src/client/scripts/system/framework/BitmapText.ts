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
    }


}