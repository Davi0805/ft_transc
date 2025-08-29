import { TMatchResult } from "../game/ServerGame.js";
import { ROLES, SIDES } from "../game/shared/sharedTypes.js";
import { LobbyT, LobbyUserT } from "../Repositories/LobbyRepository.js";
import { MatchPlayerT, matchRepository } from "../Repositories/MatchRepository.js";
import { TournamentParticipantT, tournamentRepository } from "../Repositories/TournamentRepository.js";
import { lobbyService } from "./LobbyService.js";
import { matchService } from "./MatchService.js";
import { socketService } from "./SocketService.js";
import { SwissService } from "./SwissService.cjs";

export type TournamentMatchT = [TournamentParticipantT, TournamentParticipantT];

class TournamentService {
    start(lobby: LobbyT, senderID: number) {
        const tournamentParticipants = this._getTournamentParticipants(lobby.users);
        if (tournamentParticipants.length < tournamentRepository.MIN_PARTICIPANTS) {
            socketService.broadcastToUsers([senderID], "actionBlock", { reason: "fewPlayersForTournament" })
            return;
        }
        
        const tournamentID = tournamentRepository.createTournament(lobby.id, lobby.matchSettings, tournamentParticipants);

        socketService.broadcastToLobby(lobby.id, "startTournament", null)
        console.log("Tournament starts!");
        this._displayStandings(tournamentID);
    }

    private _displayStandings(tournamentID: number) {
        const tournament = tournamentRepository.getTournamentByID(tournamentID);
        console.log("displayStandings was just called. Current tournament status:")
        console.log(tournament)

        const standings = SwissService.getCurrentStandings(tournament.participants);
        console.log("Current standings:")
        console.log(standings)
        socketService.broadcastToLobby(tournament.lobbyID, "displayStandings", { standings: standings })
        
        setTimeout(() => {
            const tournamentDone = tournament.currentRound >= tournament.roundAmount
            if (tournamentDone) {
                console.log("tournament is done! Final standings:")
                console.log(standings)
                socketService.broadcastToLobby(tournament.lobbyID, "displayTournamentEnd", { standings: standings})
                setTimeout(() => {
                    console.log("returning to lobby...")
                    tournamentRepository.removeTournamentByID(tournamentID);
                    lobbyService.returnToLobby(tournament.lobbyID);
                }, 10 * 1000)
            } else {
                this._displayPairings(tournamentID)
            }
        }, 10 * 1000)
    }

    private _displayPairings(tournamentID: number) {
        const tournament = tournamentRepository.getTournamentByID(tournamentID);
        tournament.currentRound++
        console.log(`displayPairings of round ${tournament.currentRound} was just called. Current tournament status:`),
        console.log(tournament);
        
        const activePlayers = tournament.participants.filter(participant => participant.participating === true);
        const pairingsIDs = SwissService.getNextRoundPairings(activePlayers);
        const pairings: TournamentMatchT[] = pairingsIDs.map(pair => {
            const player1 = activePlayers.find(user => user.id === pair[0]);
            const player2 = activePlayers.find(user => user.id === pair[1]);
            if (!player1 || !player2) { throw Error("GAVE GIGANTIC SHIT"); }

            player1.prevOpponents.push(player2.id);
            player2.prevOpponents.push(player1.id);
            player1.teamDist++;
            player2.teamDist--;
            return [player1, player2];
        })
        socketService.broadcastToLobby(tournament.lobbyID, "displayPairings", { pairings: pairingsIDs });
        console.log("Pairings IDs:");
        console.log(pairingsIDs);
        console.log("And pairings with full players:");
        console.log(pairings);

        setTimeout(() => {
            tournament.rounds.push({
                roundNo: tournament.currentRound,
                matches: []
            })
            for (let i = 0; i < pairings.length; i++) {
                const matchPlayers = this._getMatchPlayers(pairings[i]);
                const matchID = matchService.createAndStartMatch(tournament.matchSettings, matchPlayers)
                const currentRound = tournament.rounds.find(round => round.roundNo === tournament.currentRound);
                if (!currentRound) { throw Error("The current round was not initialized")}

                currentRound.matches.push({
                    matchID: matchID,
                    playerIDs: pairingsIDs[i],
                    winner: null
                });

                const checkResult = () => {
                    const matchResult = matchService.getMatchResultByID(matchID);
                    if (matchResult) {
                        this._onMatchFinished(tournamentID, matchID, matchResult)
                    } else {
                        setTimeout(checkResult, 1 * 1000)
                    }
                }
                checkResult()
            };

            console.log(`Round ${tournament.currentRound} has started. This is the tournament status now:`)
            console.log(tournament);

            const checkRoundEnd = () => {
                const currentRound = tournament.rounds.find(round => round.roundNo === tournament.currentRound);
                if (!currentRound) { throw Error("The current round was not initialized")}
                const roundMatches = currentRound.matches;

                const allGamesDone = roundMatches.every(match => match.winner !== null);
                if (allGamesDone) {
                    setTimeout(() => {
                        this._displayStandings(tournamentID);
                    }, 10 * 1000);
                } else {
                    setTimeout(checkRoundEnd, 1 * 1000);
                }
            }
            checkRoundEnd()
        }, 10 * 1000)
    }

