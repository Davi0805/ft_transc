import AScene from "../system/AScene";
import Point from "../../../misc/Point";
import { Assets, Sprite, BitmapText } from "pixi.js"
import { EventBus } from "../system/EventBus";
import CBall from "./CBall";
import CPaddle from "./CPaddle";
import { SIDES, CGameSceneConfigs, SceneChangeDetail, SGameDTO, TControls, TControlsState, CGameDTO } from "../../../misc/types";
import CTeam from "./CTeam";
import CScore from "./CScore";

export default class GameScene extends AScene<CGameSceneConfigs> {
    override async init(gameSceneConfigs: CGameSceneConfigs) {
        this._assets = await Assets.loadBundle("gameScene");

        const ballState = gameSceneConfigs.gameInitialState.ball;
        const ballName = "ball" + ballState.spriteID
        const ballSprite = new Sprite(this._assets[ballName]);
        this._root.addChild(ballSprite);
        
        this._ball = new CBall(
            0, //TODO: This will need to be generated somehow when more balls exist
            Point.fromObj(ballState.pos),
            Point.fromObj(ballState.size),
            ballSprite
        ); //TODO Check if setting the pos like this works. Visual coordinates are different than game coordinates

        gameSceneConfigs.gameInitialState.teams.forEach(team => {
            const text = new BitmapText({
                text: team.score,
                style: {
                    fontFamily: 'scoreFont', // This is what is loaded in the Assets
                    fontSize: 32,
                    fill: '#666666',
                },
            });
            text.anchor.set(0.5, 0.5);
            text.position.set(team.score.pos.x, team.score.pos.y); //TODO calculate somehow (maybe here is not even the best place to do it?)
            this._root.addChild(text)

            this.teams.set(team.side, new CTeam(
                team.side,
                new CScore(team.score.score, text)
            ))
        }) 

        gameSceneConfigs.gameInitialState.paddles.forEach(paddleConf => { 
            const paddleSpriteName = "paddle" + paddleConf.spriteID
            const paddleSprite = new Sprite(this._assets[paddleSpriteName])
            this._root.addChild(paddleSprite);
            this.paddles.set(paddleConf.id,  
                new CPaddle(
                    paddleConf.id,
                    paddleConf.side,
                    Point.fromObj(paddleConf.pos),
                    Point.fromObj(paddleConf.size),
                    paddleSprite),
                )
        })


        gameSceneConfigs.controls.forEach( (controls, humanID) => {
            this.controlsState.set(humanID, {
                left: { pressed: false },
                right: { pressed: false },
                pause: { pressed: false }
            })
        })
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
        this.ball.pos = Point.fromObj(gameDto.ball.pos);
        gameDto.paddles.forEach(paddleState =>{
            const paddle = this.paddles.get(paddleState.id);
            if (paddle === undefined) {
                throw new Error("Client cannot find a paddle with the ID the server says exists!")
            }
            paddle.pos = Point.fromObj(paddleState.pos);
        });
        gameDto.teams.forEach(teamState => {
            const team = this.teams.get(teamState.side);
            if (team) {
                team.score.update(teamState.score);
            } 
        })
    }

    override tickerUpdate(): void {}

    private _onKeyDown!: (event: KeyboardEvent) => void;
    private _getOnKeyDown(controlsMap: Map<number, TControls>) {
        // Callbacks like these must be arrow functions and not methods!
        // This way, if it is needed to use class members (like _keys in this case),
        // the "this" keyword inherits context when passed as callback
        return (event: KeyboardEvent) => {
            
            
            /* if (event.key === "c") { //TODO: TEMPORARY: THIS IS JUST AN EXAMPLE ON HOW TO CHANGE SCENES 
                const detail: SceneChangeDetail =  {
                    sceneName: "exampleScene",
                    configs: {
                    }
                }
                EventBus.dispatchEvent(new CustomEvent("changeScene", { detail: detail}))
                return ;
            } */

            controlsMap.forEach((controls, id) => {
                const specificControlsState = this.controlsState.get(id);
                if (specificControlsState === undefined) {
                    throw new Error(`This client cannot find the controlsState of the human with ID ${id}`)
                }
                let stateChanged = false;
                switch (event.key) {
                    case controls.left: {
                        specificControlsState.left.pressed = true;
                        stateChanged = true;
                        break;
                    } case controls.right: {
                        specificControlsState.right.pressed = true;
                        stateChanged = true;
                        break;
                    } case controls.pause: {
                        specificControlsState.pause.pressed = true;
                        stateChanged = true;
                        break;
                    }
                }
                if (stateChanged) {
                    const dto: CGameDTO = {
                        controlsState: {humanID: id, controlsState: specificControlsState}
                    }
                    EventBus.dispatchEvent(new CustomEvent("sendToServer", { detail: dto}))
                }
            })
        }
    }

    private _onKeyUp!: (event: KeyboardEvent) => void;
    private _getOnKeyUp = (controlsMap: Map<number, TControls>) => {
        return (event: KeyboardEvent) => {
            controlsMap.forEach((controls, id) => {
                const specificControlsState = this.controlsState.get(id);
                if (specificControlsState === undefined) {
                    throw new Error(`This client cannot find the controlsState of the human with ID ${id}`)
                }
                let stateChanged = false;
                switch (event.key) {
                    case controls.left: {
                        specificControlsState.left.pressed = false;
                        stateChanged = true;
                        break;
                    } case controls.right: {
                        specificControlsState.right.pressed = false;
                        stateChanged = true;
                        break;
                    } case controls.pause: {
                        specificControlsState.pause.pressed = false;
                        stateChanged = true;
                        break;
                    }
                }
                if (stateChanged) {
                    const dto: CGameDTO = {
                        controlsState: {humanID: id, controlsState: specificControlsState}
                    }
                    EventBus.dispatchEvent(new CustomEvent("sendToServer", { detail: dto}))
                }
            })


            /* if (event.key === controls.left) {
                this.controlsState.left.pressed = false;
            } else if (event.key === controls.right) {
                this.controlsState.right.pressed = false;
            } else if (event.key === controls.pause) {
                this.controlsState.pause.pressed = false;
            }
            EventBus.dispatchEvent(new CustomEvent("sendToServer", { detail: { controlsState: this.controlsState}})) */
        }
    }

    private _controlsState: Map<number, TControlsState> = new Map<number, TControlsState>
    /*{
        left: { pressed: false },
        right: { pressed: false },
        pause: { pressed: false }
    }*/
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

    private _teams: Map<SIDES, CTeam> = new Map<SIDES, CTeam>;
    get teams(): Map<SIDES, CTeam> { return this._teams; }

    private _paddles: Map<number, CPaddle> = new Map<number, CPaddle>;
    get paddles() { return this._paddles }
    set paddles(value: Map<number, CPaddle>) { this._paddles = value }
}