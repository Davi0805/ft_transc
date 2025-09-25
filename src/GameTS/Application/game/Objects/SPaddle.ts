import Point from "../shared/Point.js";
import { SIDES } from "../shared/sharedTypes.js";
import SObject from "./SObject.js";
import { computeOrientation } from "../shared/sharedUtils.js";
import { TPaddle } from "../shared/sharedTypes.js";

export type TSPaddleConfigs = Pick<TPaddle, "id" | "side" | "size" | "pos" | "speed">[]

export enum MOVEMENT {
    NONE,
    LEFT,
    RIGHT,
    SELF_DESTRUCT
}

// Represents the paddle from the server's perspective
export default class SPaddle extends SObject {
    constructor(id: number, side: SIDES, pos: Point, size: Point, speed: number) {
        super(id, pos, computeOrientation(side), size, speed);
        this._side = side;
        this._nextMovement = MOVEMENT.NONE;
        this._active = true;
        this._selfDestructTime = 0;
    }

    move(delta: number) { //returns if the paddle became inactive after the move
        if (!this._active) { return; }
        if (this._nextMovement === MOVEMENT.SELF_DESTRUCT) {
            this._selfDestructTime += delta;
            if (this._selfDestructTime > 3) {
                this.active = false;
                return true;
            }
        } else {
            this._selfDestructTime = 0;
        }

        if (this._nextMovement === MOVEMENT.LEFT || this._nextMovement == MOVEMENT.RIGHT) {
            let movVector = this.orientation.multiplyScalar(this.speed * delta)
                            .rotate((this._nextMovement === MOVEMENT.LEFT) ? -90 : 90);
            this.pos = this.pos.add(movVector);
        }
        return false;
    }

    collideWith(other: SObject): void {
        
    }
    
    private _nextMovement: MOVEMENT;
    set nextMovement(movement: MOVEMENT) {
        this._nextMovement = movement;
    }

    private _side: SIDES;
    get side(): SIDES { return this._side; }
    
    private _active: boolean;
    set active(active: boolean) { this._active = active; }

    private _selfDestructTime: number;
}