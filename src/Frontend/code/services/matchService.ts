import { CAppConfigs, TControls } from "../match/matchSharedDependencies/SetupDependencies";
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
    removeControls(id: number) {
        this._controls = this._controls.filter(player => player.humanID !== id)
    }

    async start(root: HTMLElement) {
        console.log("Match about to start!")
        console.log(this.configs)
        await App.init(this.configs, root, lobbySocketService.ws);
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