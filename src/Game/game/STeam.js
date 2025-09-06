// Represents a set of players defending one of the sides of the field
export default class STeam {
    constructor(side, initialScore) {
        this._side = side;
        this._score = initialScore;
        this._place = 0;
    }
    _side;
    get side() { return this._side; }
    _score;
    set score(score) { this._score = score; }
    get score() { return this._score; }
    _place;
    set place(place) { this._place = place; }
    get place() { return this._place; }
}
