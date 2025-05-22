import AScene from "../system/AScene";
import Point from "../../../misc/Point";
import { Assets, Sprite } from "pixi.js"
import { EventBus } from "../system/EventBus";
import CBall from "./CBall";
import CPaddle from "./CPaddle";
import { CGameSceneConfigs, SceneChangeDetail, SGameDTO, TControls, TControlsState } from "../../../misc/types";

export default class GameScene extends AScene<CGameSceneConfigs> {
    override async init(gameSceneConfigs: CGameSceneConfigs) {
        this._assets = await Assets.loadBundle("gameScene"); //TODO: Probably not needed if assets are only needed once??

        const ballState = gameSceneConfigs.gameInitialState.ball;
        const ballSprite = new Sprite(this._assets.ball);// TODO Fix this to accept the sprite in the configs
        this._root.addChild(ballSprite);
        
        this._ball = new CBall(
            ballState.pos,
            ballState.size,
            ballSprite
        ); //TODO Check if setting the pos like this works. Visual coordinates are different than game coordinates
        
        for (const paddleConf of gameSceneConfigs.gameInitialState.paddles) {
            const paddleSprite = new Sprite(this._assets.paddle) // TODO Fix this to accept the sprite in the configs
            this._root.addChild(paddleSprite);
            this.paddles.push( new CPaddle(
                paddleConf.side,
                paddleConf.pos,
                paddleConf.size,
                paddleSprite
            ))
        }


        this._onKeyDown = this._getOnKeyDown(gameSceneConfigs.controls); //TODO: Probably should put some of this in the AScene?
        this._onKeyUp = this._getOnKeyUp(gameSceneConfigs.controls);
        window.addEventListener("keydown", this._onKeyDown);
        window.addEventListener("keyup", this._onKeyUp);
    }
    override async destroy(): Promise<void> {
        this.root.destroy();
        window.removeEventListener("keydown", this._onKeyDown);
        window.removeEventListener("keyup", this._onKeyUp);
    }
    override serverUpdate(dto: unknown): void {
        const gameDto = dto as SGameDTO;
        try {
            this.ball.pos = Point.fromObj(gameDto.ball.pos);
            for (const i in gameDto.paddles) {
                this.paddles[i].pos = Point.fromObj(gameDto.paddles[i].pos);
            }
            
        } catch (error) {console.log(error)}
    }

    override tickerUpdate(): void {}

    private _onKeyDown!: (event: KeyboardEvent) => void;
    private _getOnKeyDown(controls: TControls) {
        // Callbacks like these must be arrow functions and not methods!
        // This way, if it is needed to use class members (like _keys in this case),
        // the "this" keyword inherits context when passed as callback
        return (event: KeyboardEvent) => {
            
            
            if (event.key === "c") { //TODO: TEMPORARY: THIS IS JUST AN EXAMPLE ON HOW TO CHANGE SCENES 
                const detail: SceneChangeDetail =  {
                    sceneName: "exampleScene",
                    configs: {
                    }
                }
                EventBus.dispatchEvent(new CustomEvent("changeScene", { detail: detail}))
                return ;
            }


            if (event.key === controls.left) {
                this.controlsState.left.pressed = true;
            } else if (event.key === controls.right) {
                this.controlsState.right.pressed = true;
            } else if (event.key === controls.pause) {
                this.controlsState.pause.pressed = true;
            }
            EventBus.dispatchEvent(new CustomEvent("sendToServer", { detail: { controlsState: this.controlsState }}))
        }
    }

    private _onKeyUp!: (event: KeyboardEvent) => void;
    private _getOnKeyUp = (controls: TControls) => {
        return (event: KeyboardEvent) => {
            if (event.key === controls.left) {
                this.controlsState.left.pressed = false;
            } else if (event.key === controls.right) {
                this.controlsState.right.pressed = false;
            } else if (event.key === controls.pause) {
                this.controlsState.pause.pressed = false;
            }
            EventBus.dispatchEvent(new CustomEvent("sendToServer", { detail: { controlsState: this.controlsState}}))
        }
    }

    private _controlsState: TControlsState = {
        left: { pressed: false },
        right: { pressed: false },
        pause: { pressed: false }
    }
    get controlsState() {
        return this._controlsState;
    }

    private _ball: CBall | undefined;
    get ball() {
        if (!this._ball) {
            throw new Error("Ball is undefined!");
        }
        return this._ball
    }
    private _paddles: CPaddle[] = [];
    get paddles() {
        return this._paddles
    }
    set paddles(value: CPaddle[]) {
        this._paddles = value
    }
}