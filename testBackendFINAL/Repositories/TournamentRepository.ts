import { MatchSettingsT } from "./MatchRepository.js"

export type TournamentParticipantT = {
    id: number,
    nick: string,
    spriteID: number,
    score: number,
    rating: number,
    prevOpponents: number[],
    teamDist: number,
    participating: boolean
}

type TournamentT = {
    id: number,
    lobbyID: number,
    matchSettings: MatchSettingsT,
    participants: TournamentParticipantT[]
    rounds: {
        roundNo: number,
        matches: {
            matchID: number,
            playerIDs: [number, number],
            result: number
        }[]
    }[],
    currentRound: number
}

class TournamentRepository {
    createTournament(lobbyID: number, matchSettings: MatchSettingsT, participants: TournamentParticipantT[]) {
        this._tournaments.push({
            id: this._currentID,
            lobbyID: lobbyID,
            matchSettings: matchSettings,
            participants: participants,
            rounds: [],
            currentRound: 0
        })

        return this._currentID++
    }

    getTournamentByID(tournamentID: number) {
        const tournament = this._tournaments.find(tournament => tournament.id === tournamentID);
        if (!tournament) { throw Error("The tournament with this ID was not found!") };
        return tournament;
    }

    private _currentID: number = 0;
    private _tournaments: TournamentT[] = [];
}

export const tournamentRepository = new TournamentRepository()