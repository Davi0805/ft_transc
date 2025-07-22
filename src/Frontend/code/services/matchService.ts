import { CAppConfigs } from "../match/matchSharedDependencies/SetupDependencies";
import { App } from "../match/system/App";
//import { lobbySocketService } from "./lobbySocketService";
import { lobbySocketService } from "../testServices/testLobySocketService";

class MatchService {
    init(configs: CAppConfigs) {
        this._configs = configs;
    }

    async start(root: HTMLElement) {
        await App.init(this.configs, root, lobbySocketService.ws);
    } 

    private _configs: CAppConfigs | null = null;
    get configs(): CAppConfigs {
        if (!this._configs) { throw Error("Configs were accessed but were not initialized!"); }
        return this._configs;
    }
}

export const matchService = new MatchService()