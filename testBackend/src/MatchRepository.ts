import ServerGame from "./game/ServerGame.js"
import { CAppConfigs } from "./game/shared/SetupDependencies.js"

export type TMatchInRepo = {
    id: number,
    lobbyID: number,
    clientSettings: CAppConfigs,
    serverGame: ServerGame,
    userIDs: number[]
}

class MatchRepository {

    addMatch(match: TMatchInRepo) {
        this._matches.push(match);
    }

    removeMatchByID(matchID: number) {
        this._matches.filter(match => match.id !== matchID)
    }

    getMatchByUserID(userID: number) {
        const match = this._matches.find(match => match.userIDs.includes(userID))
        if (!match) { throw Error("This user is not present in any match!")}
        return match;
    }

    private _matches: TMatchInRepo[] = []
}

export const matchRepository = new MatchRepository()