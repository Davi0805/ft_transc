import Container from "./framework/Container";
import { App } from "./App"
import { LogicCallback } from "./framework/Ticker";


export default abstract class AScene<T> {
    constructor() {
        this._root = new Container(); // All objects of the scene will be appended to this
        // This allows tickerUpdate to be called every pixi tick, in case some updates are needed to be performed automatically
        this._boundTickerUpdate = this.tickerUpdate.bind(this);
        App.app.ticker.add(this._boundTickerUpdate);
    }
    async remove() {
        App.app.ticker.remove(this._boundTickerUpdate);
        await this.destroy(); // Run any custom cleanup
        this.root.destroy(); // Actually destroys the scene
    }

    // Methods to be overriden by children
    async init(configs: T) {} // This must be called manually after every constructor because it is async (ScenesManager is doing that)
    async destroy() {}
    abstract tickerUpdate(delta: number, counter: number): void
    serverUpdate(dto: unknown) {} // This method will do the casting

    protected _root: Container;
    get root() {
        return this._root;
    }
    private _boundTickerUpdate: LogicCallback;
}