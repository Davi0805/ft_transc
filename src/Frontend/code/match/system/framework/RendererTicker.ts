import Renderer from "./Renderer";
import Ticker from "./Ticker";

export default class RendererTicker extends Ticker {
    constructor(renderer: Renderer) {
        super();
        this._renderer = renderer;
    }

    protected override _callCallbacks(): void {
        super._callCallbacks();
        this._renderer.render();
    }

    private _renderer: Renderer;
}