import SBall from "./SBall.js";
import SPaddle from "./SPaddle.js"
import SPlayer from "./SPlayer.js";
import { SIDES, SGameConfigs, SGameDTO } from "../misc/types.js";
import Point from "../misc/Point.js";
import STeam from "./STeam.js";

class ServerGame {
    constructor(gameOpts: SGameConfigs) {
        this._gameRunning = false
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
            ) //TODO: When a score is added, a paddle class is not enough, some sort of player class (played both by a human and AI) will be needed
        }
        this._players = []; //TODO: change to humans
        for (const player of gameOpts.humans) {
            const playerPaddle = this.paddles.find(paddle => paddle.id === player.paddleID)
            if (!playerPaddle) {
                throw new Error(`A player says it owns a paddle with paddleID ${player.paddleID}, but that paddleID does not exist!`)
            }
            this.players.push(
                new SPlayer(
                    {
                        left: { pressed: false},
                        right: { pressed: false},
                        pause: { pressed: false }
                    },
                    playerPaddle
                )
            )
        }
    }

    dealWithClientInput(playerIndex: number, delta: number) {
        const player = this.players[playerIndex];
        // Movement handling
        if (player.controls.left.pressed || player.controls.right.pressed) {
            let movVector = player.paddle.orientation.clone()
                                    .multiplyScalar(player.paddle.speed)
                                    .multiplyScalar(delta);
            movVector = movVector.rotate(player.controls.left.pressed ? -90 : 90);
            player.paddle.move(movVector);
        }

        // Boundary handling
        if (player.paddle.pos.x < 0) {
            player.paddle.pos.x = 0;
        }
        if (player.paddle.pos.x > this.windowSize.x) {
            player.paddle.pos.x = this.windowSize.x;
        }
        if (player.paddle.cbox.y < 0) {
            player.paddle.pos.y = player.paddle.cbox.height / 2;
        }
        if (player.paddle.cbox.y + player.paddle.cbox.height > this.windowSize.y) {
            player.paddle.pos.y = this.windowSize.y - player.paddle.cbox.height / 2;
        }
    }

    updateGameState(delta: number) {
        const oldPos = this.ball.pos.clone();
        const movVector = this.ball.direction.clone()
                                .multiplyScalar(this.ball.speed)
                                .multiplyScalar(delta);
        const newPos = oldPos.add(movVector);

        if (newPos.x < 0 || newPos.x > this.windowSize.x) {
            this.ball.direction.x *= -1
            if (newPos.x < 0) {
                const team = this.teams.find(team => team.side == SIDES.LEFT)
                if (team) {
                    team.score += 1;
                }
            } else {
                const team = this.teams.find(team => team.side == SIDES.RIGHT)
                if (team) {
                    team.score += 1;
                }
            }
        } else if (newPos.y < 0 || newPos.y > this.windowSize.y) { //TODO URGENT: use cboxes instead of position!!!
            this.ball.direction.y *= -1
            if (newPos.y < 0) {
                const team = this.teams.find(team => team.side == SIDES.TOP)
                if (team) {
                    team.score += 1;
                }
            } else {
                const team = this.teams.find(team => team.side == SIDES.BOTTOM)
                if (team) {
                    team.score += 1;
                }
            }
        } else {
            this.ball.move(movVector);
        }

        for (let paddle of this.paddles) {
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
                //this.ball.speed += 10;
                for (let paddle of this.paddles) {
                    paddle.speed += 2;
                }
            }
        }
        console.log(this.teams)
    }

    startGameLoop() {
        let prevTime = Date.now();

        const loop = () => {
            const currentTime = Date.now();
            const delta = (currentTime - prevTime) / 1000;
            if (this.players[0].controls.pause.pressed) {
                this.gameRunning = !this.gameRunning;
            }
            if (this.players[0].controls.pause.pressed) {
                this.players[0].controls.pause.pressed = false;
            }
            if (this.gameRunning) {
                for (let i = 0; i < this.players.length; i++) {
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

    private _players: SPlayer[];
    set players(value: SPlayer[]) { this._players = value; }
    get players(): SPlayer[] { return this._players; }
}

export default ServerGame;