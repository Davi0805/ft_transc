const matchRepo = require('../../Adapters/outbound/MatchRepository');

class MatchService {
    async getAll()
    {
        const rawData = await matchRepo.getAll();
        if (!rawData || rawData.length === 0) { throw 404; }
        const matchesMap = rawData.reduce((acc, row) => {
            if (!acc[row.match_id]) {
              acc[row.match_id] = {
                match_id: row.match_id,
                score_team_1: row.score_team_1,
                score_team_2: row.score_team_2,
                score_team_3: row.score_team_3,
                score_team_4: row.score_team_4,
                tournament_id: row.tournament_id,
                created_at: row.created_at,
                players: []
              };
            }
            acc[row.match_id].players.push({
              team_id: row.team_id,
              user_id: row.user_id
            });
            return acc;
          }, {});
        
          return Object.values(matchesMap);
    }

    async getById(match_id)
    {
        const rawData = await matchRepo.getById(match_id);
        if (!rawData || rawData.length === 0) { throw 404; }
        const matchData = {
            match_id: rawData[0].match_id,
            score_team_1: rawData[0].score_team_1,
            score_team_2: rawData[0].score_team_2,
            score_team_3: rawData[0].score_team_3,
            score_team_4: rawData[0].score_team_4,
            tournament_id: rawData[0].tournament_id,
            created_at: rawData[0].created_at,
            players: rawData.map(raw => ({
              team_id: raw.team_id,
              user_id: raw.user_id
            }))
          };
          return matchData;
    }
    /* 
    *   Method to save only match data before save the players data 
    */
    async saveMatch(match)
    {
        return matchRepo.saveMatch(match);
    }

    async savePlayers(players)
    {
        return matchRepo.savePlayers(players);
    }

    // it receives match and players data at same time
    async saveAllMatchData(data)
    {
        try {
          await matchRepo.saveMatch(data.match);
          await matchRepo.savePlayers(data.players);
        } catch (error) {
            console.log(error);
            throw 400;
        }
    }
}

module.exports = new MatchService();