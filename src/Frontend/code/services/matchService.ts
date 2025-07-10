import { CAppConfigs, TUserCustoms } from "../../../../TempIsolatedMatchLogic/src/misc/types";
import { applyDevCustoms } from "../../../../TempIsolatedMatchLogic/src/misc/gameOptions";
import { lobbySocketService } from "./lobbySocketService";
import { getSelfData } from "../api/getSelfDataAPI";
import { buildCAppConfigs } from "../../../../TempIsolatedMatchLogic/src/misc/buildGameOptions";
import { App } from "../../../../TempIsolatedMatchLogic/src/client/scripts/system/App"

class MatchService {
    async injectConfigs(userCustoms: TUserCustoms) {
        const gameConfigs = applyDevCustoms(userCustoms);
        const userID = (await getSelfData()).id;
        if (!lobbySocketService.ws) {
            throw Error("If the websocket is closed at this point, something is truly wrong lol")
        }

        this._configs = buildCAppConfigs(gameConfigs, userID, lobbySocketService.ws);
    }

    async init() {
        if (!this._configs) { throw Error("CALL THIS API BY THE RIGHT ORDER, YOU IDIOT") }
        const matchRoot = document.getElementById("match-root");
        if (!matchRoot) { throw Error("couldn't find the root element of the match") }
        await App.init(this._configs, matchRoot);
    }

    private _configs: CAppConfigs | null = null;
}

export const matchService = new MatchService()