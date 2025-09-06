import Point from "../shared/Point.js";
import SObject from "./SObject.js";
// Represents the ball from the Server's perspective
export default class SBall extends SObject {
    constructor(id, pos, size, speed, direction, type, damage) {
        super(id, pos, new Point(1, 0), size, speed);
        this._direction = direction.normalize();
        this._type = type;
        this._damage = damage;
    }
    move(delta) {
        this.pos = this.pos.add(this.direction.multiplyScalar(this._speed * delta));
    }
    _direction;
    get direction() { return this._direction; }
    set direction(value) {
        this._direction = value;
    }
    _type;
    get type() { return this._type; }
    _damage;
    get damage() { return this._damage; }
}
