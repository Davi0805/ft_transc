import Point from "../misc/Point.js";
import SObject from "../abstracts/SObject.js";


export default class SBall extends SObject {
    constructor(pos: Point, size: Point, speed: number, direction: Point) {
        super(pos, new Point(1, 0), size, speed);
        this._speed = speed;
        this._direction = direction.normalize();
    }

    private _direction: Point;
    get direction() { return this._direction; }
    set direction(value: Point) {
        this._direction = value;
    }
}