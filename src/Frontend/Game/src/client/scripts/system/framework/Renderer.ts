import { point } from "../../../../misc/types";
import BitmapText from "./BitmapText";
import Container from "./Container";
import Sprite from "./Sprite";
import VisualContainer from "./VisualContainer";

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
        if (container instanceof VisualContainer) {
            this._ctx.save();
            this._ctx.translate(
                container.position.x,
                container.position.y,
            )
            this._ctx.rotate(container.rotation);
            this._ctx.scale(container.scale, container.scale)
            let finalImage: HTMLImageElement | OffscreenCanvas;
            if (container instanceof Sprite) {
                finalImage = (container.tint === 0xFFFFFF) ? container.image : this._getTintedImage(container);
                this._ctx.drawImage(
                    finalImage,
                    -(container.size.x * container.anchor.x),
                    -(container.size.y * container.anchor.y),
                    container.size.x,
                    container.size.y
                )
                this._ctx.restore();
                
            } else if (container instanceof BitmapText){
                this._ctx.font = container.style.fontSize.toString() + "px " + container.style.fontFamily;
                //this._ctx.fillStyle = container.style.fill;
                //console.log(container.style.fill)

                //TODO I have somehow to tint the text first!
                const metrics = this._ctx.measureText(container.text.toString());
                const width = Math.ceil(metrics.width);
                const ascent = Math.ceil(metrics.actualBoundingBoxAscent || container.style.fontSize);
                const descent = Math.ceil(metrics.actualBoundingBoxDescent || 0);
                const height = ascent + descent;
                const totalSize = { x: width, y: height };
                finalImage = this._getTintedText(container, totalSize, ascent);
                this._ctx.drawImage(
                    finalImage,
                    -(width * container.anchor.x),
                    -(height * container.anchor.y),
                    /* container.size.x,
                    container.size.y */
                )
                //console.log(container.size.x)
                this._ctx.restore();



                /* this._ctx.fillText(container.text.toString(),
                    -(container.size.x * container.anchor.x),
                    -(container.size.y * container.anchor.y))
                this._ctx.restore(); */
            } else { throw new Error("SOME CLASS WAS ADDED TO VISUALCONTAINER AND NOT HERE!!!!"); }
            
            
            
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
        if (!ctx) { throw new Error("Error retrieving context from canvas"); }
        
        const r = ((sprite.tint >> 16) & 0xFF) / 255;
        const g = ((sprite.tint >> 8) & 0xFF) / 255;
        const b = (sprite.tint & 0xFF) / 255;

        
        
        ctx.drawImage(sprite.image, 0, 0);
        
        const imageData = ctx.getImageData(0, 0, imageSize.x, imageSize.y);
        for (let i = 0; i < imageData.data.length; i += 4) {
            imageData.data[i + 0] *= r;
            imageData.data[i + 1] *= g;
            imageData.data[i + 2] *= b;
            //imageData.data[i + 3] *= sprite.alpha;
        }

        ctx.putImageData(imageData, 0, 0);

        return offscreen
    }



    private _getTintedText(bitmapText: BitmapText, canvasSize: point, ascent: number) {
        //console.log(canvasSize)
        const offscreen = new OffscreenCanvas(canvasSize.x, canvasSize.y);
        const ctx = offscreen.getContext("2d");
        if (!ctx) { throw new Error("Error retrieving context from canvas"); }
        
        ctx.font = bitmapText.style.fontSize.toString() + "px " + bitmapText.style.fontFamily;
        ctx.fillStyle = bitmapText.style.fill;

        const r = ((bitmapText.tint >> 16) & 0xFF) / 255;
        const g = ((bitmapText.tint >> 8) & 0xFF) / 255;
        const b = (bitmapText.tint & 0xFF) / 255;

        ctx.fillText(bitmapText.text.toString(), 0, ascent)

        //console.log(bitmapText.tint)
        
        const imageData = ctx.getImageData(0, 0, canvasSize.x, canvasSize.y);
        for (let i = 0; i < imageData.data.length; i += 4) {
            imageData.data[i + 0] *= r;
            imageData.data[i + 1] *= g;
            imageData.data[i + 2] *= b;
            //imageData.data[i + 3] *= bitmapText.alpha;
        }

        ctx.putImageData(imageData, 0, 0);

        return offscreen
    }
}

