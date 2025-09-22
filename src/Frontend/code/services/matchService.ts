import { SGameDTO } from "../match/matchSharedDependencies/dtos";
import { CAppConfigs, TControls } from "../match/matchSharedDependencies/SetupDependencies";
import { SIDES } from "../match/matchSharedDependencies/sharedTypes";
import { App } from "../match/system/App";
import { TMatchResult } from "../pages/play/lobbyTyping";
import { MatchPage } from "../pages/play/match";
import { getDirectionsFromTeam } from "../pages/play/utils/helpers";
import { router } from "../routes/router";
import { lobbySocketService } from "./lobbySocketService";


class MatchService {
    async startMatchOUT(configs: CAppConfigs) {
        const noControlsMsg = "No controls are saved! Game is starting, but you wont be able to control it";
        
        const storedControls = localStorage.getItem("controls");
        const parsedControls = storedControls ? JSON.parse(storedControls) : null;
        if (parsedControls && parsedControls.matchID === configs.matchID) {
            configs.gameSceneConfigs.controls = parsedControls.controls;
        } else if (this._controls.length !== 0) {
            localStorage.setItem("controls", JSON.stringify({
                matchID: configs.matchID,
                controls: this._controls
            }));
            configs.gameSceneConfigs.controls = this._controls;
        } else {
            console.log(noControlsMsg);
        }
        this._configs = configs;
        await router.navigateTo("/match");
        await this.start(MatchPage.getRoot());
    }

    updateGame(updateDto: SGameDTO) {
        App.severUpdate(updateDto);
    }

    async onEndOfMatch(result: TMatchResult) {
        //TODO render the end page. Still in App?
        App.unsetSendToServerFunc();
    }

    

    addControls(id: number, controls: TControls) {
        this._controls.push({
            humanID: id,
            controls: controls
        })
    }
    addDefaultControls(id: number, team: SIDES) {
        const directions = getDirectionsFromTeam(team)
        this.addControls(id, {left: "Arrow" + directions.left, right: "Arrow" + directions.right})
    }
    saveTempControls(controls: TControls) {
        this._tempControls = controls;
    }
    updateLatestControlsID(id: number) {
        if (!this._tempControls) {
            return;
        }
        this.addControls(id, this._tempControls);
        this._tempControls = null;
    }
    removeControls(id: number) {
        this._controls = this._controls.filter(player => player.humanID !== id)
    }
    resetAllControls() {
        this._controls = [];

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
        const sendToServerFunc = (event: Event) => {
            const dto = (event as CustomEvent).detail;
            lobbySocketService.send("updateGame", dto);
        }
        await App.init(this.configs, sendToServerFunc, root);
    }

    async destroy() {
        await App.destroy()
        this._controls = []
    }

    isMatchActive() {
        return App.isAppActive()
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

    private _tempControls: TControls | null = null;
}

export const matchService = new MatchService()