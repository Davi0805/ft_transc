import { SIDES } from "../../../misc/types";
import CPaddle from "./CPaddle";
import CScore from "./CScore";

export default class CPlayer {
    constructor(side: SIDES, paddle: CPaddle, score: CScore) {
        this._side = side;
        this._paddle = paddle;
        this._score = score;
    }

    private _side: SIDES

    private _paddle: CPaddle;
    get paddle(): CPaddle { return this._paddle }

    private _score: CScore;
}