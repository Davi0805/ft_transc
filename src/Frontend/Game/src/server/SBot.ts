import { point, SIDES } from "../misc/types.js";
import SPaddle from "./SPaddle.js";
import SPlayer from "./SPlayer.js";
import SBall from "./SBall.js";
import { dir } from "console";

const EPSILON = 3

export default class SBot extends SPlayer {
    constructor(windowSize: point, paddle: SPaddle, difficulty: number) {
        super(paddle);
        this._updateRate = difficulty;
        this._timeSinceLastUpdate = difficulty; // This allows for an update immediately after the game starts
        
        this._windowSize = windowSize;
        
        if (this.paddle.orientation.x !== 0) {
            this._orientationAxis = 'x';
            this._movementAxis = 'y';
        } else {
            this._orientationAxis = 'y';
            this._movementAxis = 'x';
        }

        this._targetPos = windowSize[this._movementAxis] / 2;

        this._mustMoveLeft = (paddle.side === SIDES.LEFT || paddle.side === SIDES.BOTTOM)
            ? (() => this._targetPos > this.paddle.pos[this._movementAxis])
            : (() => this._targetPos < this.paddle.pos[this._movementAxis]);
    }

    predictTargetPos(ball: SBall) {
        // The following predicts where in the movement axis the ball will hit if it is going in the direction of that axis. 
        const startPos = { refAxis: ball.pos[this._orientationAxis] + ((ball.size[this._orientationAxis] / 2) * -this.paddle.orientation[this._orientationAxis]), targetAxis: ball.pos[this._movementAxis] };
        const direction = { refAxis: ball.direction[this._orientationAxis], targetAxis: ball.direction[this._movementAxis] };
        const refAxisHitPos = this.paddle.pos[this._orientationAxis] + ((this.paddle.size.x / 2) * this.paddle.orientation[this._orientationAxis]) // this is always the same... maybe it can be saved somewhere?

        
        this._targetPos = this._calculateTargetAxisHitPos(startPos, direction, refAxisHitPos);
        if (this.paddle.id === 1) {
            console.error("FINAL: ", this._targetPos)
        }
    }

    setupMove() {
        if (this._aproxCompare(this._targetPos, this.paddle.pos[this._movementAxis])) {
            this.controls.left.pressed = false;
            this.controls.right.pressed = false;
            return ;
        }
        if (this._mustMoveLeft()) {
            this.controls.left.pressed = false;
            this.controls.right.pressed = true;
        } else {
            this.controls.left.pressed = true;
            this.controls.right.pressed = false;
        }
    }

    private _updateRate: number;
    get updateRate(): number { return this._updateRate; }

    private _timeSinceLastUpdate: number;
    set timeSinceLastUpdate(timeSinceLastUpdate: number) {
        this._timeSinceLastUpdate = timeSinceLastUpdate;
    }
    get timeSinceLastUpdate(): number {
        return this._timeSinceLastUpdate;
    }

    private _windowSize: point;

    private _orientationAxis: 'x' | 'y';
    private _movementAxis: 'x' | 'y';

    private _targetPos: number;

    private _aproxCompare(n1: number, n2: number) {
        return (Math.abs(n1 - n2) < EPSILON);
    }

    private _mustMoveLeft;



    private calls = 0;
    private _calculateTargetAxisHitPos(startPos: { refAxis: number, targetAxis: number },
                                        direction: { refAxis: number, targetAxis: number },
                                        refAxisHitPos: number): number {
        
        console.log("id: ", this.paddle.id)
        console.log("startPos: ", startPos)
        console.log("direction: ", direction)
        console.log("refAxisHitPos: ", refAxisHitPos)
        console.log("-----------------")
        this.calls++;
        if (this.calls >30)
            throw new Error()
        
        // To know the final position in the target axis (which is the movement axis of a given paddle),
        // we start with the position in the target axis, and we have to add to it how much we move there if we move 'n' in the reference axis.
        // To calculate that, we just have to know how much 'n' is and then multiplying it by the proportion between the movement in each axis.
        // Example: if start pos is { 2, 3 }, direction is { 2, 1 } and we want to know how much y will be when x is 5,
        // we must start with 3 and add to it how much we should move if x moves from 2 to 5.
        // 'n' is 5-2 and proportion of movement between axis is 1/2 (y moves 1 if x moves 2), which gives us the formula
        // 3 + ((5 - 2) * (1 / 2)) == 3 + (3 * 1/2) == 3 + 1.5 == 4.5
        let hitPos = startPos.targetAxis
                        + ((refAxisHitPos - startPos.refAxis)
                            * (direction.targetAxis / direction.refAxis));
        // If the resulting position is outside the boundaries, it means that it will hit a wall first.
        // In that case, we must calculate a reflection angle
        if (hitPos < 0 || hitPos > this._windowSize[this._movementAxis]) { // TODO: This is the cause of the stack overflow. When it is called recursively with the axis switched, this variable keeps the same axis!! This function has to be completely agnostic. All info must be passed to the function as arguments.
            if (this.paddle.id === 3) {
                console.log("Ball is going to hit a side wall. The paddle pos would have to be ", hitPos);
            }
            // The 32 below is: 4 (ball size) + 20 (paddle pos) + 8 (paddle half size)
            const newRefAxisHitpos = hitPos < 0 ? 32 : this._windowSize[this._movementAxis] - 32;
            const newStartPos = this._calculateTargetAxisHitPos(
                { refAxis: startPos.targetAxis, targetAxis: startPos.refAxis },
                { refAxis: direction.targetAxis, targetAxis: direction.refAxis },
                newRefAxisHitpos
            )
            if (this.paddle.id === 3) {
                console.log("The ball will theoretically hit the pos ", newStartPos);
            }
            
            hitPos = this._calculateTargetAxisHitPos(
                { refAxis: newStartPos, targetAxis: newRefAxisHitpos },
                { refAxis: direction.refAxis, targetAxis: - direction.targetAxis },
                refAxisHitPos
            )
            if (this.paddle.id === 3) {
                console.log("The new hitpos will be ", hitPos)
            }
            
        }
        return hitPos;
    }
}