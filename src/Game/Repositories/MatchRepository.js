import { matchFactory } from "../factories/matchFactory.js";
import LoopController from "../game/LoopController.js";
class MatchRepository {
    createMatch(matchConfigs, users) {
        const match = matchFactory.create(matchConfigs);
        this._matches.push({
            id: this._currentID,
            match: match,
            userIDs: users,
            broadcastLoop: new LoopController(60)
        });
        return this._currentID++;
    }
    removeMatchByID(matchID) {
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
    getMatchInfoByID(matchID) {
        const matchInfo = this._matches.find(match => match.id === matchID);
        if (!matchInfo) {
            return null;
        }
        ;
        return matchInfo;
    }
    getMatchByID(matchID) {
        const match = this._matches.find(match => match.id === matchID);
        if (!match) {
            return null;
        }
        ;
        return match.match;
    }
    getMatchByUserID(userID) {
        const match = this._matches.find(match => match.userIDs.includes(userID));
        if (!match) {
            return null;
        }
        return match.match;
    }
    getMatchUsersByID(matchID) {
        const match = this._matches.find(match => match.id === matchID);
        if (!match) {
            return null;
        }
        ;
        return match.userIDs;
    }
    getMatchBroadcastLoopByID(matchID) {
        const match = this._matches.find(match => match.id === matchID);
        if (!match) {
            return null;
        }
        ;
        return match.broadcastLoop;
    }
    _currentID = 0;
    _matches = [];
}
export const matchRepository = new MatchRepository();
