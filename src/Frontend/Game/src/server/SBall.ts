import Point from "../misc/Point.js";
import SObject from "../abstracts/SObject.js";

export enum BALL_TYPES {
    BASIC,
    EXPAND,
    SHRINK,
    BALL_TYPE_AM
}

// Represents the ball from the Server's perspective
export default class SBall extends SObject {
    constructor(id: number, pos: Point, size: Point, speed: number, direction: Point, type: BALL_TYPES = BALL_TYPES.BASIC) {
        super(id, pos, new Point(1, 0), size, speed);
        this._speed = speed;
        this._direction = direction.normalize();
        this._type = type;
        console.log(speed)
    }

    move(delta: number) {
        this.pos = this.pos.add(this.direction.multiplyScalar(this.speed * delta));
    }

    private _direction: Point;
    get direction() { return this._direction; }
    set direction(value: Point) {
        this._direction = value;
    }

    private _type: BALL_TYPES;
    get type(): BALL_TYPES { return this._type; }
}