import { Point } from "@pixi/math"
import { SIDES } from "../misc/types.js";
import SObject from "../abstracts/SObject.js";
import { computeOrientation } from "../misc/utils.js";

export default class SPaddle extends SObject {
    constructor(side: SIDES, pos: Point, size: Point, speed: number) {
        super(pos, computeOrientation(side), size, speed);
        this._side = side;
    }

    private _side: SIDES;
    set side(side: SIDES) {this._side = side;}
    get side(): SIDES { return this._side;}

}