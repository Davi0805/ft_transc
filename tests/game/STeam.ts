import { SIDES } from "./shared/sharedTypes.js";

// Represents a set of players defending one of the sides of the field
export default class STeam {
    constructor(side: SIDES, initialScore: number) {
        this._side = side;
        this._score = initialScore;
        this._place = 0;
    }

    private _side: SIDES
    get side(): SIDES { return this._side; }

    private _score: number
    set score(score: number ) { this._score = score; }
    get score(): number { return this._score; }

    private _place: number
    set place(place: number) { this._place = place; }
    get place(): number { return this._place; }
}