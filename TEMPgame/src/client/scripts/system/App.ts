import { Application, ApplicationOptions, Assets, AssetsManifest } from 'pixi.js'
//import { ScenesManager, ScenesManifest } from './ScenesManager';
import { EventBus } from './EventBus';
//import { KeyboardDTO } from '../game/GameScene';

import { GameScene } from '../game/GameScene';
import { CAppConfigs } from '../../../misc/types';

// This type allows all configs to be present in one file
/* export type GameConfigs = {
    websocket: WebSocket,
    appConfigs: Partial<ApplicationOptions>,
    assetsManifest: AssetsManifest,
    scenesManifest: ScenesManifest
} */

class FtApplication {
    async init(gameConfigs: CAppConfigs) {
        // Socket setup
        this._socket = gameConfigs.websocket; //TODO MOVE TO BEGINNING SO IT CAN RECEIVE INITIAL CONFIGS
        // When a message is received from server, it is forward to the handler of the current scene
        this._socket.addEventListener("message", (event) => {
            const message = JSON.parse(event.data);
            if (message.type === "gameDTO") {
                //this._scenesManager.currentScene?.serverUpdate(dto);
                gameScene.serverUpdate(message.gameDTO);
            }
        })
        // And when a message needs to be sent, the scene will send it as a signal, and the App will catch it
        // and forward it to the socket. This avoids the scenes to hold references to higher objects in the tree
        EventBus.addEventListener("sendToServer", (event: Event) => {
            const dto = (event as CustomEvent).detail;
            console.log(dto);
            this._socket.send(JSON.stringify(dto))
        })

        this._app = new Application();
        await this._app.init(gameConfigs.appConfigs);
        document.body.appendChild(this._app.canvas); // This makes the canvas of the Pixi app show up on the browser




        //TODO: This is temporary. Discuss how to choose the right sprites
        const assetsManifest = {
            bundles: [
                {
                    name: "gameScene",
                    assets: [
                        {
                            alias: "ball",
                            src: "sprites/ball.png"
                        },
                        {
                            alias: "paddle",
                            src: "sprites/paddle.png"
                        }
                    ]
                },
                {
                    name: "exampleScene",
                    assets: [
                        {
                            alias: "ball",
                            src: "sprites/ball.png"
                        }
                    ]
                }
            ]
        }
        // assetsManifest has the assets bundles, which include all pahts to all sprites and their alias
        // This makes the bundles available directly in Assets, which is globally accessible
        Assets.init({manifest: assetsManifest})
        //Assets.addBundle('sprites', gameConfigs.assetsBundle);








        // Creates the scenes manager and feeds to it all the scenes of the game through the manifest
        //this._scenesManager = new ScenesManager(gameConfigs.scenesManifest);
        // This makes so anything the scene manager adds to container shows up on screen
        //this.app.stage.addChild(this._scenesManager.container);
        // Starts the first scene
        //await this._scenesManager.goToScene("exampleScene"); //TODO change to the correct first scene

        // This initiates the game immediately. Use the above if different scenes are needed (although some way is needed to pass the configs to init of each scene)
        const gameScene = new GameScene();
        await gameScene.init(gameConfigs.gameSceneConfigs); //TODO put here the scene configs
        this.app.stage.addChild(gameScene.root);

        
    }

    private _app!: Application;
    get app() {
        if (!this._app) {
            throw new Error("Application has not been initialized. Call run() first!");
        }
        return this._app;
    }

    //private _scenesManager!: ScenesManager;

    private _socket!: WebSocket;
    // All properties are marked with assertion operator because they are only assigned in the init() method.
    // This is necessary because not only it is a singleton (so the constructor is called immediately at import)
    // but also because there are asynchronous tasks running at init. 
    // Since init() is the only function exposed and nothing else does anything, this is safe
}

// Exports only one instance of it, effectively making it a singleton
export const App = new FtApplication();