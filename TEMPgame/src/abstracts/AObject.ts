import { Point } from "@pixi/math"
import "@pixi/math-extras"

export default abstract class AObject {
    constructor (pos: Point, orientation: Point) {
        this._pos = pos;
        this._orientation = orientation;
    }

    protected _pos: Point;
    set pos(pos: Point) {this._pos = pos}
    get pos(): Point {return this._pos}

    protected _orientation: Point;
    set orientation(orientation: Point) {this._orientation = orientation;}
    get orientation(): Point { return this._orientation;}

    move(movVector: Point): void {
        this.pos.add(movVector);
    }
}