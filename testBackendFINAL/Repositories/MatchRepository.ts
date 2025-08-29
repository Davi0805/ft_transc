import { matchFactory } from "../factories/matchFactory.js"
import LoopController from "../game/LoopController.js"
import ServerGame, { SGameConfigs } from "../game/ServerGame.js"
import { ROLES, SIDES } from "../game/shared/sharedTypes.js"
import { socketService } from "../services/SocketService.js"

type MatchT = {
    id: number,
    match: ServerGame,
    userIDs: number[],
    broadcastLoop: LoopController
}

export type MatchSettingsT = {
    map: MatchMapT,
    mode: MatchModeT,
    duration: MatchDurationT
}

//This type is only created for match creation purposes.
// It is a unification that allows a match to parse players no matter the type
export type MatchPlayerT = {
    id: number,
    userID: number,
    nickname: string,
    spriteID: number,
    team: SIDES,
    role: ROLES
}

export type MatchMapT = "2-players-small" | "2-players-medium" | "2-players-big" | "4-players-small" | "4-players-medium" | "4-players-big"
    | "2-teams-small" | "2-teams-medium" | "2-teams-big" | "4-teams-small" | "4-teams-medium" | "4-teams-big"
export type MatchModeT = "classic" | "modern"
export type MatchDurationT = "blitz" | "rapid" | "classical" | "long" | "marathon"


class MatchRepository {
    createMatch(matchConfigs: SGameConfigs, users: number[]) {
        const match = matchFactory.create(matchConfigs)

        this._matches.push({
            id: this._currentID,
            match: match,
            userIDs: users,
            broadcastLoop: new LoopController(60)
        });
        return this._currentID++;
    }

    removeMatchByID(matchID: number) {
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

    getMatchInfoByID(matchID: number) {
        const matchInfo = this._matches.find(match => match.id === matchID);
        if (!matchInfo) { return null; };
        return matchInfo;
    }

    getMatchByID(matchID: number): ServerGame | null {
        const match = this._matches.find(match => match.id === matchID);
        if (!match) { return null; };
        return match.match;
    }

    getMatchByUserID(userID: number): ServerGame | null {
        const match = this._matches.find(match => match.userIDs.includes(userID))
        if (!match) { return null }
        return match.match;
    }

    getMatchUsersByID(matchID: number) {
        const match = this._matches.find(match => match.id === matchID);
        if (!match) { return null; };
        return match.userIDs
    }

    getMatchBroadcastLoopByID(matchID: number) {
        const match = this._matches.find(match => match.id === matchID);
        if (!match) { return null };
        return match.broadcastLoop;
    }

    private _currentID: number = 0;

    private _matches: MatchT[] = []
}

export const matchRepository = new MatchRepository()