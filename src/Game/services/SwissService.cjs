"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SwissService = void 0;
var blossom = require('edmonds-blossom');
//This is a fully static class that calculates standings and pairings according to the swiss system
class SwissService {
    static getNextRoundPairings(players) {
        const normalizedPlayers = structuredClone(players).sort((a, b) => {
            if (a.score !== b.score)
                return b.score - a.score;
            else
                return b.rating - a.rating;
        });
        //Remove the player that will receive a bye (if any) after ordering but before normalizing
        let byePlayer = null;
        if (normalizedPlayers.length % 2 === 1) {
            const byePlayerID = this._getByePlayerIndex(players);
            byePlayer = normalizedPlayers.splice(byePlayerID, 1)[0];
        }
        let playerRank = 1;
        normalizedPlayers.forEach(player => { player.rating = playerRank++; });
        const playerGraph = this._generatePlayerGraph(normalizedPlayers);
        const scoreGroupSizes = this._getScoreGroupSizes(players.map(player => player.score));
        const weightedGraph = this._generateWeightedGraph(playerGraph, scoreGroupSizes);
        const pairingsIndexes = blossom(weightedGraph);
        const pairings = this._convertToPairings(normalizedPlayers, pairingsIndexes);
        if (byePlayer) {
            pairings.push([byePlayer.id, -1]);
        }
        return pairings;
    }
    static getCurrentStandings(players) {
        const classificationTable = Array.from(players).sort((a, b) => {
            if (a.score !== b.score)
                return b.score - a.score;
            else { //put here tiebreaks
                return b.rating - a.rating;
            }
            ;
        });
        return classificationTable;
    }
    static _getByePlayerIndex(players) {
        let lowestByeAm = Infinity;
        let byePlayerIndex = -1;
        //Starting from the last guarantees that it is the last player that gets the bye in case of a lowestByeAm tie
        for (let i = players.length - 1; i >= 0; i--) {
            const byeAm = players[i].prevOpponents.filter(opponent => opponent === -1).length;
            if (byeAm < lowestByeAm) {
                lowestByeAm = byeAm;
                byePlayerIndex = i;
            }
        }
        if (byePlayerIndex === -1) {
            throw Error("Error in code, as any bye amount should be less than infinity");
        }
        return byePlayerIndex;
    }
    static _generatePlayerGraph(players) {
        const playerGraph = [];
        for (let i = 0; i < players.length - 1; i++) {
            for (let j = i + 1; j < players.length; j++) {
                const possibleOpponent = players[j];
                if (!possibleOpponent.id) {
                    throw Error("Player not initialized when it should");
                }
                if (!players[i].prevOpponents.includes(possibleOpponent.id)
                    && players[i].teamDist + players[j].teamDist < 4) {
                    playerGraph.push([players[i], players[j]]);
                }
            }
        }
        return playerGraph;
    }
    static _generateWeightedGraph(playerGraph, scoreGroupSizes) {
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
    static _calculateEdgeWeight(p1, p2, scoreGroupSize) {
        const ratingWeight = Math.abs(p1.rating - p2.rating); // rating is rank
        const weightMiddleScoreGroup = Math.abs((scoreGroupSize / 2) - ratingWeight);
        const dutchWeight = -Math.pow(weightMiddleScoreGroup, 1.01);
        return ((10000 * (-Math.abs(p1.score - p2.score)))
            + (100 * (-Math.abs(p1.teamDist + p2.teamDist)))
            + (dutchWeight) + 100210);
    }
    static _getScoreGroupSizes(scores) {
        const map = new Map;
        for (const score of scores) {
            map.set(score, (map.get(score) ?? 0) + 1);
        }
        return map;
    }
    static _convertToPairings(normalizedPlayers, pairingsIndexes) {
        const pairings = [];
        const usedIDs = [];
        for (let i = 0; i < pairingsIndexes.length; i++) {
            if (usedIDs.includes(i))
                continue;
            const player1 = normalizedPlayers.find(player => player.rating - 1 === i);
            const player2 = normalizedPlayers.find(player => player.rating - 1 === pairingsIndexes[i]);
            if (player1 && player2) {
                if (!player1.id || !player2.id) {
                    throw Error("Player not initialized when it should!");
                }
                pairings.push(player1.teamDist < player2.teamDist
                    ? [player1.id, player2.id]
                    : [player2.id, player1.id]);
                usedIDs.push(pairingsIndexes[i]);
            }
        }
        return pairings;
    }
}
exports.SwissService = SwissService;