    private _onMatchFinished(tournamentID: number, matchID: number, result: TMatchResult) {
        console.log(`Match with ID ${matchID} just finished with the following result:`);
        console.log(result);
        const matchUsers = matchRepository.getMatchUsersByID(matchID);
        if (!matchUsers) {throw Error("This match does not exist!")}
        socketService.broadcastToUsers(matchUsers, "endOfMatch", { result: result });
        matchService.destroyMatchByID(matchID);

        const tournament = tournamentRepository.getTournamentByID(tournamentID);

        const currentRound = tournament.rounds.find(round => round.roundNo === tournament.currentRound);
        if (!currentRound) { throw Error("The current round was not initialized")}
        const currentRoundMatches = currentRound.matches
        const matchIndex = currentRoundMatches.findIndex(match => match.matchID === matchID);
        const match = currentRoundMatches[matchIndex];
        if (!match) {throw Error("This match does not exist in the tournament!")}
        
        match.winner = result[SIDES.LEFT] === 1 ? match.playerIDs[0] : match.playerIDs[1]
        const winnerPlayer = tournament.participants.find(participant => participant.id === match.winner)
        if (!winnerPlayer) { throw Error("The winner does not exist in the participants??")}
        winnerPlayer.score++;

        const updateResultDTO = {
            matchIndex: matchIndex,
            winnerID: match.winner
        }
        console.log("This is the result that will be broadcasted to the entire lobby:");
        console.log(updateResultDTO)
        socketService.broadcastToLobby(tournament.lobbyID, "updateTournamentResult", updateResultDTO)

        setTimeout(() => {
            socketService.broadcastToUsers(matchUsers, "displayResults", null);
        }, 5 * 1000)   
    }

    private _getTournamentParticipants(users: LobbyUserT[]) {
        const out: TournamentParticipantT[] = [];
        users.forEach(user => {
            out.push({
                id: user.id,
                nick: user.username,
                spriteID: user.spriteID,
                score: 0,
                rating: user.rating,
                prevOpponents: [],
                teamDist: 0,
                participating: true
            })
        })
        return out;
    }

    private _getMatchPlayers(users: TournamentMatchT) {
        const out: MatchPlayerT[] = [];
        for (let i = 0; i < users.length; i++) {
            out.push({
                userID: users[i].id,
                id: users[i].id,
                nickname: users[i].nick,
                spriteID: users[i].spriteID,
                team: i === 0 ? SIDES.LEFT : SIDES.RIGHT, //TODO: Change to taking team preference into account
                role: ROLES.BACK,
            })
        }
        return out
    }
}

export const tournamentService = new TournamentService()