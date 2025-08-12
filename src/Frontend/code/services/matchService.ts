import { CAppConfigs, TControls } from "../match/matchSharedDependencies/SetupDependencies";
import { SIDES } from "../match/matchSharedDependencies/sharedTypes";
import { App } from "../match/system/App";
//import { lobbySocketService } from "./lobbySocketService";
import { lobbySocketService } from "../testServices/testLobySocketService";


class MatchService {

    init(configs: CAppConfigs) {
        configs.gameSceneConfigs.controls = this._controls;
        this._configs = configs;
    }

    addControls(id: number, controls: TControls) {
        this._controls.push({
            humanID: id,
            controls: controls
        })
    }
    updateLatestControlsID(id: number) { //This design is complete and utter shit
        if (this._controls.length !== 0) {
            this._controls[this._controls.length - 1].humanID = id;
        }
    }

    addDefaultControls(id: number, team: SIDES) {
        const directions = this.getDirectionsFromTeam(team)
        this.addControls(id, {left: "Arrow" + directions.left, right: "Arrow" + directions.right})
    }
    removeControls(id: number) {
        this._controls = this._controls.filter(player => player.humanID !== id)
    }

    getDirectionsFromTeam(team: SIDES): {left: string, right: string} {
        const teamToDirections: Record<SIDES, {left: string, right: string}> = {
            [SIDES.LEFT]: {left: "Up", right: "Down"},
            [SIDES.TOP]: {left: "Right", right: "Left"},
            [SIDES.RIGHT]: {left: "Down", right: "Up"},
            [SIDES.BOTTOM]: {left: "Left", right: "Right"}
        }
        return (teamToDirections[team])
    }

    getTeamFromPairings(playerID: number, tournPairings: [number, number][]): SIDES {
        for (let i =0; i < tournPairings.length; i++) {
            if (tournPairings[i][0] === playerID) {
                return SIDES.LEFT
            } else if (tournPairings[i][1] === playerID) {
                return SIDES.RIGHT
            }
        }
        throw Error("PlayerID not found in pairings!")
    }

    async start(root: HTMLElement) {
        await App.init(this.configs, root, lobbySocketService.ws);
    }

    destroy() {
        App.destroy()
        this._controls = []
    }

    private _configs: CAppConfigs | null = null;
    get configs(): CAppConfigs {
        if (!this._configs) { throw Error("Configs were accessed but were not initialized!"); }
        return this._configs;
    }

    private _controls: {
        humanID: number,
        controls: TControls
    }[] = []
}

export const matchService = new MatchService()