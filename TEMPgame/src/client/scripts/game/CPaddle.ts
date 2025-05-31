import Point from "../../../misc/Point.js";
import { SIDES } from "../../../misc/types.js";
import { computeOrientation } from "../../../misc/utils";
import { Sprite } from "pixi.js";
import CObject from "../../../abstracts/CObject";


export default class CPaddle extends CObject {
    constructor(id: number, side: SIDES, pos: Point, size: Point, sprite: Sprite) {
        super(id, pos, size, computeOrientation(side), sprite);
        //this._side = side;
    }

    /* private _side: SIDES;
    set side(side: SIDES) {this._side = side;}
    get side(): SIDES { return this._side;} */
}