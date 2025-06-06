import Point from "../misc/Point.js";
import SObject from "../abstracts/SObject.js";

export enum BALL_TYPE {
    
}

// Represents the ball from the Server's perspective
export default class SBall extends SObject {
    constructor(id: number, pos: Point, size: Point, speed: number, direction: Point) {
        super(id, pos, new Point(1, 0), size, speed);
        this._speed = speed;
        this._direction = direction.normalize();
    }

    move(delta: number) {
        this.pos = this.pos.add(this.direction.multiplyScalar(this.speed * delta));
    }

    private _direction: Point;
    get direction() { return this._direction; }
    set direction(value: Point) {
        this._direction = value;
    }
}