import AObject from "./AObject.js";
import { Point, Rectangle } from "@pixi/math";
import '@pixi/math-extras'

export default abstract class SObject extends AObject {
    constructor(pos: Point, orientation: Point, size: Point, speed: number) {
        super(pos, orientation);
        this._size = size;
        this._cbox = this._calculateCBox();
        this._speed = speed;
    }

    override move(movVector: Point) {
        super.move(movVector);
        this._calculateCBox();
    }

    protected _size: Point;
    set size(size: Point) {
        this._size = size;
    }
    get size(): Point {
        return this._size;
    }

    protected _cbox: Rectangle;
    set cbox(cbox: Rectangle) {
        this._cbox = cbox
    }
    get cbox(): Rectangle {
        return this._cbox;
    }

    protected _speed: number;
    set speed(speed: number) {this._speed = speed;}
    get speed(): number { return this._speed;}

    _calculateCBox(): Rectangle {
            let collisionBox: Rectangle;
            if (this._orientation.x != 0) { // If it is oriented to the right or left
                collisionBox = new Rectangle( 
                    this._pos.x - this._size.x / 2,
                    this._pos.y - this._size.y / 2,
                    this._size.x,
                    this._size.y);
            } else {
                collisionBox = new Rectangle( 
                    this._pos.x - this._size.y / 2,
                    this._pos.y - this._size.x / 2,
                    this._size.y,
                    this._size.x);
            }
            return collisionBox;
        }
}