import { TUserCustoms } from "../match/matchSharedDependencies/SetupDependencies";
import { CAppConfigs, buildCAppConfigs } from "../match/setup";
import { applyDevCustoms } from "../match/matchSharedDependencies/SetupDependencies";
import { lobbySocketService } from "./lobbySocketService";
import { getSelfData } from "../api/getSelfDataAPI";
import { App } from "../match/system/App";

class MatchService {
    async injectConfigs(userCustoms: TUserCustoms) {
        const gameConfigs = applyDevCustoms(userCustoms);
        const userID = (await getSelfData()).id;
        if (!lobbySocketService.ws) {
            throw Error("If the websocket is closed at this point, something is truly wrong lol")
        }

        this._configs = buildCAppConfigs(gameConfigs, userID, /*lobbySocketService.ws*/new WebSocket("invalid"));
    }

    async init() {
        console.log(this._configs)
        if (!this._configs) { throw Error("CALL THIS API BY THE RIGHT ORDER, YOU IDIOT") }
        const matchRoot = document.getElementById("match-root");
        if (!matchRoot) { throw Error("couldn't find the root element of the match") }
        await App.init(this._configs, matchRoot);
    }

    private _configs: CAppConfigs | null = null;
}

export const matchService = new MatchService()