import Container from "./framework/Container";
import AScene from "./AScene";
import { EventBus } from "./EventBus";
import { ScenesManifest, SceneConfigMap } from "../game/Manifests";

export class ScenesManager {
    constructor(scenesManifest: ScenesManifest) {
        this._container = new Container(); // The scenes will be attached to (and removed from) this container
        this._currentScene = null; // Since the function that creates scenes is async, it cannot be attributed here (constructor)
        this._SCENES = scenesManifest;

        // In order for the scenes to not have a reference to this object, a event-handler system is implemented. 
        // This way, when each scene needs to request a scene change,
        // they can just send a signal to the EventBus singleton and this listener will catch it and deal with the change
        EventBus.addEventListener("changeScene", async (event: Event) => {
            const sceneDetails = (event as CustomEvent).detail;
            const sceneName = sceneDetails.sceneName as keyof ScenesManifest;
            const sceneConfigs = sceneDetails.configs as SceneConfigMap[keyof ScenesManifest];
            await this.goToScene(sceneName, sceneConfigs);
        })
    }



    async goToScene(scene: keyof ScenesManifest, configs: SceneConfigMap[keyof ScenesManifest]) {
        if (this.currentScene) {
            await this.currentScene.remove();
            this.container.removeChildren();
        }
        this._currentScene = new this._SCENES[scene]();
        // Runs each custom initialization, like asset loading, etc.
        // Needs to be separated from constructor because it may run asynchronous tasks
        await this._currentScene.init(configs);
        // Makes it so what the scene adds to its root shows up on screen
        this.container.addChild(this.currentScene!.root);
    }

    async removeCurrentScene() {
        if (this.currentScene) {
            await this.currentScene.remove();
            this.container.removeChildren();
        }
        this._currentScene = null;
    }

    private _container: Container;
    get container() {
        return this._container;
    }

    private _currentScene: AScene<SceneConfigMap[keyof ScenesManifest]> | null;
    get currentScene() {
        return this._currentScene;
    }
    
    private _SCENES: ScenesManifest;
}