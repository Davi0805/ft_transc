import AObject from "./AObject.js";
import Point from "../misc/Point.js";
import Rectangle from "../misc/Rectangle.js";

export default abstract class SObject extends AObject {
    constructor(id: number, pos: Point, orientation: Point, size: Point, speed: number) {
        super(id, pos, size, orientation);
        this._size = size;
        this._cbox = this._calculateCBox();
        this._speed = speed;
    }

    move(movVector: Point) {
        this.pos = this.pos.add(movVector)
    }

    override set pos(pos: Point) {
        super.pos = pos;
        this.cbox = this._calculateCBox();
    }
    override get pos() { return super.pos; }

    override set size(size: Point) {
        super.size = size;
        this.cbox = this._calculateCBox();
    }
    override get size(): Point { return super.size; }

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