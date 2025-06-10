import { SGameConfigs, SGameDTO, CGameDTO, point } from "../misc/types.js";
import LoopController from "./LoopController.js";
import SHumansManager from "./SHumansManager.js";
import STeamsManager from "./STeamsManager.js";
import BotsManager from "./BotsManager.js";
import SBallsManager from "./SBallsManager.js";
import SPaddlesManager from "./SPaddlesManager.js";


//TODO: if there is time, or if it starts to be too difficult to manage, there is a different way to organize this:
// Currently, each player (either human or bot) holds a reference to a paddle and manages it, including moving it.
// This is quite counter-intuitive however, because all all managers have an update call except paddle manager, 
// and the paddles were already moved, but paddles still need a manager because of collisions...
// The new idea would be to have the paddles instead hold the players and have its update method to move according to the player's controls.
// This would make all interfaces much more uniform, as all players would have a decision-based interface and objects a movement-based interface
export default class ServerGame {
    constructor(gameOpts: SGameConfigs) {
        this._windowSize = gameOpts.window.size;
        this._ballsManager = new SBallsManager(this._windowSize, gameOpts.gameInitialState.ball);
        this._teamsManager = new STeamsManager(gameOpts.teams)
        this._paddlesManager = new SPaddlesManager(gameOpts.gameInitialState.paddles, this.windowSize);
        this._humansManager = new SHumansManager(gameOpts.humans, this._paddlesManager.paddles);
        this._botsManager = new BotsManager(gameOpts.bots, this._paddlesManager.paddles, this.windowSize)
    }

    startGameLoop() {
        const loop = new LoopController(60);
        loop.start(() => {
            if (loop.isRunning) {
                this._humansManager.update(loop.delta)
                this._botsManager.update(loop, this._ballsManager.balls)
                this._ballsManager.update(loop);

                this._handleCollisions(); //Hp of teams is updated here
                
                if (this._teamsManager.teamLost() !== undefined) {
                    loop.pause();
                    const finalGameState = this._teamsManager.getTeamsState();
                    console.log(finalGameState);
                }
            }
            // The following code is just to control the pause state, to make testing easier.
            // Should be removed later!
            if (this._humansManager.humans[0].controls.pause.pressed) {
                loop.togglePause();
            }
            if (this._humansManager.humans[0].controls.pause.pressed) {
                this._humansManager.humans[0].controls.pause.pressed = false;
            }
        })
        
    }

    getGameDTO(): SGameDTO {
        const out: SGameDTO = {
            balls: this._ballsManager.getBallsDTO(),
            teams: this._teamsManager.getTeamsDTO(),
            paddles: this._paddlesManager.getPaddlesDTO()
        }
        return out
    }

    processClientDTO(dto: CGameDTO) {
        this._humansManager.updateControlState(
            dto.controlsState.humanID,
            dto.controlsState.controlsState
        );
    }

    private _windowSize: point;
    set windowSize(value: point) { this._windowSize = value; }
    get windowSize() { return this._windowSize; }

    private _ballsManager: SBallsManager;
    private _teamsManager: STeamsManager;
    private _humansManager: SHumansManager;
    private _botsManager: BotsManager;
    private _paddlesManager: SPaddlesManager;


    private _handleCollisions() {
        this._ballsManager.handleLimitCollision(this._teamsManager);
        this._paddlesManager.handleCollisions(this._ballsManager);
    }

}