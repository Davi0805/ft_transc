import Assets from "./Assets";
import Container from "./Container";

export default class Sprite extends Container {
    constructor(image: HTMLImageElement) {
        super();
        this._image = image;
    }

    static from(imageAlias: string) {
        const image = Assets.getImage(imageAlias);
        if (!image) {
            throw new Error("That image does not exist, you fucking idiot")
        }
        const out = new Sprite(image);
        return (out);
    }

    private _image: HTMLImageElement | undefined;
}