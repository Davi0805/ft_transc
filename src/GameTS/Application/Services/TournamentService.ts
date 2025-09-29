import dbConnection from "../../Adapters/Outbound/DbConnection.js";
import { tournamentRepository } from "../../Adapters/Outbound/TournamentRepository.js";
import { LobbyT, LobbyUserT } from "../Factories/LobbyFactory.js";
import { MatchPlayerT } from "../Factories/MatchFactory.js";
import tournamentFactory, { ClientTournamentT, TournamentParticipantT } from "../Factories/TournamentFactory.js";
import { TMatchResult } from "../game/ServerGame.js";
import { ROLES, SIDES } from "../game/shared/sharedTypes.js";
import lobbyService from "./LobbyService.js";
import matchService from "./MatchService.js";
import socketService from "./SocketService.js";
import { Pairing, SwissService } from "./SwissService.cjs";


export type TournamentMatchT = [TournamentParticipantT, TournamentParticipantT];

const STANDINGS_DISPLAY_DURATION = 5 * 1000
const FINAL_STANDINGS_DISPLAY_DURATION = 5 * 1000
const PAIRINGS_DISPLAY_DURATION = 5 * 1000
const END_OF_GAME_DISPLAY_DURATION = 3 * 1000
const RESULTS_DISPLAY_DURATION = 5 * 1000
const RESULT_POLLING_FREQUENCY = 1000

//The Service responsible for the tournament cycle
//Note: the tournament is always passed by ID and fetched at each step, just to make sure that the most updated version of it is used
class TournamentService {
    getCurrentInfoByLobbyID(lobbyID: number): ClientTournamentT | null {
        const tournament = tournamentRepository.getByLobbyID(lobbyID);
        if (!tournament) {return null;}
        
        let pairings: [number, number][] = [];
        const currentRound = tournament.rounds.find(round => round.roundNo === tournament.currentRound);
        //Only send the pairings if there are matches still to finish, otherwise it is not necessary
        if (currentRound && currentRound.matches.some(match => match.winnerID === null)) {
            pairings = currentRound.matches.map(pair => pair.playerIDs);
        }

        return {
            currentRound: tournament.currentRound,
            currentPairings: pairings ,
            participants: tournament.participants
        }
    }

    quitPlayerFromTournamentOfLobby(lobbyID: number, playerID: number) {
        console.log(`Player with ID ${playerID} quit`)
        const tournament = tournamentRepository.getByLobbyID(lobbyID);
        if (!tournament) {
            console.log("There is no tournament going on at this lobby! ignoring");
            return;
        }
        const quitter = tournament.participants.find(player => player.id === playerID);
        if (quitter) {
            quitter.participating = false;
        }
    }

    start(lobby: LobbyT, senderID: number) {
        const tournamentParticipants = this._getTournamentParticipants(lobby.users);
        if (tournamentParticipants.length < this.MIN_PARTICIPANTS) {
            socketService.broadcastToUsers([senderID], "actionBlock", { reason: "fewPlayersForTournament" })
            return;
        }
        
        const tournament = tournamentFactory.create(lobby.id, lobby.matchSettings, tournamentParticipants);
        tournamentRepository.add(tournament);

        socketService.broadcastToLobby(lobby.id, "startTournament", null)
        console.log("Tournament starts!");
        this._displayStandings(tournament.id);
    }

    readonly MIN_PARTICIPANTS: number = 4;
    readonly MAX_PARTICIPANTS: number = 100;

    private _displayStandings(tournamentID: number) {
        const tournament = tournamentRepository.getByID(tournamentID);

        const standings = SwissService.getCurrentStandings(tournament.participants);
        socketService.broadcastToLobby(tournament.lobbyID, "displayStandings", { standings: standings })
        
        //TODO: Add chat warning that pairings will be done. If users are not present in 10 seconds, they are kicked out of tournament
        const playersToBeNotified = tournament.participants.filter(participant => participant.participating === true);

        setTimeout(() => {
            this._updateActivePlayers(tournament.participants);
            const activePlayers = tournament.participants.filter(participant => participant.participating === true);
            const tournamentDone = tournament.currentRound >= this._calculateRoundAmount(activePlayers.length)
            if (tournamentDone) {
                this._onTournamentFinished(tournamentID, standings);
            } else {
                this._displayPairings(tournamentID)
            }
        }, STANDINGS_DISPLAY_DURATION)
    }

