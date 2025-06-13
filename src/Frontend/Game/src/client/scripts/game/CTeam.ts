import { SIDES } from "../../../misc/types";
import CNumbersText from "./CNumbersText";

export default class CTeam {
    constructor(side: SIDES, score: CNumbersText) {
        this._side = side;
        this._score = score;
    }

    private _side: SIDES
    get side(): SIDES { return this._side; }

    private _score: CNumbersText
    set score(score: CNumbersText) {this._score = score;}
    get score(): CNumbersText { return this._score; }
}