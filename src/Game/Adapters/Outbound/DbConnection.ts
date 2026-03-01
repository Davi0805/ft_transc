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

    async getMatchesLeaderboard()
    {
        const result = await db.raw(`SELECT pm.user_id,
                                SUM(CASE WHEN m.first_team_id = pm.team_id THEN 1 ELSE 0 END) AS wins,
                                SUM(CASE WHEN m.first_team_id != pm.team_id THEN 1 ELSE 0 END) AS losses
                                FROM player_matches pm
                                JOIN match m ON m.id = pm.match_id
                                GROUP BY pm.user_id
                                ORDER BY wins DESC, losses ASC
                                LIMIT 10;`);
        return result;
    }

    async getRecentMatches(userID: number) {
        const result = await db.raw(`
            SELECT 
                m.id AS match_id,
                CASE
                    WHEN m.tournament_id IS NOT NULL THEN 'Tournament'
                    ELSE 'Ranked'
                END AS mode,
                CASE
                    WHEN pm.team_id = m.first_team_id THEN 'Won'
                    ELSE 'Lost'
                END AS result,
                m.created_at AS date_time
            FROM 
                match m
            JOIN 
                player_matches pm ON pm.match_id = m.id
            WHERE 
                pm.user_id = ?
            ORDER BY 
                m.created_at DESC
            LIMIT 10;
        `, [userID]);
        return result;
    }

    async getPlayerStats(user_id: number) {
        const result = await db.raw(`
            SELECT 
                SUM(CASE WHEN m.first_team_id = pm.team_id THEN 1 ELSE 0 END) AS wins,
                SUM(CASE WHEN m.first_team_id != pm.team_id THEN 1 ELSE 0 END) AS losses,
                (
                    SELECT COUNT(*)
                    FROM tournament t
                    WHERE t.first_id = pm.team_id
                ) AS tournamentsWon
            FROM 
                player_matches pm
            JOIN 
                match m ON m.id = pm.match_id
            WHERE 
                pm.user_id = ?;
        `, [user_id]);

        return {
            wins: result[0].wins || 0,
            losses: result[0].losses || 0,
            tournamentsWon: result[0].tournamentsWon || 0
        };
    }
}

const dbConnection = new DbConnection();
export default dbConnection;