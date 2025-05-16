import { Container} from "pixi.js";
import { App } from "./App"

export abstract class AScene<T> {
    constructor() {
        this._root = new Container(); // All objects of the scene will be appended to this
        // This allows tickerUpdate to be called every pixi tick, in case some updates are needed to be performed automatically
        App.app.ticker.add(this.tickerUpdate, this);
    }
    async remove() {
        App.app.ticker.remove(this.tickerUpdate, this);
        await this.destroy(); // Run any custom cleanup
        this.root.destroy(); // Actually destroys the scene
    }

    // Methods to be overriden by children
    async init(configs: T) {} // This must be called manually after every constructor because it is async (ScenesManager is doing that)
    async destroy() {}
    tickerUpdate() {}
    serverUpdate(dto: unknown) {} // This method will do the casting

    _root: Container;
    get root() {
        return this._root;
    }

    // This is where the assets of each scene will be loaded into
    _assets!: any; // Assets.loadBundle() returns any
}