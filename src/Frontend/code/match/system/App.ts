import Application from './framework/Application';
import Assets from './framework/Assets';
import { ScenesManager } from './ScenesManager';
import { EventBus } from './EventBus';
import { Adto } from '../matchSharedDependencies/dtos';
import { CAppConfigs } from '../matchSharedDependencies/SetupDependencies';
import { assetsManifest, scenesManifest } from '../game/Manifests';

class FtApplication {
    async init(gameConfigs: CAppConfigs, rootElement: HTMLElement) {
        // Socket setup
        this._socket = gameConfigs.websocket;
        
        // And when a message needs to be sent, the scene will send it as a signal, and the App will catch it
        // and forward it to the socket. This avoids the scenes to hold references to higher objects in the tree
        EventBus.addEventListener("sendToServer", (event: Event) => {
            const dto = (event as CustomEvent).detail;
            
            this._socket.send(JSON.stringify(dto))
        })

        this._app = new Application(gameConfigs.appConfigs);
        
        //await this._app.init(gameConfigs.appConfigs);
        rootElement.appendChild(this._app.canvas); // This makes the canvas of the Pixi app show up on the browser

        // assetsManifest has the assets bundles, which include all paths to all sprites and their alias
        // This makes the bundles available directly in Assets, which is globally accessible
        Assets.init(assetsManifest)
        
        // Creates the scenes manager and feeds to it all the scenes of the game through the manifest
        this._scenesManager = new ScenesManager(scenesManifest);
        // This makes so anything the scene manager adds to container shows up on screen
        this.app.stage.addChild(this._scenesManager.container);
        // Starts the first scene
        await this._scenesManager.goToScene("gameScene", gameConfigs.gameSceneConfigs); //TODO change to the correct first scene
        //await this._scenesManager.goToScene("exampleScene", {});

        // When a message is received from server, it is forward to the handler of the current scene
        this._socket.addEventListener("message", (event) => {
            const message = JSON.parse(event.data) as Adto;
            if (message.type === "SGameDTO") {
                this._scenesManager.currentScene?.serverUpdate(message.dto);
            }
        })
    }

    private _app!: Application;
    get app() {
        if (!this._app) {
            throw new Error("Application has not been initialized. Call run() first!");
        }
        return this._app;
    }

    private _scenesManager!: ScenesManager;

    private _socket!: WebSocket;
    // All properties are marked with assertion operator because they are only assigned in the init() method.
    // This is necessary because not only it is a singleton (so the constructor is called immediately at import)
    // but also because there are asynchronous tasks running at init. 
    // Since init() is the only function exposed and nothing else does anything, this is safe
}

// Exports only one instance of it, effectively making it a singleton
export const App = new FtApplication();