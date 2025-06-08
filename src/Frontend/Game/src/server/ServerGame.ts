import SBall, { BALL_TYPES } from "./SBall.js";
import SPaddle from "./SPaddle.js"
import SHuman from "./SHuman.js";
import { SIDES, SGameConfigs, SGameDTO, CGameDTO, point } from "../misc/types.js";
import Point from "../misc/Point.js";
import STeam from "./STeam.js";
import SBot from "./SBot.js";
import BallManager from "./BallManager.js";
import { getRandomInt } from "../misc/utils.js";

export default class ServerGame {
    constructor(gameOpts: SGameConfigs) {
        this._gameRunning = false;
        this._windowSize = gameOpts.window.size;
        const ballInitialState = gameOpts.gameInitialState.ball;
        this._ballManager = new BallManager(this._windowSize, new SBall(
            0, //TODO: This will need to be generated somehow when more balls exist
            Point.fromObj(ballInitialState.pos),
            Point.fromObj(ballInitialState.size),
            ballInitialState.speed,
            Point.fromObj(ballInitialState.direction)
        ));
        this._teams = [];
        gameOpts.teams.forEach(team => {
            this.teams.push(new STeam(
                team.side, team.score
            ))
        })
        this._paddles = [];
        gameOpts.gameInitialState.paddles.forEach(paddle => {
            this.paddles.push( 
                new SPaddle(
                    paddle.id,
                    paddle.side,
                    Point.fromObj(paddle.pos),
                    Point.fromObj(paddle.size),
                    paddle.speed
                ),
            )
        })
        this._humans = [];
        gameOpts.humans.forEach(human => {
            const humanPaddle = this.paddles.find(paddle => paddle.id === human.paddleID)
            if (!humanPaddle) {
                throw new Error(`A human says it owns a paddle with paddleID ${human.paddleID}, but that paddleID does not exist!`)
            }
            this.humans.push(
                new SHuman(
                    human.id,
                    humanPaddle
                )
            )
        })
        this._bots = [];
        const windowLimits = SBot.buildLimits(this.paddles, this.windowSize, ballInitialState.size); 
        gameOpts.bots.forEach(bot => {
            const botPaddle = this.paddles.find(paddle => paddle.id === bot.paddleID);
            if (!botPaddle) {
                throw new Error(`A bot says it owns a paddle with paddleID ${bot.paddleID}, but that paddleID does not exist!`)
            }
            this.bots.push(
                new SBot(
                    windowLimits,
                    botPaddle,
                    bot.difficulty
                )
            )
        })
    }

    startGameLoop() {
        let prevTime = Date.now();
        let inGameTime = 0;
        const loop = () => {
            const currentTime = Date.now();
            const delta = (currentTime - prevTime) / 1000;
            
            // The following code is just to control the pause state, to make testing easier.
            // Should be removed later!
            if (this.humans[0].controls.pause.pressed) {
                this.gameRunning = !this.gameRunning;
            }
            if (this.humans[0].controls.pause.pressed) {
                this.humans[0].controls.pause.pressed = false;
            }


            if (this.gameRunning) {
                inGameTime += 1;
                if ((inGameTime % (60 * 2)) === 0) {
                    this._ballManager.addBallOfType(getRandomInt(0, BALL_TYPES.BALL_TYPE_AM))
                }
                this.ballManager.moveBalls(delta);
                this.humans.forEach(human => {
                    human.movePaddleFromControls(delta);
                });
                this.bots.forEach(bot => {
                    bot.timeSinceLastUpdate += delta;
                    if (bot.timeSinceLastUpdate >= bot.updateRate) {
                        bot.updateTargetPos(this.ballManager.balls); //TODO IMPORTANT: this must be updated! Probably pass the entire array?
                        bot.timeSinceLastUpdate -= bot.updateRate;
                    }
                    bot.setupMove();
                    bot.movePaddleFromControls(delta);
                })

                this._handleCollisions();
                
                const teamWithEndScore = this.teams.find(team => team.score >= 100);
                if (teamWithEndScore !== undefined) {
                    const finalGameState: Record<string, number> = {} as Record<SIDES, number>;
                    this.teams.forEach(team => {
                        finalGameState[SIDES[team.side]] = team.score;
                    })
                    this.gameRunning = false;
                    console.log(finalGameState);
                }
            }
            prevTime = currentTime;
            setTimeout(loop, 1000 / 60); // Target rate of game update (last number in FPS)
        }
        loop();
    }

    getGameDTO(): SGameDTO {
        const out: SGameDTO = {
            balls: this.ballManager.balls.map(ball => ({
                    id: ball.id,
                    type: ball.type,
                    pos: ball.pos.toObj()
                })
            ),
            teams: this.teams.map(team => ({
                    side: team.side,
                    score: team.score
                })
            ),
            paddles: this.paddles.map(paddle => ({
                id: paddle.id,
                pos: paddle.pos.toObj(),
                size: paddle.size.toObj()
            })),
        }
        return out
    }

    processClientDTO(dto: CGameDTO) {
        const human = this.humans.find((human => human.id === dto.controlsState.humanID))
        if (human === undefined) {
            throw new Error (`Server cannot find a human with id ${dto.controlsState.humanID}, which was requesteb by a client!`)
        }
        human.controls = dto.controlsState.controlsState;
    }


    private _gameRunning: boolean;
    set gameRunning(value: boolean) { this._gameRunning = value; }
    get gameRunning() { return this._gameRunning; }

    private _windowSize: point;
    set windowSize(value: point) { this._windowSize = value; }
    get windowSize() { return this._windowSize; }

    private _ballManager: BallManager;
    set ballManager(value: BallManager) { this._ballManager = value; }
    get ballManager() { return this._ballManager; }

    private _teams: STeam[]
    set teams(teams: STeam[]) { this._teams = teams; }
    get teams(): STeam[] { return this._teams; }

    private _paddles: SPaddle[];
    set paddles(value: SPaddle[]) { this._paddles = value; }
    get paddles(): SPaddle[] { return this._paddles; }

    private _humans: SHuman[];
    set humans(value: SHuman[]) { this._humans = value; }
    get humans(): SHuman[] { return this._humans; }

    private _bots: SBot[];
    set bots(bots: SBot[]) { this._bots = bots; }
    get bots(): SBot[] { return this._bots; }


    private _handleCollisions() {
        this.ballManager.handleLimitCollision(this.teams);
        this.paddles.forEach(paddle => {
            this.ballManager.handlePaddleCollision(paddle);
            this._handlePaddleLimitsCollision(paddle);
        })
    }

    private _handlePaddleLimitsCollision(paddle: SPaddle) {
        if (paddle.cbox.x < 0) {
            paddle.pos.x = paddle.cbox.width / 2;
        }
        if (paddle.cbox.x + paddle.cbox.width > this.windowSize.x) {
            paddle.pos.x = this.windowSize.x - paddle.cbox.width / 2;
        }
        if (paddle.cbox.y < 0) {
            paddle.pos.y = paddle.cbox.height / 2;
        }
        if (paddle.cbox.y + paddle.cbox.height > this.windowSize.y) {
            paddle.pos.y = this.windowSize.y - paddle.cbox.height / 2;
        }
    }
}