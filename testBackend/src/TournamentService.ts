import { TLobby, TLobbyUser, TMatchPlayer, TMatchResult, TTournamentParticipant, TTournamentPlayer } from "./dependencies/lobbyTyping.js";
import { ROLES, SIDES } from "./game/shared/sharedTypes.js";
import { matchService } from "./MatchService.js";
import { socketService } from "./SocketService.js";
var blossom = require('edmonds-blossom')

type TMatch = TLobbyUser[]
type Pairing = [number, number]

type PlayerGraph = [TTournamentParticipant, TTournamentParticipant][]

type GraphEdge = [number, number, number];
type WeightedGraph = GraphEdge[];

class TournamentService {
    start(lobby: TLobby) {
        this._currentRound = 1
        tournamentService._participants = this._getTournPlayers(lobby.users); //USE THIS FROM NOW ON, SO EVEN IF PLAYERS EXIT TOURNAMENT, INFO IS STILL SAVED
        this._displayStandings(lobby)
    }

    private _displayStandings(lobby: TLobby) {
        const tournStandings = TournamentService.getCurrentStandings(this.participants)
        socketService.broadcastToLobby(lobby.id, "displayStandings", { standings: tournStandings })

        setTimeout(() => {
            this._displayPairings(lobby)
        }, 10 * 1000)
    }

    private _displayPairings(lobbySettings: TLobby) {
        const tournMatches: {
            matches: TMatch[]
            tournPairings: Pairing[]
        } = this._buildMatches(lobbySettings); //Builds matches ONLY WITH THE PLAYERS STILL PRESENT

        socketService.broadcastToLobby(lobbySettings.id, "displayPairings", { pairings: tournMatches.tournPairings })

        setTimeout(() => {
            for (let i = 0; i < tournMatches.matches.length; i++) {
                const matchPlayers = this._getMatchPlayers(tournMatches.matches[i]);
                matchService.createAndRunMatch(lobbySettings, matchPlayers)
            }
        }, 10000)
    }

    onMatchFinished(lobbyID: number, _matchID: number, result: TMatchResult) {
        //TODO
    }

    _getTournPlayers(users: TLobbyUser[]): TTournamentParticipant[] {
        const out: TTournamentParticipant[] = [];
        users.forEach(user => {
            const player = user.player as TTournamentPlayer;
            out.push({
                id: user.id,
                nick: user.username,
                score: player.score,
                rating: user.rating,
                prevOpponents: player.prevOpponents,
                teamDist: player.teamPref,
                participating: true
            })
        })
        return out
    }

    private _buildMatches(lobbySettings: TLobby): {
        matches: TMatch[],
        tournPairings: Pairing[]
    } {
        const users = lobbySettings.users
        const matches: TMatch[] = [];

        const participants: TTournamentParticipant[] = this._getTournPlayers(users);
        const pairings = TournamentService.getNextRoundPairings(participants);
        pairings.forEach(pair => {
            const player1 = users.find(user => user.id === pair[0]);
            const player2 = users.find(user => user.id === pair[1]);
            if (!player1 || !player2) { throw Error("GAVE GIGANTIC SHIT"); }
            matches.push([player1, player2]);
        })
        return {
            matches: matches,
            tournPairings: pairings
        };
    }

    private _getMatchPlayers(users: TMatch): TMatchPlayer[] {
        const out: TMatchPlayer[] = [];
        for (let i = 0; i < users.length; i++) {
            out.push({
                userID: users[i].id,
                id: users[i].id,
                nickname: users[i].username,
                spriteID: users[i].spriteID,
                team: i === 0 ? SIDES.LEFT : SIDES.RIGHT, //Change to taking team preference into account
                role: ROLES.BACK,
            })
        }
        return out
    }

    private _currentRound: number = 0;
    private _participants: TTournamentParticipant[] | null = null
    get participants() {
        if (!this._participants) {throw Error("participants are not initialized!")}
        return this._participants
    }



