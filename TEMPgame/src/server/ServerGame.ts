import SBall from "./SBall.js";
import SPaddle from "./SPaddle.js"
import SHuman from "./SHuman.js";
import { SIDES, SGameConfigs, SGameDTO, CGameDTO } from "../misc/types.js";
import Point from "../misc/Point.js";
import STeam from "./STeam.js";

class ServerGame {
    constructor(gameOpts: SGameConfigs) {
        this._gameRunning = false;
        this._windowSize = gameOpts.window.size;
        const ballInitialState = gameOpts.gameInitialState.ball;
        this._ball = new SBall(
            0, //TODO: This will need to be generated somehow when more balls exist
            Point.fromObj(ballInitialState.pos),
            Point.fromObj(ballInitialState.size),
            ballInitialState.speed,
            Point.fromObj(ballInitialState.direction)
        );
        this._teams = [];
        for (const team of gameOpts.teams) {
            this.teams.push(new STeam(
                team.side, team.score
            ))
        }

        this._paddles = [];
        for (const paddle of gameOpts.gameInitialState.paddles) {
            this.paddles.push( 
                new SPaddle(
                    paddle.id,
                    paddle.side,
                    Point.fromObj(paddle.pos),
                    Point.fromObj(paddle.size),
                    paddle.speed
                ),
            )
        }
        this._humans = [];
        for (const human of gameOpts.humans) {
            const humanPaddle = this.paddles.find(paddle => paddle.id === human.paddleID)
            if (!humanPaddle) {
                throw new Error(`A human says it owns a paddle with paddleID ${human.paddleID}, but that paddleID does not exist!`)
            }
            this.humans.push(
                new SHuman(
                    human.id,
                    {
                        left: { pressed: false},
                        right: { pressed: false},
                        pause: { pressed: false }
                    },
                    humanPaddle
                )
            )
        }
    }

    dealWithClientInput(playerIndex: number, delta: number) {
        const human = this.humans[playerIndex];
        // Movement handling
        if (human.controls.left.pressed || human.controls.right.pressed) {
            let movVector = human.paddle.orientation.clone()
                                    .multiplyScalar(human.paddle.speed)
                                    .multiplyScalar(delta);
            movVector = movVector.rotate(human.controls.left.pressed ? -90 : 90);
            human.paddle.move(movVector);
        }

        // Boundary handling
        if (human.paddle.pos.x < 0) {
            human.paddle.pos.x = 0;
        }
        if (human.paddle.pos.x > this.windowSize.x) {
            human.paddle.pos.x = this.windowSize.x;
        }
        if (human.paddle.cbox.y < 0) {
            human.paddle.pos.y = human.paddle.cbox.height / 2;
        }
        if (human.paddle.cbox.y + human.paddle.cbox.height > this.windowSize.y) {
            human.paddle.pos.y = this.windowSize.y - human.paddle.cbox.height / 2;
        }
    }

    updateGameState(delta: number) {
        const oldPos = this.ball.pos.clone();
        const movVector = this.ball.direction.clone()
                                .multiplyScalar(this.ball.speed)
                                .multiplyScalar(delta);
        const newPos = oldPos.add(movVector);

        if (newPos.x - this.ball.cbox.width < 0) {
            this.ball.direction.x *= -1
            const team = this.teams.find(team => team.side == SIDES.LEFT)
            if (team) {
                team.score += 1;
            }
        } else if (newPos.x + this.ball.cbox.width > this.windowSize.x) {
            this.ball.direction.x *= -1;
            const team = this.teams.find(team => team.side == SIDES.RIGHT)
            if (team) {
                team.score += 1;
            }
        } else if (newPos.y - this.ball.cbox.height < 0) {
            this.ball.direction.y *= -1;
            const team = this.teams.find(team => team.side == SIDES.TOP)
            if (team) {
                team.score += 1;
            }
        } else if (newPos.y + this.ball.cbox.height > this.windowSize.y) {
            this.ball.direction.y *= -1;
            const team = this.teams.find(team => team.side == SIDES.BOTTOM)
            if (team) {
                team.score += 1;
            }
        } else {
            this.ball.move(movVector);
        }

        this.paddles.forEach(paddle => {
            const collision = this.ball.cbox.areColliding(paddle.cbox);
            if (collision !== null) {
                if ((collision === SIDES.LEFT && this.ball.direction.x < 0)
                    || (collision === SIDES.RIGHT && this.ball.direction.x > 0)) {
                    this.ball.direction.x *= -1;
                } else if ((collision === SIDES.TOP && this.ball.direction.y > 0)
                    || (collision === SIDES.BOTTOM && this.ball.direction.y < 0)) {
                    this.ball.direction.y *= -1;
                }
                const movDistance = (paddle.speed + this.ball.speed) * delta; // This in theory compensates for moving-into-ball paddles
                const movVector = this.ball.direction.clone().multiplyScalar(movDistance);
                this.ball.move(movVector);
                this.ball.speed += 5;
                for (let paddle of this.paddles) {
                    paddle.speed += 1;
                }
            }
        });
    }

    startGameLoop() {
        let prevTime = Date.now();
        const loop = () => {
            const currentTime = Date.now();
            const delta = (currentTime - prevTime) / 1000;
            if (this.humans[0].controls.pause.pressed) {
                this.gameRunning = !this.gameRunning;
            }
            if (this.humans[0].controls.pause.pressed) {
                this.humans[0].controls.pause.pressed = false;
            }
            if (this.gameRunning) {
                for (let i = 0; i < this.humans.length; i++) {
                    this.dealWithClientInput(i, delta);
                }
                this.updateGameState(delta);
            }
            prevTime = currentTime;

            setTimeout(loop, 1000 / 60);
        }
        loop();
    }

    getGameDTO(): SGameDTO {
        return {
            ball: {
                pos: this.ball.pos.toObj(),
            },
            teams: this.teams.map(team => ({
                    side: team.side,
                    score: team.score
                })
            ),
            paddles: this.paddles.map(paddle => ({
                id: paddle.id,
                pos: paddle.pos.toObj(),
            })),
        };
    }

    processClientDTO(dto: CGameDTO) {
        const human = this.humans.find((human => human.id === dto.controlsState.humanID))
        if (human === undefined) {
            throw new Error (`Server cannot find a human with id ${dto.controlsState.humanID}, which was requesteb by a client!`)
        }
        human.controls = dto.controlsState.controlsState;
    }

    private _gameRunning: boolean;
    set gameRunning(value: boolean) {
        this._gameRunning = value;
    }
    get gameRunning() {
        return this._gameRunning;
    }

    private _windowSize: { x: number, y: number };
    set windowSize(value: { x: number, y: number }) { this._windowSize = value; }
    get windowSize() { return this._windowSize; }

    private _ball: SBall;
    set ball(value: SBall) { this._ball = value; }
    get ball() { return this._ball; }

    private _teams: STeam[]
    set teams(teams: STeam[]) { this._teams = teams; }
    get teams(): STeam[] { return this._teams; }

    private _paddles: SPaddle[];
    set paddles(value: SPaddle[]) { this._paddles = value; }
    get paddles(): SPaddle[] { return this._paddles; }

    private _humans: SHuman[];
    set humans(value: SHuman[]) { this._humans = value; }
    get humans(): SHuman[] { return this._humans; }
}

export default ServerGame;