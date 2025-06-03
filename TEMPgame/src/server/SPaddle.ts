import Point from "../misc/Point"
import { SIDES } from "../misc/types.js";
import SObject from "../abstracts/SObject.js";
import { computeOrientation } from "../misc/utils.js";

// Represents the paddle from the server's perspective
export default class SPaddle extends SObject {
    constructor(id: number, side: SIDES, pos: Point, size: Point, speed: number) {
        super(id, pos, computeOrientation(side), size, speed);
        this._side = side;
    }

    private _side: SIDES;
    get side(): SIDES { return this._side; }
}