    private _displayPairings(tournamentID: number) {
        const tournament = tournamentRepository.getByID(tournamentID);
        tournament.currentRound++
        
        const activePlayers = tournament.participants.filter(participant => participant.participating === true);
        const pairingsIDs = SwissService.getNextRoundPairings(activePlayers);
        socketService.broadcastToLobby(tournament.lobbyID, "displayPairings", { pairings: pairingsIDs });

        setTimeout(() => {
            this._startRound(tournamentID, pairingsIDs);
        }, PAIRINGS_DISPLAY_DURATION)
    }

    private _startRound(tournamentID: number, pairingsIDs: Pairing[]) {
        const tournament = tournamentRepository.getByID(tournamentID);
        const pairings = this._updateAndGetPlayerPairingsFromIDs(tournament.participants, pairingsIDs)
        tournament.rounds.push({
            roundNo: tournament.currentRound,
            matches: []
        })

        const byePairing = pairingsIDs.find(pair => pair.includes(-1));
        if (byePairing) {
            this._displayResults(tournamentID, [byePairing[0]], pairingsIDs.length === 1);
        }

        //Start all matches
        for (let i = 0; i < pairings.length; i++) {
            const matchPlayers = this._getMatchPlayers(pairings[i]);
            const matchID = matchService.createAndStartMatch(tournament.lobbyID, tournament.matchSettings, matchPlayers)
            const currentRound = tournament.rounds.find(round => round.roundNo === tournament.currentRound);
            if (!currentRound) { throw Error("The current round was not initialized")}

            currentRound.matches.push({
                matchID: matchID,
                playerIDs: pairingsIDs[i],
                winnerID: null
            });

            //poll result
            const checkResult = () => {
                const matchResult = matchService.getMatchResultByID(matchID);
                if (matchResult) {
                    this._onMatchFinished(tournamentID, matchID, matchResult, matchPlayers)
                } else {
                    setTimeout(checkResult, RESULT_POLLING_FREQUENCY)
                }
            }
            checkResult()
        };
    }

    private _onMatchFinished(tournamentID: number, matchID: number, result: TMatchResult, players: MatchPlayerT[]) {
        const matchUsers = matchService.getMatchUsersByID(matchID);
        if (!matchUsers) {throw Error("This match does not exist!")}
        socketService.broadcastToUsers(matchUsers, "updateGame", {
            type: "GameResult",
            data: result
        });
        matchService.updatePlayersRating(players, result);
        matchService.destroyMatchByID(matchID);

        //Get reference to match saved in tournament
        const tournament = tournamentRepository.getByID(tournamentID);
        const currentRound = tournament.rounds.find(round => round.roundNo === tournament.currentRound);
        if (!currentRound) { throw Error("The current round was not initialized")}
        const currentRoundMatches = currentRound.matches
        const matchIndex = currentRoundMatches.findIndex(match => match.matchID === matchID);
        const match = currentRoundMatches[matchIndex];
        if (!match) {throw Error("This match does not exist in the tournament!")}
        
        //Update result of match
        const playerLeft = tournament.participants.find(participant => participant.id === match.playerIDs[0]);
        const playerRight = tournament.participants.find(participant => participant.id === match.playerIDs[1]);
        if (!playerLeft || !playerRight) {throw Error("Players in match do not exist in participants!")}
        const winnerPlayer = result[0] === SIDES.LEFT ? playerLeft : playerRight;

        match.winnerID = winnerPlayer.id
        winnerPlayer.score++;


        const updateResultDTO = {
            matchIndex: matchIndex,
            winnerID: match.winnerID
        }
        socketService.broadcastToLobby(tournament.lobbyID, "updateTournamentResult", updateResultDTO)

        //Note: It is awkward to create this variable now when it will only be used after the timeout, but it is necessary.
        // This makes sure that the results are up to date. If this was only done inside the setTimeout below and a two matches end within a END_OF_GAME_DISPLAY_DURATION window,
        // both of them would consider themselves to be the last and they would both call "displayStandings", which would be disasterous
        const allGamesDone = currentRoundMatches.every(match => match.winnerID !== null);

        setTimeout(() => {
            this._displayResults(tournamentID, matchUsers, allGamesDone);
        }, END_OF_GAME_DISPLAY_DURATION) 
    }

