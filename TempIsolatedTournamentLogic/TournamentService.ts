var blossom = require('edmonds-blossom')

type Player = {
    id: number
    score: number
    rating: number
}
type Pair<K, V> = { m1: K, m2: V };
type Match = Pair<number, number>

type GraphEdge = [number, number, number];
type WeightedGraph = GraphEdge[];


export class TournamentService {
    constructor() {}

    getNextRoundPairings(players: Player[]): Match[] {
        //const graph: WeightedGraph = this._generateGraph(players);

        const graph: WeightedGraph = [
            [0, 1, 6],
            [0, 2, 10],
            [1, 2, 5]
        ]
        const pairings: Match[] = blossom(graph);
        console.log(pairings);
        return pairings;
    }

    getClassificationTable(players: Player[]): Player[] {
        const classificationTable: Player[] = [];

        return classificationTable
    }

    private _generateGraph(players: Player[]): WeightedGraph {
        const graph: WeightedGraph = [];

        return graph;
    }
}
