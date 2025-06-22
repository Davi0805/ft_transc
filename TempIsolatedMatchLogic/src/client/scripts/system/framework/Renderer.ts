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
        this._ctx.save();
        this._ctx.translate(container.position.x, container.position.y)
        this._ctx.rotate(container.rotation);
        this._ctx.scale(container.scale, container.scale)
        this._ctx.translate(-container.pivot.x, -container.pivot.y)

        if (container instanceof VisualContainer) {
            if (container instanceof Sprite) {
                this._ctx.drawImage(
                    container.image,
                    -(container.size.x * container.anchor.x),
                    -(container.size.y * container.anchor.y),
                    container.size.x,
                    container.size.y
                )
                this._ctx.globalCompositeOperation = "multiply"
                this._ctx.fillStyle = `#${container.tint.toString(16).padStart(6, "0")}`
                this._ctx.fillRect(-(container.size.x * container.anchor.x),
                    -(container.size.y * container.anchor.y),
                    container.size.x,
                    container.size.y)
                this._ctx.globalCompositeOperation = "source-over"
            } else if (container instanceof BitmapText){
                this._ctx.font = container.style.fontSize.toString() + "px " + container.style.fontFamily;

                const r = this._getRed(container.style.fill) * this._getRed(container.tint) * 255;
                const g = this._getGreen(container.style.fill) * this._getGreen(container.tint) * 255;
                const b = this._getBlue(container.style.fill) * this._getBlue(container.tint) * 255;
                this._ctx.fillStyle = this._rgbToFillStyle(r, g, b);
                const width = this._ctx.measureText(container.text.toString()).width;
                const height = container.style.fontSize
                this._ctx.fillText(container.text.toString(),
                    -(width * container.anchor.x), height * container.anchor.y);
            }
        }

        container.children.forEach( child => {
            this._draw(child);
        })
        this._ctx.restore();        
    }

    private _getRed(hex: number) {
        return ((hex >> 16) & 0xFF) / 255
    }
    private _getGreen(hex: number) {
        return ((hex >> 8) & 0xFF) / 255
    }
    private _getBlue(hex: number) {
        return (hex & 0xFF) / 255
    }
    private _rgbToFillStyle(r: number, g: number, b: number) {
        return `#${[r,g,b].map(color => color.toString(16).padStart(2, "0")).join("")}`
    }

    private _canvas: HTMLCanvasElement;
    private _ctx: CanvasRenderingContext2D;
    private _rootContainer: Container;
    private _backgroundColor: string;
}

