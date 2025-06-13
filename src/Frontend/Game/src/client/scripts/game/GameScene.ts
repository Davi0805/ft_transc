import AScene from "../system/AScene";
import Point from "../../../misc/Point";
import { Assets } from "pixi.js"
import { EventBus } from "../system/EventBus";
import CBall from "./CBall";
import CPaddle from "./CPaddle";
import { SIDES, CGameSceneConfigs, SGameDTO, TControls, TControlsState, CGameDTO } from "../../../misc/types";
import CTeam from "./CTeam";
import CNumbersText from "./CNumbersText";
import { BALL_TYPES } from "../../../server/Objects/SBall";



export default class GameScene extends AScene<CGameSceneConfigs> {
    override async init(gameSceneConfigs: CGameSceneConfigs) {
        await Assets.loadBundle("gameScene");

        this._timeLeft = new CNumbersText(
            gameSceneConfigs.gameInitialState.gameLength,
            { size: 64, position: {
                x: gameSceneConfigs.fieldSize.x / 2,
                y: gameSceneConfigs.fieldSize.y / 2
            }},
            this._root
        );

        gameSceneConfigs.gameInitialState.teams.forEach(team => {
            this.teams.set(team.side, new CTeam(
                team.side,
                new CNumbersText(
                    team.score.score,
                    { size: 32, position: team.score.pos },
                    this._root
                )
            ))
        })

        this._balls.set(
            gameSceneConfigs.gameInitialState.ball.id, new CBall(
                gameSceneConfigs.gameInitialState.ball,
                this._root
            )
        )

        gameSceneConfigs.gameInitialState.paddles.forEach(paddleConf => { 
            this.paddles.set(
                paddleConf.id,  
                new CPaddle(paddleConf, this._root),
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
        gameDto.balls.newBalls.forEach(newBallConfigs => {
            this.balls.set(newBallConfigs.id, new CBall(
                newBallConfigs,
                this._root 
            ))
        })
        this.balls.forEach(ball => {
            const ballState = gameDto.balls.ballsState.find(ballState => ball.id === ballState.id);
            if (ballState === undefined) {
                this._root.removeChild(ball.sprite);
                this.balls.delete(ball.id)
            } else {
                ball.pos = Point.fromObj(ballState.pos);
            }
        })
        gameDto.paddles.forEach(paddleState => {
            const paddle = this.paddles.get(paddleState.id);
            if (paddle === undefined) {
                throw new Error("Client cannot find a paddle with the ID the server says exists!")
            }
            paddle.pos = Point.fromObj(paddleState.pos);
            paddle.size = Point.fromObj(paddleState.size)
        });
        gameDto.teams.forEach(teamState => {
            const team = this.teams.get(teamState.side);
            if (team) {
                team.score.update(teamState.score);
            } 
        })
        this._timeLeft.update(gameDto.timeLeft); 
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
        }
    }

    private _timeLeft!: CNumbersText;

    private _controlsState: Map<number, TControlsState> = new Map<number, TControlsState>
    get controlsState() {
        return this._controlsState;
    }

    private _balls: Map<number, CBall> = new Map<number, CBall>;
    get balls() {
        return this._balls
    }

    private _teams: Map<SIDES, CTeam> = new Map<SIDES, CTeam>;
    get teams(): Map<SIDES, CTeam> { return this._teams; }

    private _paddles: Map<number, CPaddle> = new Map<number, CPaddle>;
    get paddles() { return this._paddles }
    set paddles(value: Map<number, CPaddle>) { this._paddles = value }
}