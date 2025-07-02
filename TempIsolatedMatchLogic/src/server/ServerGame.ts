import { SGameConfigs, SGameDTO, CGameDTO, point, Adto } from "../misc/types.js";
import LoopController from "./LoopController.js";
import SHumansManager from "./Players/SHumansManager.js";
import STeamsManager from "./STeamsManager.js";
import BotsManager from "./Players/SBotsManager.js";
import SBallsManager from "./Objects/SBallsManager.js";
import SPaddlesManager from "./Objects/SPaddlesManager.js";
import WebSocket from "ws";
import { BALL_TYPES } from "./Objects/SBall.js";


export default class ServerGame {
    //Creates the game. To pass the correct configuration, must build a UserCustoms object (see in file src/misc/gameOptions.ts)
    //and then apply to it applyDevCustoms() and buildSGameConfigs() to the result of that.
    //See server.ts for example
    constructor(gameOpts: SGameConfigs) {
        this._windowSize = gameOpts.window.size;
        this._matchLength = gameOpts.matchLength;
        this._timeLeft = 3; // the initial countdown before the match starts
        this._ballsManager = new SBallsManager(this._windowSize);
        this._teamsManager = new STeamsManager(gameOpts.teams)
        this._paddlesManager = new SPaddlesManager(gameOpts.paddles, this.windowSize);
        this._humansManager = new SHumansManager(gameOpts.humans, this._paddlesManager.paddles);
        this._botsManager = new BotsManager(gameOpts.bots, this._paddlesManager.paddles, this.windowSize)
    }

    //Starts the internal logic loop. Should be started once all players are connected and ready to play
    startGameLoop() {
        const loop = new LoopController(90);
        loop.start(() => {
            if (loop.isRunning) {
                if (!this._matchHasStarted) {
                    this._countdownLoop(loop);
                } else {
                    this._matchLoop(loop);
                }
            }
        })
    }

    //Starts the broadcasting of the game to all the websockets in the array that is passed to it as argument
    startBroadcast(clients: WebSocket[]) {
        const loop = new LoopController(90);
        loop.start(() => {
            const message: Adto = {
                type: "SGameDTO",
                dto: this._getGameDTO()
            }
            const data = JSON.stringify(message);
            for (var client of clients) {
                client.send(data)
            }
        })
    }

    //This should be called whenever a message is received by one of the clients. 
    //The message should be casted to a CGameDTO and then sent as argument
    processClientDTO(dto: CGameDTO) {
        this._humansManager.updateControlState(
            dto.controlsState.humanID,
            dto.controlsState.controlsState
        );
    }

    private _windowSize: point;
    set windowSize(value: point) { this._windowSize = value; }
    get windowSize() { return this._windowSize; }
    
    private _matchHasStarted: boolean = false;

    private _matchLength: number;
    private _timeLeft: number; 

    private _ballsManager: SBallsManager;
    private _teamsManager: STeamsManager;
    private _humansManager: SHumansManager;
    private _botsManager: BotsManager;
    private _paddlesManager: SPaddlesManager;


    private _getGameDTO(): SGameDTO {
        const out: SGameDTO = {
            balls: this._ballsManager.getBallsDTO(),
            teams: this._teamsManager.getTeamsDTO(),
            paddles: this._paddlesManager.getPaddlesDTO(),
            timeLeft: this._timeLeft
        }
        return out
    }

    private _countdownLoop(loop: LoopController) {
        if (loop.isEventTime(1)) {
            this._timeLeft -= 1;
            if (this._timeLeft <= 0) {
                this._ballsManager.addBallOfType(BALL_TYPES.BASIC);
                this._timeLeft = this._matchLength;
                this._matchHasStarted = true;
            }
        }
    }

    private _matchLoop(loop: LoopController) {
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
        this._paddlesManager.handleCollisions(this._ballsManager, this._teamsManager);
        
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

}