import Renderer from "./Renderer";
import Ticker from "./Ticker";

type RenderCallback = () => void;

export default class RendererTicker extends Ticker {
    constructor(tickerRate: number) {
        super(tickerRate);
        this._renderer = new Renderer();
    }

    protected override _callCallbacks(): void {
        super._callCallbacks();
        this._renderer.render();
    }

    private _renderer: Renderer;
}