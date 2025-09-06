class TournamentRepository {
    MIN_PARTICIPANTS = 4;
    MAX_PARTICIPANTS = 100;
    createTournament(lobbyID, matchSettings, participants) {
        this._tournaments.push({
            id: this._currentID,
            lobbyID: lobbyID,
            matchSettings: matchSettings,
            participants: participants,
            rounds: [],
            roundAmount: Math.ceil(Math.log2(participants.length)),
            currentRound: 0
        });
        return this._currentID++;
    }
    removeTournamentByID(tournamentID) {
        this._tournaments = this._tournaments.filter(tournament => tournament.id !== tournamentID);
    }
    getTournamentByID(tournamentID) {
        const tournament = this._tournaments.find(tournament => tournament.id === tournamentID);
        if (!tournament) {
            throw Error("The tournament with this ID was not found!");
        }
        ;
        return tournament;
    }
    _currentID = 0;
    _tournaments = [];
}
export const tournamentRepository = new TournamentRepository();