    private _displayResults(tournamentID: number, matchUsers: number[], allGamesDone: boolean) {
        socketService.broadcastToUsers(matchUsers, "displayResults", null);
        if (allGamesDone) {
            //Only runs the following if this game is the last one
            setTimeout(() => {
                this._displayStandings(tournamentID);
            }, RESULTS_DISPLAY_DURATION);
        }
    }

    private async _onTournamentFinished(tournamentID: number, standings: TournamentParticipantT[]) {
        const tournament = tournamentRepository.getByID(tournamentID);
        const firstPlace = standings.at(0);
        const secondPlace = standings.at(1);
        const thirdPlace = standings.at(2);
        if (!firstPlace || !secondPlace || !thirdPlace) {
            throw Error("The tournament was supposed to have at least 4 players!!!")
        }
        const dbTournamentID = await dbConnection.saveTournament([firstPlace.id, secondPlace.id, thirdPlace.id]);
        tournament.rounds.forEach(round => {
            round.matches.forEach(async match => {
                const winnerTeam = match.winnerID === match.playerIDs[0] ? SIDES.LEFT : SIDES.RIGHT;
                const dbMatchID = await dbConnection.saveMatch([winnerTeam, winnerTeam === SIDES.LEFT ? SIDES.RIGHT : SIDES.LEFT], tournamentID);
                dbConnection.savePlayerMatch(match.playerIDs[0], SIDES.LEFT, dbMatchID);
                dbConnection.savePlayerMatch(match.playerIDs[1], SIDES.RIGHT, dbMatchID);
            })
        })

        socketService.broadcastToLobby(tournament.lobbyID, "displayTournamentEnd", { standings: standings})
        setTimeout(() => {

            console.log("returning to lobby...")
            tournamentRepository.removeByID(tournamentID);
            lobbyService.returnToLobby(tournament.lobbyID);
        }, FINAL_STANDINGS_DISPLAY_DURATION)
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
                team: i === 0 ? SIDES.LEFT : SIDES.RIGHT,
                role: ROLES.BACK,
            })
        }
        return out
    }

    private _updateAndGetPlayerPairingsFromIDs(players: TournamentParticipantT[], pairingsIDs: Pairing[]): TournamentMatchT[] {
        const byePairings = pairingsIDs.filter(pairing => pairing.includes(-1));
        byePairings.forEach(pair => {
            const player = players.find(user => user.id === pair[0]);
            if (!player) { throw Error("The playerID in the pairing does not exist in the player list"); }
            player.score++;
            player.prevOpponents.push(-1);
        })
        
        return pairingsIDs.filter(pair => pair[1] !== -1).map(pair => {
            const player1 = players.find(user => user.id === pair[0]);
            const player2 = players.find(user => user.id === pair[1]);
            if (!player1 || !player2) { throw Error("The playerID in the pairing does not exist in the player list"); }

            player1.prevOpponents.push(player2.id);
            player2.prevOpponents.push(player1.id);
            player1.teamDist++;
            player2.teamDist--;
            return [player1, player2];
        })
    }

    private _calculateRoundAmount(playersAmount: number) {
        return Math.ceil(Math.log2(playersAmount))
    }

    private _updateActivePlayers(players: TournamentParticipantT[]) {
        players.forEach(player => {
            player.participating = player.participating && socketService.isUserConnected(player.id);
        })
        
    }
}

const tournamentService = new TournamentService();
export default tournamentService