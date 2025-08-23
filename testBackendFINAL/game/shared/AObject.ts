import Point from "./Point.js";

export default abstract class AObject {
    constructor (id: number, pos: Point, size: Point, speed: number, orientation: Point) {
        this._id = id;
        this._pos = pos;
        this._size = size;
        this._speed = speed;
        this._orientation = orientation;
    }

    protected _id: number;
    get id(): number { return this._id; }

    protected _pos: Point;
    set pos(pos: Point) {this._pos = pos}
    get pos(): Point { return this._pos}

    protected _size: Point;
    set size(size: Point) {this._size = size;}
    get size(): Point {return this._size;}

    protected _speed: number;
    set speed(speed: number) { this._speed = speed; }
    get speed(): number { return this._speed; }

    protected _orientation: Point;
    set orientation(orientation: Point) {this._orientation = orientation;}
    get orientation(): Point { return this._orientation;}
}