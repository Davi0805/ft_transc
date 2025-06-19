import Renderer from "./Renderer";
import Ticker from "./Ticker";

type RenderCallback = () => void;

export default class RendererTicker extends Ticker {
    constructor(tickerRate: number, renderer: Renderer) {
        super(tickerRate);
        this._renderer = renderer;
    }

    protected override _callCallbacks(): void {
        super._callCallbacks();
        this._renderer.render();
    }

    private _renderer: Renderer;
}