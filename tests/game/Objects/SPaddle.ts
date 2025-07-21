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
}

// Represents the paddle from the server's perspective
export default class SPaddle extends SObject {
    constructor(id: number, side: SIDES, pos: Point, size: Point, speed: number) {
        super(id, pos, computeOrientation(side), size, speed);
        this._side = side;
        this._nextMovement = MOVEMENT.NONE;
    }

    move(delta: number) {
        if (this._nextMovement === MOVEMENT.LEFT || this._nextMovement == MOVEMENT.RIGHT) {
            let movVector = this.orientation.multiplyScalar(this.speed * delta)
                            .rotate((this._nextMovement === MOVEMENT.LEFT) ? -90 : 90);
            this.pos = this.pos.add(movVector);
        }
    }

    collideWith(other: SObject): void {
        
    }
    
    private _nextMovement: MOVEMENT;
    set nextMovement(movement: MOVEMENT) {
        this._nextMovement = movement;
    }

    private _side: SIDES;
    get side(): SIDES { return this._side; }
}