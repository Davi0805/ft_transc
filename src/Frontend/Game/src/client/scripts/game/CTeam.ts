import { SIDES } from "../../../misc/types";
import CNumbersText from "./CNumbersText";

export default class CTeam {
    constructor(side: SIDES, score: CNumbersText) {
        this._side = side;
        this._hp = score;
    }

    update(newHP: number) {
        if (this._hp.value !== newHP) {
            this._hp.update(newHP, true);
        }
    }

    private _side: SIDES
    get side(): SIDES { return this._side; }

    private _hp: CNumbersText
    set hp(hp: CNumbersText) { this._hp = hp; }
    get hp(): CNumbersText { return this._hp; }
}