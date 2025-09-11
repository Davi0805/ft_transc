import LoopController from "../../Application/game/LoopController.js";
import ServerGame, { TMatchResult } from "../../Application/game/ServerGame.js";

type MatchT = {
    id: number,
    match: ServerGame,
    userIDs: number[],
    broadcastLoop: LoopController
}

class MatchRepository {
    add(match: MatchT) {
        this._matches.push(match);
    }

    saveMatchInDB(matchID: number, result: TMatchResult, tournamentID: number | null = null) {
        //TODO
        const stuffToSave = {
            first_team_id: result.at(0),
            second_team_id: result.at(1),
            third_team_id: result.at(2),
            fourth_team_id: result.at(3),
            tournament_id: tournamentID
        }
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

    private _currentID: number = 0;

    private _matches: MatchT[] = []
}

const matchRepository = new MatchRepository()
export default matchRepository