import APaddle from "../../../abstracts/CObject";
import { SIDES } from "../../../misc/types.js";
import { computeOrientation } from "../../../misc/utils";
import { Sprite } from "pixi.js";
import { Point } from "@pixi/math";


export default class CPaddle extends APaddle {
    constructor(side: SIDES, pos: Point, sprite: Sprite) {
        super(pos, computeOrientation(side), sprite);
        this._side = side;
    }

    private _side: SIDES;
    set side(side: SIDES) {this._side = side;}
    get side(): SIDES { return this._side;}
}