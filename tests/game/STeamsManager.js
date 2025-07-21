import STeam from "./STeam.js";
export default class STeamsManager {
    constructor(teamsConfig) {
        teamsConfig.forEach(team => {
            this._teams.push(new STeam(team.side, team.score));
        });
    }
    damageTeam(side, damage) {
        const team = this._teams.find(team => team.side == side);
        if (team) {
            team.score -= damage;
        }
    }
    teamLost() {
        return (this.teams.find(team => team.score <= 0)?.side);
    }
    getTeamsState() {
        const out = {};
        this.teams.forEach(team => {
            out[team.side] = team.score;
        });
        return out;
    }
    getTeamsDTO() {
        return this._teams.map(team => ({
            side: team.side,
            score: team.score
        }));
    }
    _teams = [];
    get teams() { return this._teams; }
}
