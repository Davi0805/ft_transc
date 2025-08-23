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

        const loop = new LoopController(60);
        loop.start(() => {
            if (!loop.isRunning) return;
            const dto = match.getGameDTO()
            socketService.broadcastToUsers(users, "updateGame", dto);
        })
        this._matches.push({
            id: this._currentID,
            match: match,
            userIDs: users,
            broadcastLoop: loop
        });
        return this._currentID++;
    }

    getMatchByID(matchID: number): ServerGame {
        const match = this._matches.find(match => match.id === matchID);
        if (!match) { throw Error("Match with this ID does not exist!") };
        return match.match;
    }

    getMatchByUserID(userID: number): ServerGame {
        const match = this._matches.find(match => match.userIDs.includes(userID))
        if (!match) { throw Error("This user is not present in any match!")}
        return match.match;
    }

    getMatchBroadcastLoopByID(matchID: number) {
        const match = this._matches.find(match => match.id === matchID);
        if (!match) { throw Error("Match with this ID does not exist!") };
        return match.broadcastLoop;
    }

    removeMatchByID(matchID: number) {
        const matchIndex = this._matches.findIndex(match => match.id === matchID);
        if (matchIndex === -1) { throw new Error("Match with this ID does not exist!"); }
        
        this._matches[matchIndex].broadcastLoop.stop();
        this._matches.splice(matchIndex, 1);
    }

    private _currentID: number = 0;


    private _matches: MatchT[] = []
}

export const matchRepository = new MatchRepository()