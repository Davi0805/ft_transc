import Point from "../../../misc/Point.js";
import { SIDES } from "../../../misc/types.js";
import { computeOrientation } from "../../../misc/utils";
import { Sprite } from "pixi.js";
import CObject from "../../../abstracts/CObject";


export default class CPaddle extends CObject {
    constructor(id: number, side: SIDES, pos: Point, size: Point, sprite: Sprite) {
        super(pos, size, computeOrientation(side), sprite);
        this._id = id;
        this._side = side;
    }

    private _id: number;
    set id(id: number) { this._id = id; }
    get id(): number { return this._id; }

    private _side: SIDES;
    set side(side: SIDES) {this._side = side;}
    get side(): SIDES { return this._side;}
}