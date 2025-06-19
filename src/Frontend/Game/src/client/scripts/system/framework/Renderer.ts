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

        /* this._bufferCanvas = new OffscreenCanvas();
        const bctx = canvas.getContext('2d');
        if (!bctx) { throw new Error("Error retrieving context from canvas"); }
        this._bufferCanvasctx = bctx; */
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
            const finalImage = (container.tint === 0xFFFFFF)
                ? container.image
                : this._getTintedImage(container);
            //this._ctx.globalCompositeOperation = "source-atop"; // or "multiply"
            //this._ctx.fillStyle = "rgba(255, 0, 0, 0.5)"; // Red tint, 50% opacity
            this._ctx.drawImage(
                finalImage,
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

    private _getTintedImage(sprite: Sprite) {
        const imageSize = { x: sprite.image.naturalWidth, y: sprite.image.naturalHeight }
        const offscreen = new OffscreenCanvas(imageSize.x, imageSize.y);
        const ctx = offscreen.getContext("2d");
        if (!ctx) { throw new Error(); }
        
        const r = ((sprite.tint >> 16) & 0xFF) / 255;
        const g = ((sprite.tint >> 8) & 0xFF) / 255;
        const b = (sprite.tint & 0xFF) / 255;

        
        
        ctx.drawImage(sprite.image, 0, 0);
        
        const imageData = ctx.getImageData(0, 0, imageSize.x, imageSize.y);
        for (let i = 0; i < imageData.data.length; i += 4) {
            imageData.data[i + 0] *= r;
            imageData.data[i + 1] *= g;
            imageData.data[i + 2] *= b;
        }

        ctx.putImageData(imageData, 0, 0);

        return offscreen
    }
}