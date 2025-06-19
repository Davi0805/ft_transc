import Container from "./Container";
import Renderer from "./Renderer";
import Ticker from "./Ticker";

export type AppConfigs = {
    width: number,
    height: number
}

export default class Application {
    constructor(configs: AppConfigs) {
        this._renderer = new Renderer();
        this._ticker = new Ticker(90);

        this._canvas = document.createElement('canvas');
        this._canvas.width = configs.width;
        this._canvas.height = configs.height;
        this._cxt = this._canvas.getContext('2d');
        if (!this._cxt) {
            throw new Error("Drawing context getter failed");
        }

        this._stage = new Container();

        this._ticker.start();
    }

    private _renderer: Renderer;
    private _ticker: Ticker;
    get ticker(): Ticker { return this._ticker; }

    private _canvas: HTMLCanvasElement;
    get canvas(): HTMLCanvasElement { return this._canvas; }

    private _cxt: CanvasRenderingContext2D | null;

    private _stage: Container;
    get stage() { return this._stage; }

    
}