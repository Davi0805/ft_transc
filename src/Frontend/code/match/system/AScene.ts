import Container from "./framework/Container";
import { App } from "./App"


//TODO: ADD TICKER BACK
export default abstract class AScene<T> {
    constructor() {
        this._root = new Container(); // All objects of the scene will be appended to this
        // This allows tickerUpdate to be called every pixi tick, in case some updates are needed to be performed automatically
        App.app.ticker.add((delta, counter) => this.tickerUpdate(delta, counter)); //TODO THIS DOES NOT SEND TICKERUPDATE, IT SENDS AN ANONYMOUS THAT CALLS IT. REMOVING DOES NOTHING
    }
    async remove() {
        App.app.ticker.remove((delta, counter) => this.tickerUpdate(delta, counter));
        await this.destroy(); // Run any custom cleanup
        this.root.destroy(); // Actually destroys the scene
    }

    // Methods to be overriden by children
    async init(configs: T) {} // This must be called manually after every constructor because it is async (ScenesManager is doing that)
    async destroy() {}
    abstract tickerUpdate(delta: number, counter: number): void
    serverUpdate(dto: unknown) {} // This method will do the casting

    _root: Container;
    get root() {
        return this._root;
    }
}