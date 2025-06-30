type Pair<K, V> = { m1: K, m2: V };
type Match = Pair<Player, Player>

export class TournamentService {
    constructor() {

    }
    
    registerPlayer(playerID: number, platerRating: number) {
        const player = new Player(playerID, platerRating);
        this._pairingTable.push(player);
        this._pairingTable.sort((a, b) => {
            if (a.score != b.score) return b.score - a.score;
            return b.rating - a.rating;
        });
        
        this._classTable.push(player);
        this._updateClassTable();
        console.log(this._classTable)
    }

    start() {
        for (let i = 0; i < this._pairingTable.length; i++) {
            this._pairingTable[i].seed = i;
        }
        this._hasStarted = true;
    }

    getNextRoundPairings(): Pair<number, number>[] {
        this._currentRound++;
        const round = new Round(this._pairingTable);
        return round.getPairings();
    }

    private _updateClassTable() {
    }

    private _pairingTable: Player[] = [];
    private _classTable: Player[] = [];
    private _hasStarted: boolean = false;
    private _currentRound: number = 0;
}

class Player {
    constructor(id: number, rating: number) {
        this._id = id;
        this._seed = -1 // To be updated only when the tournament starts
        this._rating = rating;
        this._score = 0;
        this._pastOpponents = [];
    }

    private _id: number;
    get id() { return this._id; }
    private _seed: number;
    set seed(seed: number) { this._seed = seed; }
    get seed(): number { return this._seed; }

    private _rating: number;
    get rating(): number { return this._rating; }
    private _score: number;
    get score(): number { return this._score; }
    private _pastOpponents: Player[];
    get pastOpponents() { return this._pastOpponents; }
}

class Round {
    constructor(startingTable: Player[]) {
        this._startingTable = startingTable;
    }

    getPairings(): Pair<number, number>[] {
        return []
    }

    private _startingTable: Player[]
}

class Bracket {
    constructor(movedDownPlayers: Player[], residents: Player[]) {
        this._movedDownPlayers = movedDownPlayers;
        this._residents = residents;
        this._m0 = movedDownPlayers.length;
        this._maxPairs = this._m0 > residents.length ? residents.length : Math.floor(this._m0 / 2);
        this._m1 = this._m0 > residents.length ? residents.length : this._m0;
        this._limbo = []
    }

    performPairings() {
        const candidate: Match[] = [];
        if (this._movedDownPlayers.length !== 0) {
            const s1 = this._movedDownPlayers.slice(0, this._m1);
            const s2 = this._residents.slice();
            this._limbo = this._movedDownPlayers.slice(this._m1);
            for (let i = 0; i < s1.length; i++) {
                candidate.push({ m1: s1[i], m2: s2[i] });
            }
        }
        
        const remainder = this._residents.slice(this._m1); //This gets the remainder of residents
        const s1 = remainder.slice(0, this._maxPairs - candidate.length);
        const s2 = remainder.slice(this._maxPairs - candidate.length);
        for (let i = 0; i < s1.length; i++) {
            candidate.push({ m1: s1[i], m2: s2[i] });
        }

        console.log(candidate);
        this._evaluateCandidate(candidate);
    }

    private _evaluateCandidate(candidate: Match[]): boolean {
        candidate.forEach(match => {
            if (
                // C1 C2 (if there is a bye, a mock player with id -1 will be in past opponents)
                match.m1.pastOpponents.some(opponent => opponent.id === match.m2.id)
                // C3 is not necessary, as there are no colors, C4 is checked later and C5 is for bye
                || 
            ) { return false; }
        })
        
        
    }
    

    private _movedDownPlayers: Player[];
    private _residents: Player[]
    private _m0: number;
    private _maxPairs: number;
    private _m1: number;
    private _limbo: Player[];

    private _pairings: Match[] = []
    private _downFloaters: number[] = [];
}