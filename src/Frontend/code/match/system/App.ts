import Application from './framework/Application';
import Assets from './framework/Assets';
import { ScenesManager } from './ScenesManager';
import { EventBus } from './EventBus';
import { AudioEvent, SGameDTO } from '../matchSharedDependencies/dtos';
import { CAppConfigs } from '../matchSharedDependencies/SetupDependencies';
import { assetsManifest, audioTrackManifest, scenesManifest, soundsManifest } from '../game/Manifests';
import { audioPlayer } from './framework/Audio/AudioPlayer';

class FtApplication {
    isAppActive() {
        return this._app !== null ? true : false;
    }

    async init(
        gameConfigs: CAppConfigs,
        sendToServerFnc: (event: Event) => void,
        rootElement: HTMLElement,
    ) {
        this.setSendToServerFunc(sendToServerFnc);
        this._app = new Application(gameConfigs.appConfigs);
        
        //await this._app.init(gameConfigs.appConfigs);
        rootElement.appendChild(this._app.canvas); // This makes the canvas of the Pixi app show up on the browser

        // assetsManifest has the assets bundles, which include all paths to all sprites and their alias
        // This makes the bundles available directly in Assets, which is globally accessible
        Assets.init(assetsManifest) //It is kinda shitty that I have to load this every game, but it is what it is
        audioPlayer.init();
        audioPlayer.loadSounds(soundsManifest)
        audioPlayer.loadTracks(audioTrackManifest);
        
        // Creates the scenes manager and feeds to it all the scenes of the game through the manifest
        this._scenesManager = new ScenesManager(scenesManifest);
        // This makes so anything the scene manager adds to container shows up on screen
        this.app.stage.addChild(this._scenesManager.container);
        // Starts the first scene
        await this._scenesManager.goToScene("gameScene", gameConfigs.gameSceneConfigs); //TODO change to the correct first scene
    }

    async destroy() {
        console.log("destroy was called")
        this.scenesManager.removeCurrentScene();
        this.unsetSendToServerFunc();
        this._app?.destroy();
        this._app = null
        //Maybe something else is necessary?
    }

    severUpdate(dto: SGameDTO) {
        if (this._scenesManager && this.scenesManager.currentScene){
            this.scenesManager.currentScene.serverUpdate(dto);
        }
        if (dto.audioEvent) {
            audioPlayer.playTrack(dto.audioEvent, 1)
        } 
    }

    playAudio(audioEvent: AudioEvent) {
        audioPlayer.playTrack(audioEvent, 1)
    }

    setSendToServerFunc(sendToServerFnc: (event: Event) => void) {
        this._sendToServerFunc = sendToServerFnc;
        EventBus.addEventListener("sendToServer", this._sendToServerFunc)
    }
    unsetSendToServerFunc() {
        if (!this._sendToServerFunc) {
            return;
        }
        EventBus.removeEventListener("sendToServer", this._sendToServerFunc);
        this._sendToServerFunc = null;
    }

    private _app: Application | null = null;
    get app() {
        if (!this._app) {
            throw new Error("Application has not been initialized. Call run() first!");
        }
        return this._app;
    }

    private _scenesManager: ScenesManager | null = null;
    get scenesManager() {
        if (!this._scenesManager) {
            throw Error("There is no scenes manager to access!")
        };
        return this._scenesManager;
    }

    private _sendToServerFunc: ((event: Event) => void) | null = null
}

// Exports only one instance of it, effectively making it a singleton
export const App = new FtApplication();