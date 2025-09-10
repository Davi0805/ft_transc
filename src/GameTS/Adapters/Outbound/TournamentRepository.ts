import { TournamentT } from "../../Application/Factories/TournamentFactory.js";

class TournamentRepository {
    add(tournament: TournamentT) {
        this._tournaments.push(tournament);
    }

    removeByID(tournamentID: number) {
        this._tournaments = this._tournaments.filter(tournament => tournament.id !== tournamentID)
    }

    getByID(tournamentID: number) {
        const tournament = this._tournaments.find(tournament => tournament.id === tournamentID);
        if (!tournament) { throw Error("The tournament with this ID was not found!") };
        return tournament;
    }

    private _currentID: number = 0;
    private _tournaments: TournamentT[] = [];
}

export const tournamentRepository = new TournamentRepository()