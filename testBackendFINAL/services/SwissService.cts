import { TournamentParticipantT } from "../Repositories/TournamentRepository.js";

var blossom = require('edmonds-blossom')

type Pairing = [number, number]
type PlayerGraph = [TournamentParticipantT, TournamentParticipantT][]

type GraphEdge = [number, number, number];
type WeightedGraph = GraphEdge[];

export class SwissService {
    static getNextRoundPairings(players: TournamentParticipantT[]): Pairing[] {

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

    static getCurrentStandings(players: TournamentParticipantT[]): TournamentParticipantT[] {
        const classificationTable = Array.from(players).sort((a, b) => {
            if (a.score !== b.score) return b.score - a.score;
            else { //put here tiebreaks
                return b.rating - a.rating
            };
        });

        return classificationTable
    }

    private static _generatePlayerGraph(players: TournamentParticipantT[]): PlayerGraph {
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

    private static _calculateEdgeWeight(p1: TournamentParticipantT, p2: TournamentParticipantT, scoreGroupSize: number): number {
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

    private static _convertToPairings(normalizedPlayers: TournamentParticipantT[], pairingsIndexes: number[]): Pairing[] {
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
