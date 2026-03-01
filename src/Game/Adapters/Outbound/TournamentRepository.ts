import { TournamentT } from "../../Application/Factories/TournamentFactory.js";

class TournamentRepository {
    add(tournament: TournamentT) {
        this._tournaments.push(tournament);
    }

    removeByID(tournamentID: number) {
        this._tournaments = this._tournaments.filter(tournament => tournament.id !== tournamentID)
    }

    removeAll() {
        this._tournaments = [];
    }

    getByID(tournamentID: number) {
        const tournament = this._tournaments.find(tournament => tournament.id === tournamentID);
        if (!tournament) { throw Error("The tournament with this ID was not found!") };
        return tournament;
    }

    getByLobbyID(lobbyID: number) {
        const tournament = this._tournaments.find(tournament => tournament.lobbyID === lobbyID);
        if (!tournament) {return null}
        return tournament
    }

    private _tournaments: TournamentT[] = [];
}

export const tournamentRepository = new TournamentRepository()