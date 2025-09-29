import AScene from "../system/AScene";
import Point from "../matchSharedDependencies/Point";
import Assets from "../system/framework/Assets";
import { SIDES } from "../matchSharedDependencies/sharedTypes";
import { CGameSceneConfigs } from "../matchSharedDependencies/SetupDependencies";
import { GameUpdateDTO, SGameDTO } from "../matchSharedDependencies/dtos";
import CBall from "./CBall";
import CPaddle from "./CPaddle";
import CTeam from "./CTeam";
import CNumbersText from "./CNumbersText";
import CPaddleControls from "./CPaddleControls";
import { audioPlayer } from "../system/framework/Audio/AudioPlayer";
import { TMatchResult } from "../../pages/play/lobbyTyping";

export default class GameScene extends AScene<CGameSceneConfigs> {
    override async init(gameSceneConfigs: CGameSceneConfigs) {
        await Assets.loadBundle("gameScene");

        this._windowSize = gameSceneConfigs.fieldSize;

        this._root.pivot.setPoint(gameSceneConfigs.fieldSize.x / 2, gameSceneConfigs.fieldSize.y / 2);
        this._root.position.setPoint(gameSceneConfigs.fieldSize.x / 2, gameSceneConfigs.fieldSize.y / 2);

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
                ),
                gameSceneConfigs.gameInitialState.paddles
                    .filter(paddle => paddle.side === team.side)
                    .map(paddle => paddle.id)
            ))
        })
        gameSceneConfigs.gameInitialState.paddles.forEach(paddleConf => {
            this.paddles.set(
                paddleConf.id,  
                new CPaddle(paddleConf, this._root),
            )
        })
        gameSceneConfigs.gameInitialState.balls.forEach(ballConf => {
            this.balls.set(
                ballConf.id,
                new CBall(ballConf, this._root)
            );
        })

        if (gameSceneConfigs.controls === null) { throw Error("controls were not initialized!") }
        gameSceneConfigs.controls.forEach( human => {
            this._controls.set(human.humanID, new CPaddleControls(human.humanID, human.controls))
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

        if (gameDto.type === "GameUpdateDTO") {
            this._updateGameState(gameDto.data);
        } else {
            this._renderEndScene(gameDto.data);
        }
    }

    override tickerUpdate(delta: number, counter: number): void {
        this.teams.forEach(team => {
            team.hp.updateAnimations();
        })
        this._paddles.forEach(paddle => {
            paddle.updateAnimations();
        })
    }

    private _windowSize = {x:0, y: 0};

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

    private _suddenDeath = false;

    private _updateGameState(gameDto: GameUpdateDTO) {
        console.log("updateGameState")
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
                team.update(teamState.score);
            } 
        })
        this.timer?.update(gameDto.timeLeft, false);
        if (gameDto.timeLeft === 0 && !this._suddenDeath) {
            this._suddenDeath = true;
            this.teams.forEach(team => {
                team.state = "scared";
            })
        }
        if (gameDto.audioEvent) {
            audioPlayer.playTrack(gameDto.audioEvent, 1);
        }
    }

    private _renderEndScene(result: TMatchResult) {
        
        const winningTeam = this.teams.get(result[0]);
        if (!winningTeam) {throw Error(`The winner is ${result[0]}`)}
        winningTeam.update(1)
        winningTeam
        const winnerPaddleID = winningTeam.memberPaddlesIDs[0];
        const winnerPaddle = this.paddles.get(winnerPaddleID);
        if (!winnerPaddle) {throw Error(`winnerPaddle: ${winnerPaddle}`)}
        this._root.removeChild(winnerPaddle.sprite);
        winnerPaddle.pos = Point.fromObj({
            x: 200, y:200
        })
    }
}