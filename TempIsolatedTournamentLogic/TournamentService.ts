type Player = {
    id: number
    score: number
    rating: number
}
type Pair<K, V> = { m1: K, m2: V };
type Match = Pair<Player, Player>



export class TournamentService {
    constructor() {}

    getNextRoundPairings(players: Player[]): Match[] {
        const pairings: Match[] = [];

        
        return pairings;
    }

    getClassificationTable(players: Player[]): Player[] {
        const classificationTable: Player[] = [];

        return classificationTable
    }
}
