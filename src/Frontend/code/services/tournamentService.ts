import { SIDES } from "../match/matchSharedDependencies/sharedTypes";
import { TTournamentParticipant } from "../pages/play/lobbyTyping"
import { TournamentPage } from "../pages/play/tournament";
import { router } from "../routes/router";
import { lobbyService } from "./LobbyService";
import { matchService } from "./matchService";


type TTournamentMatch = {
    players: [TTournamentParticipant, TTournamentParticipant | null], //null if bye
    result: number | null //Points of player[0] 
}
export type TTournament = {
    currentRound: number,
    currentPairings: TTournamentMatch[]
    participants: TTournamentParticipant[]
}

export type TTournamentDTO = {
    currentRound: number,
    currentPairings: [number, number][]
    participants: TTournamentParticipant[]
}


class TournamentService {

    init(tournament: TTournamentDTO | null = null) {
        if (tournament) {
            this._tournament = {
                currentRound: tournament.currentRound,
                currentPairings: this._getMatchFromPairing(tournament.participants, tournament.currentPairings),
                participants: tournament.participants
            }
        } else {
            this._tournament = {
                currentRound: 0,
                currentPairings: [],
                participants: []
            }
        }
    }

    startTournamentOUT() {
        this.init();
        router.navigateTo("/tournament")
    }

    displayStandingsOUT(participants: TTournamentParticipant[]) {
        this.tournament.participants = participants;
        TournamentPage.renderStandings();
    }

    displayPairingsOUT(pairingsIDs: [number, number][]) {
        const side: SIDES = matchService.getTeamFromPairings(lobbyService.myID, pairingsIDs);
        matchService.addDefaultControls(lobbyService.myID, side);


        this.tournament.currentPairings = this._getMatchFromPairing(this.tournament.participants, pairingsIDs);
        this.tournament.currentRound++;
        TournamentPage.renderPairings();
    }

    updateMatchResultOUT(matchIndex: number, winnerID: number) {
        const match = this.tournament.currentPairings[matchIndex];
        const result = match.players[0].id === winnerID ? 1 : 0;
        match.result = result;
        if (!matchService.isMatchActive()) {
            TournamentPage.renderPairings();
        }
    }

    async displayResultsOUT() {
        matchService.destroy();
        await router.navigateTo('/tournament');
        TournamentPage.renderPairings();
    }

    private _tournament: TTournament | null = null
    get tournament() {
        if (!this._tournament) {throw Error("There is not a tournament to return"); }
        return this._tournament;
    }

    private _getMatchFromPairing(
        participants: TTournamentParticipant[],
        pairingsIDs: [number, number][]
    ): TTournamentMatch[] {
        return pairingsIDs.map(pair => {
            const player1 = this.tournament.participants.find(participant => participant.id === pair[0])
            const player2 = pair[1] !== -1
                ? this.tournament.participants.find(participant => participant.id === pair[1])
                : null;
            if (player1 === undefined || player2 === undefined) { throw Error("PlayerID was not found in players!")}

            return {
                players: [ player1, player2 ] as [TTournamentParticipant, TTournamentParticipant | null],
                result: player2 === null ? 1 : null //Give victory immediately if player has bye
            }
        })
    }
}

export const tournamentService = new TournamentService()