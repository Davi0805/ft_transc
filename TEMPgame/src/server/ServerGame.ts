import SBall from "./SBall.js";
import SPaddle from "./SPaddle.js"
import SPlayer from "./SPlayer.js";
import { getNewPosition, areColliding, rotatePoint } from "../misc/utils.js";
import '@pixi/math-extras'
import { SIDES, SGameConfigs, SGameDTO } from "../misc/types.js";

class ServerGame {
    constructor(gameOpts: SGameConfigs) {
        this._gameRunning = false
        this._windowSize = gameOpts.window.size;
        const ballInitialState = gameOpts.gameInitialState.ball;
        this._ball = new SBall(
            ballInitialState.pos,
            ballInitialState.size,
            ballInitialState.speed,
            ballInitialState.direction
        );
        this._paddles = [];
        for (const paddle of gameOpts.gameInitialState.paddles) {
            this.paddles.push( 
                new SPaddle(
                    paddle.side,
                    paddle.pos,
                    paddle.size,
                    paddle.speed
                ),
            ) //TODO: When a score is added, a paddle class is not enough, some sort of player class (played both by a human and AI) will be needed
        }
        this._players = [];
        for (const player of gameOpts.players) {
            const playerPaddle = this.paddles.find(paddle => paddle.side === player.paddleSide)
            if (!playerPaddle) {
                throw new Error(`A player says it owns a paddle on the ${player.paddleSide}, but no paddle exists there!`)
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
            movVector = rotatePoint(movVector, player.controls.left.pressed ? -90 : 90);
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
        const newPos = getNewPosition(oldPos, movVector);

        
        if (newPos.x < 0 || newPos.x > this.windowSize.x) {
            this.ball.direction.x *= -1
            /*if (newPos.x < 0) {
                this.players[1].score += 1;
            } else {
                this.players[0].score += 1;
            }*/
        } else if (newPos.y - this.ball.cbox.height / 2 < 0
                    || newPos.y + this.ball.cbox.height / 2 > this.windowSize.y) {
            this.ball.direction.y *= -1
        } else {
            this.ball.move(movVector);
        }
        newPos.clone()
        for (let paddle of this.paddles) {
            const collision = areColliding(this.ball.cbox, paddle.cbox); // Returns collision wall of FIRST object
            if (collision !== null) {
                console.log(SIDES[collision]);
                if ((collision === SIDES.LEFT && this.ball.direction.x < 0)
                    || (collision === SIDES.RIGHT && this.ball.direction.x > 0)) {
                    this.ball.direction.x *= -1;
                } else if ((collision === SIDES.TOP && this.ball.direction.y < 0)
                    || (collision === SIDES.BOTTOM && this.ball.direction.y > 0)) {
                    this.ball.direction.y *= -1;
                }
                const movDistance = (paddle.speed + this.ball.speed) * delta; // This in theory compensates for moving-into-ball paddles
                const movVector = this.ball.direction.clone().multiplyScalar(movDistance);
                this.ball.move(movVector);
                this.ball.speed += 10;
                for (let paddle of this.paddles) {
                    paddle.speed += 2;
                }
            }
        }
    }

    startGameLoop() {
        let prevTime = Date.now();

        const loop = () => {
            const currentTime = Date.now();
            const delta = (currentTime - prevTime) / 1000;
            //console.log(this.players[0].controls)
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
                pos: this.ball.pos,
            },
            paddles: this.players.map(player => ({
                side: player.paddle.side,
                pos: player.paddle.pos,
            })),
            //score: this.players.map(player => player.score).join(' : ')
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
    set windowSize(value: { x: number, y: number }) {
        this._windowSize = value;
    }
    get windowSize() {
        return this._windowSize;
    }

    private _ball: SBall;
    set ball(value: SBall) {
        this._ball = value;
    }
    get ball() {
        return this._ball;
    }

    private _paddles: SPaddle[];
    set paddles(value: SPaddle[]) {
        this._paddles = value;
    }
    get paddles(): SPaddle[] {
        return this._paddles;
    }

    private _players: SPlayer[];
    set players(value: SPlayer[]) {
        this._players = value;
    }
    get players(): SPlayer[] {
        return this._players;
    }
}

export default ServerGame;