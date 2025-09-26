import type { CAppConfigs } from "../../Application/game/shared/SetupDependencies.js";

import LoopController from "../../Application/game/LoopController.js";
import ServerGame from "../../Application/game/ServerGame.js";


type MatchT = {
    id: number,
    lobbyID: number,
    clientConfigs: CAppConfigs
    match: ServerGame,
    userIDs: number[],
    broadcastLoop: LoopController
}

class MatchRepository {
    add(match: MatchT) {
        this._matches.push(match);
    }

    removeByID(matchID: number) {
        const matchIndex = this._matches.findIndex(match => match.id === matchID);
        if (matchIndex === -1) {
            console.log("Match already does not exist. Ignoring");
            return;
        }
        const match = this._matches[matchIndex];
        match.broadcastLoop.stop();
        match.match.stopGameLoop();
        this._matches.splice(matchIndex, 1);
    }

    removeAll() {
        this._matches.forEach(match => {
            match.broadcastLoop.stop();
            match.match.stopGameLoop();
        })
        this._matches = []
    }

    getInfoByID(matchID: number) {
        const matchInfo = this._matches.find(match => match.id === matchID);
        if (!matchInfo) { return null; };
        return matchInfo;
    }

    getInfoByUserID(userID: number) {
        const match = this._matches.find(match => match.userIDs.includes(userID))
        if (!match) { return null }
        return match;
    }

    getInfosByLobbyID(lobbyID: number) {
        const matchInfo = this._matches.filter(match => match.lobbyID === lobbyID);
        if (!matchInfo) { return null };
        return matchInfo;
    }

    private _matches: MatchT[] = []
}

const matchRepository = new MatchRepository()
export default matchRepository