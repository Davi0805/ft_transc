import Point from "../misc/Point";

export default abstract class AObject {
    constructor (pos: Point, size: Point, orientation: Point) {
        this._pos = pos;
        this._size = size;
        this._orientation = orientation;
    }

    protected _pos: Point;
    set pos(pos: Point) {this._pos = pos}
    get pos(): Point { return this._pos}

    protected _size: Point;
    set size(size: Point) {this._size = size;}
    get size(): Point {return this._size;}

    protected _orientation: Point;
    set orientation(orientation: Point) {this._orientation = orientation;}
    get orientation(): Point { return this._orientation;}
}