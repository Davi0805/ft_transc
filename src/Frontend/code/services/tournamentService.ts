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
type TTournament = {
    currentRound: number,
    currentPairings: TTournamentMatch[]
    participants: TTournamentParticipant[]
}


class TournamentService {

    startTournamentOUT() {
        this._tournament = {
            currentRound: 0,
            currentPairings: [],
            participants: []
        }
        router.navigateTo("/tournament")
    }

    displayStandingsOUT(participants: TTournamentParticipant[]) {
        this.tournament.participants = participants;
        TournamentPage.renderStandings();
    }

    displayPairingsOUT(pairingsIDs: [number, number][]) {
        const side: SIDES = matchService.getTeamFromPairings(lobbyService.myID, pairingsIDs);
        matchService.addDefaultControls(lobbyService.myID, side);


        this.tournament.currentPairings = pairingsIDs.map(pair => {
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
        this.tournament.currentRound++;
        TournamentPage.renderPairings();
    }

    updateMatchResultOUT(matchIndex: number, winnerID: number) {
        const match = this.tournament.currentPairings[matchIndex];
        console.log("winnerID: ", winnerID)
        console.log("Left ID: ", match.players[0].id);
        const result = match.players[0].id === winnerID ? 1 : 0;
        match.result = result;
        if (!matchService.isMatchActive()) {
            TournamentPage.renderPairings();
        }
    }

    async displayResultsOUT() {
        matchService.destroy();
        await router.navigateTo('/tournament');
        //await matchService.destroy();
        TournamentPage.renderPairings();
    }

    private _tournament: TTournament | null = null
    get tournament() {
        if (!this._tournament) {throw Error("There is not a tournament to return"); }
        return this._tournament;
    }
}

export const tournamentService = new TournamentService()