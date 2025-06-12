import Point from "../../misc/Point.js";
import SObject from "../../abstracts/SObject.js";
import { TBall } from "../../misc/types.js";

export type TSBallConfigs = Pick<TBall, "type" | "size" | "pos" |"direction" | "speed" | "damage">
export type SBallState = Pick<SBall, "id" | "pos" | "direction" | "speed">

export enum BALL_TYPES {
    BASIC,
    EXPAND,
    SHRINK,
    MYSTERY,
    BALL_TYPE_AM
}

//export const SBALL_DEFAULT_SIZE = { x: 8, y: 8 }

// Represents the ball from the Server's perspective
export default class SBall extends SObject {
    constructor(id: number, pos: Point, size: Point, speed: number, direction: Point, type: BALL_TYPES, damage: number) {
        super(id, pos, new Point(1, 0), size, speed);
        this._speed = speed;
        this._direction = direction.normalize();
        this._type = type;
        this._damage = damage;
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

    private _damage: number;
    get damage(): number { return this._damage; }
}