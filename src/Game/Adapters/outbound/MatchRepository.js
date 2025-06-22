const db = require('../../Infrastructure/config/Sqlite');

class MatchRepository {

    async saveMatch(match)
    {
        return db('match').insert(match);
    }

    async savePlayers(players)
    {
        return db('player_matches').insert(players);
    }

    async getById(match_id) 
    {
        return db.raw('SELECT m.id AS match_id, '
            + 'm.score_team_1, m.score_team_2, '
            + 'm.score_team_3, m.score_team_4, '
            + 'm.tournament_id, m.created_at, '
            + 'pm.team_id, pm.user_id '
            + 'FROM match m '
            + 'JOIN player_matches pm ON m.id = pm.match_id '
            + 'WHERE m.id = ?', [match_id]);
    }

    async getAll()
    {
        return db.raw('SELECT m.id AS match_id, '
            + 'm.score_team_1, m.score_team_2, '
            + 'm.score_team_3, m.score_team_4, '
            + 'm.tournament_id, m.created_at, '
            + 'pm.team_id, pm.user_id '
            + 'FROM match m '
            + 'JOIN player_matches pm ON m.id = pm.match_id');
    }
}

module.exports = new MatchRepository();