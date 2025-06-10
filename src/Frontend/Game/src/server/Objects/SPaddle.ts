import Point from "../../misc/Point.js";
import { SIDES } from "../../misc/types.js";
import SObject from "../../abstracts/SObject.js";
import { computeOrientation } from "../../misc/utils.js";
import { TPaddle } from "../../misc/types.js";

export type TSPaddleConfigs = Pick<TPaddle, "id" | "side" | "size" | "pos" | "speed">[]

// Represents the paddle from the server's perspective
export default class SPaddle extends SObject {
    constructor(id: number, side: SIDES, pos: Point, size: Point, speed: number) {
        super(id, pos, computeOrientation(side), size, speed);
        this._side = side;
    }

    move(movVector: Point) {
        this.pos = this.pos.add(movVector);
    }

    private _side: SIDES;
    get side(): SIDES { return this._side; }
}