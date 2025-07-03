"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TournamentService = void 0;
var blossom = require('edmonds-blossom');
class TournamentService {
    constructor() { }
    getNextRoundPairings(players) {
        //const graph: WeightedGraph = this._generateGraph(players);
        const graph = [
            [0, 1, 6],
            [0, 2, 10],
            [1, 2, 5]
        ];
        const pairings = blossom(graph);
        console.log(pairings);
        return pairings;
    }
    getClassificationTable(players) {
        const classificationTable = [];
        return classificationTable;
    }
    _generateGraph(players) {
        const graph = [];
        return graph;
    }
}
exports.TournamentService = TournamentService;
