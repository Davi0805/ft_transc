"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TournamentService = void 0;
var blossom = require('edmonds-blossom');
class TournamentService {
    constructor() { }
    getNextRoundPairings(players) {
        const normalizedPlayers = Array.from(players).sort((a, b) => {
            if (a.score !== b.score)
                return b.score - a.score;
            else
                return b.rating - a.rating;
        });
        let playerRank = 1;
        normalizedPlayers.forEach(player => { player.rating = playerRank++; });
        const playerGraph = this._generatePlayerGraph(normalizedPlayers);
        const scoreGroupSizes = this._getScoreGroupSizes(players.map(player => player.score));
        const weightedGraph = this._generateWeightedGraph(playerGraph, scoreGroupSizes);
        console.log(weightedGraph);
        const pairingsIndexes = blossom(weightedGraph);
        console.log(pairingsIndexes);
        const pairings = this._convertToPairings(normalizedPlayers, pairingsIndexes);
        return pairings;
    }
    getClassificationTable(players) {
        const classificationTable = [];
        return classificationTable;
    }
    _generatePlayerGraph(players) {
        const playerGraph = [];
        for (let i = 0; i < players.length - 1; i++) {
            for (let j = i + 1; j < players.length; j++) {
                if (!players[i].prevOpponents.includes(players[j].id)
                    && players[i].teamDist + players[j].teamDist < 4) {
                    playerGraph.push([players[i], players[j]]);
                }
            }
        }
        return playerGraph;
    }
    _generateWeightedGraph(playerGraph, scoreGroupSizes) {
        const weightedGraph = [];
        playerGraph.forEach(edge => {
            const scoreGroupSize = edge[0].score === edge[1].score
                ? scoreGroupSizes.get(edge[0].score)
                : 0;
            if (scoreGroupSize === undefined) {
                throw Error("How tf is scoreGroupSize undefined");
            }
            weightedGraph.push([
                edge[0].rating - 1, //rating is rank, and it starts with one. Library is 0-indexed
                edge[1].rating - 1,
                this._calculateEdgeWeight(edge[0], edge[1], scoreGroupSize)
            ]);
        });
        return weightedGraph;
    }
    _calculateEdgeWeight(p1, p2, scoreGroupSize) {
        const ratingWeight = Math.abs(p1.rating - p2.rating); // rating is rank
        const weightMiddleScoreGroup = Math.abs((scoreGroupSize / 2) - ratingWeight);
        const dutchWeight = -Math.pow(weightMiddleScoreGroup, 1.01);
        return ((10000 * (-Math.abs(p1.score - p2.score)))
            + (100 * (-Math.abs(p1.teamDist + p2.teamDist)))
            + (dutchWeight) + 10210);
    }
    _getScoreGroupSizes(scores) {
        const map = new Map;
        for (const score of scores) {
            map.set(score, (map.get(score) ?? 0) + 1);
        }
        return map;
    }
    _convertToPairings(normalizedPlayers, pairingsIndexes) {
        const pairings = [];
        const usedIDs = [];
        for (let i = 0; i < pairingsIndexes.length; i++) {
            if (usedIDs.includes(i))
                continue;
            const player1 = normalizedPlayers.find(player => player.rating - 1 === i);
            const player2 = normalizedPlayers.find(player => player.rating - 1 === pairingsIndexes[i]);
            if (player1 && player2) {
                pairings.push([
                    player1.id,
                    player2.id
                ]);
                usedIDs.push(pairingsIndexes[i]);
            }
        }
        return pairings;
    }
}
exports.TournamentService = TournamentService;
