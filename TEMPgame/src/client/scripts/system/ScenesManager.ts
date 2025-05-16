/* import { Container } from "pixi.js";
import { AScene } from "./AScene";
import { EventBus } from "./EventBus";

// This is how the ScenesManager saves the scenes
export type ScenesManifest = {
    [name: string]: new () => AScene<T>
}

export class ScenesManager {
    constructor(scenesManifest: ScenesManifest) {
        this._container = new Container(); // The scenes will be attached to (and removed from) this container
        this._container.interactive = true;  //TODO: Must check if this actually does anything
        this._currentScene = null; // Since the function that creates scenes is async, it cannot be attributed here (constructor)
        this._SCENES = scenesManifest;
        // In order for the scenes to not have a reference to this object, a event-handler system is implemented. 
        // This way, when each scene needs to request a scene change,
        // they can just send a signal to the EventBus singleton and this listener will catch it and deal with the change
        // TODO: Is there a way to type that first argument to only accept custom signal names?
        // TODO: Is there a way to type the "detail" attribute so it only acceps scene names?
        EventBus.addEventListener("changeScene", async (event: Event) => {
            const sceneName = (event as CustomEvent).detail as string;
            await this.goToScene(sceneName);
        })
    }

    async goToScene(scene: string) { // TODO probably there is a better, more specific way to type the parameter
        if (this.currentScene) {
            await this.currentScene.remove();
            this.container.removeChildren();
        }
        this._currentScene = new this._SCENES[scene]();
        // Runs each custom initialization, like asset loading, etc.
        // Needs to be separated from constructor because it may run asynchronous tasks
        await this._currentScene.init();
        // Makes it so what the scene adds to its root shows up on screen
        this.container.addChild(this.currentScene!.root);
    }

    private _container: Container;
    get container() {
        return this._container;
    }

    private _currentScene: AScene | null;
    get currentScene() {
        return this._currentScene;
    }
    
    private _SCENES: ScenesManifest;
} */