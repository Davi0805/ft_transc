import { TMatchResult } from "../game/ServerGame.js";
import { ROLES, SIDES } from "../game/shared/sharedTypes.js";
import { LobbyT, LobbyUserT } from "../Repositories/LobbyRepository.js";
import { MatchPlayerT, matchRepository } from "../Repositories/MatchRepository.js";
import { TournamentParticipantT, tournamentRepository } from "../Repositories/TournamentRepository.js";
import { matchService } from "./MatchService.js";
import { socketService } from "./SocketService.js";
import { SwissService } from "./SwissService.cjs";

type MatchT = [TournamentParticipantT, TournamentParticipantT];

class TournamentService {
    start(lobby: LobbyT) {
        const tournamentParticipants = this._getTournamentParticipants(lobby.users);
        const tournamentID = tournamentRepository.createTournament(lobby.id, lobby.matchSettings, tournamentParticipants);

        this._displayStandings(tournamentID);
    }

    private _displayStandings(tournamentID: number) {
        const tournament = tournamentRepository.getTournamentByID(tournamentID);
        const standings = SwissService.getCurrentStandings(tournament.participants);
        socketService.broadcastToLobby(tournament.lobbyID, "displaySettings", { standings: standings })
        
        setTimeout(() => {
            this._displayPairings(tournamentID)
        }, 10 * 1000)
    }

    private _displayPairings(tournamentID: number) {
        const tournament = tournamentRepository.getTournamentByID(tournamentID);
        const activePlayers = tournament.participants.filter(participant => participant.participating === true)
        const pairingsIDs = SwissService.getNextRoundPairings(activePlayers);
        const pairings: MatchT[] = pairingsIDs.map(pair => {
            const player1 = activePlayers.find(user => user.id === pair[0]);
            const player2 = activePlayers.find(user => user.id === pair[1]);
            if (!player1 || !player2) { throw Error("GAVE GIGANTIC SHIT"); }
            return [player1, player2];
        })
        socketService.broadcastToLobby(tournament.lobbyID, "displayPairings", { pairings: pairings });

        setTimeout(() => {
            tournament.rounds.push({
                roundNo: tournament.currentRound,
                matches: []
            })
            for (let i = 0; i < pairings.length; i++) {
                const matchPlayers = this._getMatchPlayers(pairings[i]);
                const matchID = matchService.createAndStartMatch(tournament.matchSettings, matchPlayers)
                tournament.rounds[tournament.currentRound].matches.push({
                    matchID: matchID,
                    playerIDs: pairingsIDs[i],
                    result: 
                });

                const loop = () => {
                    const matchResult = matchService.getMatchResultByID(matchID);
                    if (matchResult) {
                        this._onMatchFinished(tournamentID, matchID, matchResult)
                    } else {
                        setTimeout(loop, 1 * 1000)
                    }
                }
                loop()
            };

            
        }, 10 * 1000)
    }

    private _onMatchFinished(tournamentID: number, matchID: number, result: TMatchResult) {
        const matchUsers = matchRepository.getMatchUsersByID(matchID);
        socketService.broadcastToUsers(matchUsers, "endOfMatch", { result: result })
        matchService.destroyMatchByID(matchID);

        const tournament = tournamentRepository.getTournamentByID(tournamentID);

        //TODO update the tournament information
        //TODO add the dtos and frontend
        socketService.broadcastToLobby(tournament.lobbyID, "updateTournamentResult", {
            matchID: matchID,
            result: result
        })

        setTimeout(() => {
            this._displayStandings(tournamentID);
        })
        
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

    private _getMatchPlayers(users: MatchT) {
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