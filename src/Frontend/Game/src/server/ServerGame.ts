import { SGameConfigs, SGameDTO, CGameDTO, point, Adto } from "../misc/types.js";
import LoopController from "./LoopController.js";
import SHumansManager from "./Players/SHumansManager.js";
import STeamsManager from "./STeamsManager.js";
import BotsManager from "./Players/SBotsManager.js";
import SBallsManager from "./Objects/SBallsManager.js";
import SPaddlesManager from "./Objects/SPaddlesManager.js";
import { BALL_TYPES } from "./Objects/SBall.js";
import WebSocket from "ws";


export default class ServerGame {
    constructor(gameOpts: SGameConfigs) {
        this._windowSize = gameOpts.window.size;
        this._timeLeft = gameOpts.gameLength;
        this._ballsManager = new SBallsManager(this._windowSize, gameOpts.gameInitialState.ball);
        this._teamsManager = new STeamsManager(gameOpts.teams)
        this._paddlesManager = new SPaddlesManager(gameOpts.gameInitialState.paddles, this.windowSize);
        this._humansManager = new SHumansManager(gameOpts.humans, this._paddlesManager.paddles);
        this._botsManager = new BotsManager(gameOpts.bots, this._paddlesManager.paddles, this.windowSize)
    }

    startGameLoop() {
        const loop = new LoopController(60);
        //this._ballsManager.addBallOfType(BALL_TYPES.BASIC);
        loop.start(() => {
            if (loop.isRunning) {
                // Movement decision by players
                this._humansManager.update()
                this._botsManager.update(loop, this._ballsManager.balls)
                
                // Object movement
                this._paddlesManager.update(loop);
                this._ballsManager.update(loop);

                // Collision handling
                // I do not like this very much... The collision handling is not uniform across all objects
                // Might create a objectsManager instead of a manager for each object,
                // but I would have to make sure that I do not decrease flexibility
                // I should definitely delagate the consequenses to each object though!
                // I can also make a collision handler a singleton and register/unregister objects there?
                this._ballsManager.handleLimitCollision(this._teamsManager);
                this._paddlesManager.handleCollisions(this._ballsManager);
                
                if (loop.isEventTime(1)) {
                    this._timeLeft -= 1;
                }
                // Game state handling
                if (this._teamsManager.teamLost() !== undefined
                    || this._timeLeft <= 0) {
                    loop.pause();
                    const finalGameState = this._teamsManager.getTeamsState();
                    console.log(finalGameState);
                }
            }
        })
    }

    startBroadcast(clients: WebSocket[]) {
        const loop = new LoopController(60);
        loop.start(() => {
            const message: Adto = {
                type: "SGameDTO",
                dto: this.getGameDTO()
            }
            const data = JSON.stringify(message);
            for (var client of clients) {
                client.send(data)
            }
        })
    }

    getGameDTO(): SGameDTO {
        const out: SGameDTO = {
            balls: this._ballsManager.getBallsDTO(),
            teams: this._teamsManager.getTeamsDTO(),
            paddles: this._paddlesManager.getPaddlesDTO(),
            timeLeft: this._timeLeft
        }
        return out
    }

    processClientDTO(dto: CGameDTO) {
        this._humansManager.updateControlState(
            dto.controlsState.humanID,
            dto.controlsState.controlsState
        );
    }

    getHumansAmount(): number {
        return this._humansManager.humans.length
    }

    private _windowSize: point;
    set windowSize(value: point) { this._windowSize = value; }
    get windowSize() { return this._windowSize; }
    
    private _timeLeft: number; 

    private _ballsManager: SBallsManager;
    private _teamsManager: STeamsManager;
    private _humansManager: SHumansManager;
    private _botsManager: BotsManager;
    private _paddlesManager: SPaddlesManager;

}