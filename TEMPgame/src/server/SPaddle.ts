import Point from "../misc/Point"
import { SIDES } from "../misc/types.js";
import SObject from "../abstracts/SObject.js";
import { computeOrientation } from "../misc/utils.js";

export default class SPaddle extends SObject {
    constructor(id: number, side: SIDES, pos: Point, size: Point, speed: number) {
        super(pos, computeOrientation(side), size, speed);
        this._id = id //TODO: probably all objects should have an id?
        this._side = side;
    }

    private _id: number;
    set id(id: number) { this._id = id }
    get id(): number { return this._id }

    private _side: SIDES;
    set side(side: SIDES) {this._side = side;}
    get side(): SIDES { return this._side;}
}