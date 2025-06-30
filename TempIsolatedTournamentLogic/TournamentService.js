"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TournamentService = void 0;
class TournamentService {
    constructor() {
        this._classTable = [];
    }
    registerPlayer(playerID, platerRating) {
        this._classTable.push(new Player(playerID, platerRating));
        this._sortClassTable();
        console.log(this._classTable);
    }
    _sortClassTable() {
        this._classTable.sort((a, b) => {
            if (a.score !== b.score) {
                return (b.score - a.score);
            }
            return (b.rating - a.rating);
        });
    }
}
exports.TournamentService = TournamentService;
class Player {
    constructor(id, rating) {
        this._id = id;
        this._rating = rating;
        this._score = 0;
        this._pastOpponentsIds = [];
    }
    get rating() { return this._rating; }
    get score() { return this._score; }
}