    static getNextRoundPairings(players: TTournamentParticipant[]): Pairing[] {

        const normalizedPlayers = structuredClone(players).sort((a, b) => {
            if (a.score !== b.score) return b.score - a.score;
            else return b.rating - a.rating;
        });
        let playerRank = 1;
        normalizedPlayers.forEach(player => { player.rating = playerRank++; })


        const playerGraph: PlayerGraph = this._generatePlayerGraph(normalizedPlayers);
        const scoreGroupSizes: Map<number, number> = this._getScoreGroupSizes(players.map(player => player.score))
        const weightedGraph: WeightedGraph = this._generateWeightedGraph(playerGraph, scoreGroupSizes);

        const pairingsIndexes: number[] = blossom(weightedGraph);
        const pairings: Pairing[] = this._convertToPairings(normalizedPlayers, pairingsIndexes)

        return pairings;
    }

    static getCurrentStandings(players: TTournamentParticipant[]): TTournamentParticipant[] {
        const classificationTable = Array.from(players).sort((a, b) => {
            if (a.score !== b.score) return b.score - a.score;
            else { //put here tiebreaks
                return b.rating - a.rating
            };
        });

        return classificationTable
    }

    private static _generatePlayerGraph(players: TTournamentParticipant[]): PlayerGraph {
        const playerGraph: PlayerGraph = [];
        for (let i: number = 0; i < players.length - 1; i++) {
            for (let j: number = i + 1; j < players.length; j++) {
                const possibleOpponent = players[j];
                if (!possibleOpponent.id) { throw Error("Player not initialized when it should")}
                if (!players[i].prevOpponents.includes(possibleOpponent.id)
                    && players[i].teamDist + players[j].teamDist < 4) {

                    playerGraph.push([players[i], players[j]]);
                }
            }
        }
        return playerGraph;
    }

    private static _generateWeightedGraph(
        playerGraph: PlayerGraph,
        scoreGroupSizes: Map<number, number>): WeightedGraph {
        //console.log("GRAPH: ")
        const weightedGraph: WeightedGraph = []
        playerGraph.forEach(edge => {
            const scoreGroupSize = edge[0].score === edge[1].score
                ? scoreGroupSizes.get(edge[0].score)
                : 0;
            if (scoreGroupSize === undefined) {throw Error("How tf is scoreGroupSize undefined")}

            weightedGraph.push([
                edge[0].rating - 1, //rating is rank, and it starts with one. Library is 0-indexed
                edge[1].rating - 1,
                this._calculateEdgeWeight(edge[0], edge[1], scoreGroupSize)
            ])
        })
        //console.log(weightedGraph)

        return weightedGraph
    }

    private static _calculateEdgeWeight(p1: TTournamentParticipant, p2: TTournamentParticipant, scoreGroupSize: number): number {
        const ratingWeight = Math.abs(p1.rating - p2.rating); // rating is rank
        const weightMiddleScoreGroup = Math.abs((scoreGroupSize / 2) - ratingWeight);
        const dutchWeight: number = -Math.pow(weightMiddleScoreGroup, 1.01)

        return ((10000 * (-Math.abs(p1.score - p2.score)))
            + (100 * (-Math.abs(p1.teamDist + p2.teamDist)))
            + (dutchWeight) + 100210
        );
    }

    private static _getScoreGroupSizes(scores: number[]): Map<number, number> {
        const map = new Map<number, number>;
        for (const score of scores) {
            map.set(score, (map.get(score) ?? 0) + 1);
        }
        return map
    }

    private static _convertToPairings(normalizedPlayers: TTournamentParticipant[], pairingsIndexes: number[]): Pairing[] {
        const pairings: Pairing[] = []
        const usedIDs: number [] = [];
        for (let i = 0; i < pairingsIndexes.length; i++) {
            if (usedIDs.includes(i)) continue;

            const player1 = normalizedPlayers.find(player => player.rating - 1 === i);
            const player2 = normalizedPlayers.find(player => player.rating - 1 === pairingsIndexes[i])
            if (player1 && player2) {
                if (!player1.id || !player2.id) { throw Error("Player not initialized when it should!"); }
                pairings.push([
                    player1.id,
                    player2.id
                ])
                usedIDs.push(pairingsIndexes[i])
            }
            
        }
        
        return pairings;
    }
}

export const tournamentService = new TournamentService()