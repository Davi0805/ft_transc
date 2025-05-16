import { Point } from "@pixi/math";
import { SIDES } from "../misc/types.js";

export default abstract class APaddle {
    constructor(side: SIDES, pos: Point) {
        this._side = side;
        this._pos = pos;
        this._orientation = this._computeOrientation(side);
    }

    protected _side: SIDES;
    get side() {return this._side;}
    set side(side) {this._side = side;}

    protected _pos: Point;
    abstract get pos(): Point;
    abstract set pos(value: Point);

    protected _orientation; // SCREEN ORIENTATION (+y is down)
    get orientation() {return this._orientation;}
    set orientation(value: Point) { this._orientation = value; }

    private _computeOrientation(paddleSide: SIDES): Point {
        const sidesToOrientation = {
            [SIDES.LEFT]: new Point(1, 0),
            [SIDES.RIGHT]: new Point(-1, 0),
            [SIDES.BOTTOM]: new Point(0, -1),
            [SIDES.TOP]: new Point(0, 1)
        }
        return sidesToOrientation[paddleSide]
    }
}