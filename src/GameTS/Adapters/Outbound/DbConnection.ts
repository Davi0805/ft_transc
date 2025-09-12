import { TMatchResult } from "../../Application/game/ServerGame.js";
import { SIDES } from "../../Application/game/shared/sharedTypes.js";
import db from "../../Infrastructure/config/Sqlite.js";

class DbConnection {
    async saveMatch(result: TMatchResult, tournamentID: number | null = null) {
        if (result.at(0) === undefined || result.at(1) === undefined) {
            throw Error("Result is not formatted correctly")
        }
        const matchInDB = {
            first_team_id: result.at(0),
            second_team_id: result.at(1),
            third_team_id: result.at(2) ?? null,
            fourth_team_id: result.at(3) ?? null,
            tournament_id: tournamentID
        }
        const [dbID] = await db('match').insert(matchInDB);
        return dbID;
    }

    async savePlayerMatch(userID: number, userTeam: SIDES, matchID: number) {
        const playerMatchInDB = {
            team_id: userTeam,
            user_id: userID,
            match_id: matchID
        }

        const [dbID] = await db('player_matches').insert(playerMatchInDB);
        return dbID
    }

    async saveTournament(podium: [number, number, number]) {
        const tournamentInDB = {
            first_id: podium[0],
            second_id: podium[1],
            third_id: podium[2]
        }

        const [dbID] = await db('tournament').insert(tournamentInDB);
        return dbID;
    }

}

const dbConnection = new DbConnection();
export default dbConnection;