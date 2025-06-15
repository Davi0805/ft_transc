import { Container} from "pixi.js";
import { App } from "./App"

export default abstract class AScene<T> {
    constructor() {
        this._root = new Container(); // All objects of the scene will be appended to this
        // This allows tickerUpdate to be called every pixi tick, in case some updates are needed to be performed automatically
        App.app.ticker.add((delta) => this.tickerUpdate(delta.deltaTime), this);
    }
    async remove() {
        App.app.ticker.remove((delta) => this.tickerUpdate(delta.deltaTime), this);
        await this.destroy(); // Run any custom cleanup
        this.root.destroy(); // Actually destroys the scene
    }

    // Methods to be overriden by children
    async init(configs: T) {} // This must be called manually after every constructor because it is async (ScenesManager is doing that)
    async destroy() {}
    abstract tickerUpdate(delta: number): void
    serverUpdate(dto: unknown) {} // This method will do the casting

    _root: Container;
    get root() {
        return this._root;
    }
}