import STeam from "./STeam.js";
export default class STeamsManager {
    constructor(teamsConfig) {
        teamsConfig.forEach(team => {
            this._teams.push(new STeam(team.side, team.score));
        });
    }
    damageTeam(side, damage) {
        const team = this._teams.find(team => team.side == side);
        if (team && team.place === 0) {
            team.score -= damage;
            if (team.score <= 0) {
                const losers = this.teams.filter(team => team.place !== 0);
                team.place = this.teams.length - losers.length;
                if (team.place === 2) {
                    const winner = this.teams.find(team => team.place === 0);
                    if (!winner) {
                        throw Error("We're fucked");
                    }
                    winner.place = 1;
                }
                return true;
            }
        }
        return false;
    }
    allTeamsFinished() {
        for (const team of this.teams) {
            if (team.place === 0) {
                return false;
            }
        }
        return (true);
    }
    getTeamsState() {
        const out = {};
        this.teams.forEach(team => {
            out[team.side] = team.place;
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
