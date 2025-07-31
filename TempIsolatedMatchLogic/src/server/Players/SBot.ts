import { point, rectangle, SIDES } from "../../shared/sharedTypes.js";
import Point from "../../shared/Point.js";
import SPaddle from "../Objects/SPaddle.js";
import SPlayer from "./SPlayer.js";
import SBall from "../Objects/SBall.js";

// In pixels. The smaller the value, the closer to the target position the bot will attempt to place its paddle.
// Increases precision, but increases chance of overshooting (especially with high paddle speeds)
// and creating a very uncomfortable trembling effect while the bot tries back and forth to readjust the paddle
const MOV_PRECISION_LVL = 3

export default class SBot extends SPlayer {
    constructor(windowLimits: rectangle, paddle: SPaddle, difficulty: number) {
        super(paddle);
        this._updateRate = difficulty;
        this._timeSinceLastUpdate = difficulty; // This allows for an update immediately after the game starts
        
        this._limits = windowLimits;
        
        if (this.paddle.orientation.x !== 0) {
            this._movementAxis = 'y';
        } else {
            this._movementAxis = 'x';
        }

        this._targetPos = windowLimits[this._movementAxis] + ((this._movementAxis === 'x' ? windowLimits.width : windowLimits.height) / 2);

        this._mustMoveLeft = (paddle.side === SIDES.LEFT || paddle.side === SIDES.BOTTOM)
            ? (() => this._targetPos > this.paddle.pos[this._movementAxis])
            : (() => this._targetPos < this.paddle.pos[this._movementAxis]);
    }

    updateTargetPos(balls: SBall[]) {
        let smallestT = Infinity;

        balls.forEach(ball => { //TODO: For accurate prediction, should include ball size in all these calculations
            let t = this._getHitMinT(ball.pos, ball.direction);
            let hitpos = this._getHitPos(ball.pos, ball.direction);
            let hitside = this._getSideFromPos(hitpos)
            let dir = ball.direction;
            
            while (hitside !== this.paddle.side) {
                dir = (hitside === SIDES.LEFT || hitside === SIDES.RIGHT)
                    ? Point.fromObj({ x: -dir.x, y: dir.y })
                    : Point.fromObj({ x: dir.x, y: -dir.y })
                t += this._getHitMinT(hitpos, dir);
                hitpos = this._getHitPos(hitpos, dir);
                hitside = this._getSideFromPos(hitpos);
            }
            if (t < smallestT) {
                smallestT = t;
                this._targetPos = hitpos[this._movementAxis];
            }
        })
        
        
    }

    setupMove() {
        if (this._aproxCompare(this._targetPos, this.paddle.pos[this._movementAxis], MOV_PRECISION_LVL)) {
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

    private _limits: rectangle;

    private _movementAxis: 'x' | 'y';

    private _targetPos: number;

    private _aproxCompare(n1: number, n2: number, epsilon: number) {
        return (Math.abs(n1 - n2) < epsilon);
    }

    private _mustMoveLeft;

    private _getHitPos(pos: point, dir: point): point {
        const t = [
            dir.x < 0 ? (this._limits.x - pos.x) / dir.x : Infinity, //left
            dir.x > 0 ? (this._limits.x + this._limits.width - pos.x) / dir.x : Infinity, //right
            dir.y < 0 ? (this._limits.y - pos.y) / dir.y : Infinity, //top
            dir.y > 0 ? (this._limits.y + this._limits.height - pos.y) / dir.y : Infinity //bottom
        ]

        let tMin = Math.min(...t);

        return { x: pos.x + dir.x * tMin, y: pos.y + dir.y * tMin }
    }

    private _getHitMinT(pos: point, dir: point) {
        const t = [
            dir.x < 0 ? (this._limits.x - pos.x) / dir.x : Infinity, //left
            dir.x > 0 ? (this._limits.x + this._limits.width - pos.x) / dir.x : Infinity, //right
            dir.y < 0 ? (this._limits.y - pos.y) / dir.y : Infinity, //top
            dir.y > 0 ? (this._limits.y + this._limits.height - pos.y) / dir.y : Infinity //bottom
        ]

        return Math.min(...t);
    }

    private _getSideFromPos(pos: point) {
        const epsilon = 1e-6
        if (this._aproxCompare(pos.x, this._limits.x, epsilon)) {
            return SIDES.LEFT
        } else if (this._aproxCompare(pos.x, this._limits.x + this._limits.width, epsilon)) {
            return SIDES.RIGHT
        } else if (this._aproxCompare(pos.y, this._limits.y, epsilon)) {
            return SIDES.TOP
        } else {
            return SIDES.BOTTOM
        }
    }
}