import AScene from "../system/AScene";
import Point from "../../../misc/Point";
import { Assets } from "pixi.js"
import { SIDES, CGameSceneConfigs, SGameDTO } from "../../../misc/types";
import CBall from "./CBall";
import CPaddle from "./CPaddle";
import CTeam from "./CTeam";
import CNumbersText from "./CNumbersText";
import CPaddleControls from "./CPaddleControls";

export default class GameScene extends AScene<CGameSceneConfigs> {
    override async init(gameSceneConfigs: CGameSceneConfigs) {
        await Assets.loadBundle("gameScene");

        this._timer = new CNumbersText(
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
        gameSceneConfigs.gameInitialState.paddles.forEach(paddleConf => { 
            this.paddles.set(
                paddleConf.id,  
                new CPaddle(paddleConf, this._root),
            )
        })
        gameSceneConfigs.controls.forEach( (controls, humanID) => {
            this._controls.set(humanID, new CPaddleControls(humanID, controls))
        })
    }

    override async destroy(): Promise<void> {
        this.root.destroy();
        this._controls.forEach((controls) => {
            controls.destroy();
        })
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
                ball.speed = ballState.speed
            }
        })
        gameDto.paddles.forEach(paddleState => {
            const paddle = this.paddles.get(paddleState.id);
            if (paddle === undefined) {
                throw new Error("Client cannot find a paddle with the ID the server says exists!")
            }
            paddle.pos = Point.fromObj(paddleState.pos);
            paddle.size = Point.fromObj(paddleState.size);
            paddle.speed = paddleState.speed;
        });
        gameDto.teams.forEach(teamState => {
            const team = this.teams.get(teamState.side);
            if (team) {
                team.updateHP(teamState.score);
            } 
        })
        this.timer?.update(gameDto.timeLeft, false); 
    }

    override tickerUpdate(delta: number): void {
        this.teams.forEach(team => {
            team.hp.updateAnimations();
        })
        this._paddles.forEach(paddle => {
            paddle.updateAnimations();
        })
    }

    private _timer: CNumbersText | null = null;
    get timer() { return this._timer; }

    private _controls: Map<number, CPaddleControls> = new Map<number, CPaddleControls>;

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