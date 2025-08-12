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
        this._matches = this._matches.filter(match => match.id !== matchID)
    }

    getMatchByUserID(userID: number) {
        console.log("A match was requested by userid ", userID);
        console.log("The amount of matches present at this point are: ", this._matches.length)

        const match = this._matches.find(match => match.userIDs.includes(userID))
        if (!match) { throw Error("This user is not present in any match!")}
        return match;
    }

    private _matches: TMatchInRepo[] = []
}

export const matchRepository = new MatchRepository()