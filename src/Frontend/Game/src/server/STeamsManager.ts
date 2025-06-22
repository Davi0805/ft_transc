import { SIDES } from "../misc/types";
import STeam from "./STeam.js";

export default class STeamsManager {
    constructor(teamsConfig: { side: SIDES; score: number; }[]) {
        teamsConfig.forEach(team => {
            this._teams.push(new STeam(
                team.side, team.score
            ))
        })
    }

    damageTeam(side: SIDES, damage: number) {
        const team = this._teams.find(team => team.side == side)
        if (team) {
            team.score -= damage;
        }
    }

    teamLost(): SIDES | undefined {
        return (this.teams.find(team => team.score <= 0)?.side)
    }

    getTeamsState(): Record<SIDES, number> {
        const out: Record<SIDES, number> = {} as Record<SIDES, number>;
        this.teams.forEach(team => {
            out[team.side] = team.score;
        })
        return out
    }

    getTeamsDTO() {
        return this._teams.map(team => ({
            side: team.side,
            score: team.score
        }))
    }

    private _teams: STeam[] = []
    get teams(): STeam[] { return this._teams; }
}