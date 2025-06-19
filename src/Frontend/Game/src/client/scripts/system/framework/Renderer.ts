import Container from "./Container";
import Sprite from "./Sprite";

export default class Renderer {
    constructor(canvas: HTMLCanvasElement, rootContainer: Container,
        backgroundColor: string = 'black'
    ) {
        this._canvas = canvas;
        const ctx = canvas.getContext('2d');
        if (!ctx) { throw new Error("Error retrieving context from canvas"); }
        this._ctx = ctx;
        this._rootContainer = rootContainer;
        this._backgroundColor = backgroundColor;
    }

    render() {
        this._ctx.clearRect(0, 0, this._canvas.width, this._canvas.height);
        this._ctx.fillStyle = this._backgroundColor;
        this._ctx.fillRect(0, 0, this._canvas.width, this._canvas.height);
        this._draw(this._rootContainer)
    }

    private _draw(container: Container) {
        if (container instanceof Sprite) {
            this._ctx.save();
            this._ctx.translate(
                container.position.x,
                container.position.y,
            )
            this._ctx.rotate(container.rotation);
            this._ctx.drawImage(
                container.image,
                -(container.size.x * container.anchor.x),
                -(container.size.y * container.anchor.y),
                container.size.x,
                container.size.y
            )
            this._ctx.restore();
        }
        container.children.forEach( child => {
            this._draw(child);
        })
    }



    private _canvas: HTMLCanvasElement;
    private _ctx: CanvasRenderingContext2D;
    private _rootContainer: Container;
    private _backgroundColor: string;
}