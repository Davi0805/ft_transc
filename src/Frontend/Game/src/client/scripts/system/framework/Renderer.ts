import Container from "./Container";

export default class Renderer {
    constructor(canvas: HTMLCanvasElement, rootContainer: Container) {
        this._canvas = canvas;
        const ctx = canvas.getContext('2d');
        if (!ctx) { throw new Error("Error retrieving context from canvas"); }
        this._ctx = ctx;
        this._rootContainer = rootContainer;
    }

    render() {
        this._clear();
        this._draw()
    }

    private _draw() {
            //WRONG ctx.clearRect(0, 0, canvas.width, canvas.height);
            /* ctx.drawImage(
            ) */
    }



    private _canvas: HTMLCanvasElement;
    private _ctx: CanvasRenderingContext2D;
    private _rootContainer: Container;
}