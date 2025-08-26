import { SIDES } from "../match/matchSharedDependencies/sharedTypes";
import { TTournamentParticipant } from "../pages/play/lobbyTyping"
import { TournamentPage } from "../pages/play/tournament";
import { lobbyService } from "./LobbyService";
import { matchService } from "./matchService";

/* export type TPairing = {
    board: number,
    players: [number, number],
    result: number | null //points of player1
} */

type TTournamentMatch = {
    players: [TTournamentParticipant, TTournamentParticipant],
    result: number | null //1 won LEFT, 0 otherwise 
}
type TTournament = {
    currentRound: number,
    currentPairings: TTournamentMatch[]
    participants: TTournamentParticipant[]
}


class TournamentService {
    create() {
        this._tournament = {
            currentRound: 0,
            currentPairings: [],
            participants: []
        }
    }

    displayStandings(participants: TTournamentParticipant[]) {
        this.tournament.participants = participants;
        TournamentPage.renderStandings();
    }

    displayPairings(pairingsIDs: [number, number][]) {
        const side: SIDES = matchService.getTeamFromPairings(lobbyService.myID, pairingsIDs);
        matchService.addDefaultControls(lobbyService.myID, side);

        this.tournament.currentPairings = pairingsIDs.map(pair => {
            return {
                players: [
                    this.tournament.participants.find(participant => participant.id === pair[0]),
                    this.tournament.participants.find(participant => participant.id === pair[1])
                ] as [TTournamentParticipant, TTournamentParticipant],
                result: null
            }
        })
        this.tournament.currentRound++;
        TournamentPage.renderPairings();
    }



    //update

    private _tournament: TTournament | null = null
    get tournament() {
        if (!this._tournament) {throw Error("There is not a tournament to return"); }
        return this._tournament;
    }
}

export const tournamentService = new TournamentService()