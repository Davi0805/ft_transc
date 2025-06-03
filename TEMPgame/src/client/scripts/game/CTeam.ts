import { SIDES } from "../../../misc/types";
import CScore from "./CScore";

export default class CTeam {
    constructor(side: SIDES, score: CScore) {
        this._side = side;
        this._score = score;
    }

    private _side: SIDES
    get side(): SIDES { return this._side; }

    private _score: CScore
    set score(score: CScore ) {this._score = score;}
    get score(): CScore { return this._score; }
}