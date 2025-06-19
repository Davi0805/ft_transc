import Container from "./Container";

export default class Renderer {
    constructor() {}

    static draw(container: Container,
        canvas: HTMLCanvasElement,
        ctx: CanvasRenderingContext2D) {
            //WRONG ctx.clearRect(0, 0, canvas.width, canvas.height);
            /* ctx.drawImage(
            ) */
    }
}