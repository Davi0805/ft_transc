import SObject from "./SObject.js";
import { computeOrientation } from "../shared/sharedUtils.js";
export var MOVEMENT;
(function (MOVEMENT) {
    MOVEMENT[MOVEMENT["NONE"] = 0] = "NONE";
    MOVEMENT[MOVEMENT["LEFT"] = 1] = "LEFT";
    MOVEMENT[MOVEMENT["RIGHT"] = 2] = "RIGHT";
})(MOVEMENT || (MOVEMENT = {}));
// Represents the paddle from the server's perspective
export default class SPaddle extends SObject {
    constructor(id, side, pos, size, speed) {
        super(id, pos, computeOrientation(side), size, speed);
        this._side = side;
        this._nextMovement = MOVEMENT.NONE;
    }
    move(delta) {
        if (this._nextMovement === MOVEMENT.LEFT || this._nextMovement == MOVEMENT.RIGHT) {
            let movVector = this.orientation.multiplyScalar(this.speed * delta)
                .rotate((this._nextMovement === MOVEMENT.LEFT) ? -90 : 90);
            this.pos = this.pos.add(movVector);
        }
    }
    collideWith(other) {
    }
    _nextMovement;
    set nextMovement(movement) {
        this._nextMovement = movement;
    }
    _side;
    get side() { return this._side; }
}
