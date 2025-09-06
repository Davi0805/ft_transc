import LoopController from "./LoopController.js";
import SHumansManager from "./Players/SHumansManager.js";
import STeamsManager from "./STeamsManager.js";
import BotsManager from "./Players/SBotsManager.js";
import SBallsManager from "./Objects/SBallsManager.js";
import SPaddlesManager from "./Objects/SPaddlesManager.js";
export default class ServerGame {
    //Creates the game. To pass the correct configuration, must build a UserCustoms object (see in file src/misc/gameOptions.ts)
    //and then apply to it applyDevCustoms() and buildSGameConfigs() to the result of that.
    //See server.ts for example
    constructor(gameOpts) {
        this._windowSize = gameOpts.window.size;
        this._matchLength = gameOpts.matchLength;
        this._timeLeft = 3; // the initial countdown before the match starts
        this._ballsManager = new SBallsManager(this._windowSize, gameOpts.powerupsActive);
        this._teamsManager = new STeamsManager(gameOpts.teams);
        this._paddlesManager = new SPaddlesManager(gameOpts.paddles, this.windowSize);
        this._humansManager = new SHumansManager(gameOpts.humans, this._paddlesManager.paddles);
        this._botsManager = new BotsManager(gameOpts.bots, this._paddlesManager.paddles, this.windowSize);
        this._gameLoop = new LoopController(90);
    }
    //Starts the internal logic loop. Should be started once all players are connected and ready to play
    startGameLoop() {
        this._gameLoop.start(() => {
            if (this._gameLoop.isRunning) {
                if (!this._matchHasStarted) {
                    this._countdownLoop();
                }
                else {
                    this._matchLoop();
                }
            }
        });
    }
    stopGameLoop() {
        this._gameLoop.stop();
    }
    getGameDTO() {
        const out = {
            balls: this._ballsManager.getBallsDTO(),
            teams: this._teamsManager.getTeamsDTO(),
            paddles: this._paddlesManager.getPaddlesDTO(),
            timeLeft: this._timeLeft
        };
        return out;
    }
    //This should be called whenever a message is received by one of the clients. 
    //The message should be casted to a CGameDTO and then sent as argument
    processClientDTO(dto) {
        if (this._matchResult) {
            return;
        }
        this._humansManager.updateControlState(dto.controlsState.humanID, dto.controlsState.controlsState);
    }
    _windowSize;
    set windowSize(value) { this._windowSize = value; }
    get windowSize() { return this._windowSize; }
    _matchHasStarted = false;
    _matchResult = null;
    get matchResult() { return this._matchResult; }
    _matchLength;
    _timeLeft;
    _ballsManager;
    _teamsManager;
    _humansManager;
    _botsManager;
    _paddlesManager;
    _gameLoop;
    _countdownLoop() {
        if (this._gameLoop.isEventTime(1)) {
            this._timeLeft -= 1;
            if (this._timeLeft <= 0) {
                this._ballsManager.addFirstBall();
                this._timeLeft = this._matchLength;
                this._matchHasStarted = true;
            }
        }
    }
    _matchLoop() {
        // Movement decision by players
        //console.log("Before update: " + this._humansManager.humans[0].controls.left.pressed)
        this._humansManager.update();
        this._botsManager.update(this._gameLoop, this._ballsManager.balls);
        // Object movement
        this._paddlesManager.update(this._gameLoop);
        this._ballsManager.update(this._gameLoop);
        // Collision handling
        // I do not like this very much... The collision handling is not uniform across all objects
        // Might create a objectsManager instead of a manager for each object,
        // but I would have to make sure that I do not decrease flexibility
        // I should definitely delagate the consequenses to each object though!
        // I can also make a collision handler a singleton and register/unregister objects there?
        this._ballsManager.handleLimitCollision(this._teamsManager, this._paddlesManager);
        this._paddlesManager.handleCollisions(this._ballsManager, this._teamsManager);
        if (this._gameLoop.isEventTime(1)) {
            this._timeLeft -= 1;
        }
        // Game state handling
        if (this._teamsManager.allTeamsFinished()
            || this._timeLeft <= 0) {
            this._gameLoop.pause();
            this._matchResult = this._teamsManager.getTeamsState();
        }
    }
}
