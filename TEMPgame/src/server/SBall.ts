import ABall from "../abstracts/ABall.js";
import { Point, Rectangle } from "@pixi/math";
import '@pixi/math-extras'
import { getNewPosition } from "../misc/utils.js";


export default class SBall extends ABall {
    constructor(pos: Point, size: number, speed: number, direction: Point) {
        super();
        this._pos = pos;
        this._size = size;
        this._speed = speed;
        this._direction = direction.normalize();
        this._collisionBox = this._calculateCollisionBox();
    }

    move(movVector: Readonly<Point>) {
        this.pos = getNewPosition(this.pos, movVector);
    }

    private _speed: number;
    get speed() {
        return this._speed;
    }
    set speed(value: number) {
        this._speed = value;
    }

    private _direction: Point;
    get direction() {
        return this._direction;
    }
    set direction(value: Point) {
        this._direction = value;
    }

    get pos() {
        return this._pos;
    }
    set pos(value: Point) {
        this._pos = value;
        this._collisionBox = this._calculateCollisionBox();
    }

    private _size: number;

    private _collisionBox: Rectangle;
        get collisionBox() {
            return this._collisionBox;
        }
        set collisionBox(value: Rectangle) {
            this._collisionBox = value;
        }
    private _calculateCollisionBox(): Rectangle {
        return new Rectangle(
            this._pos.x - this._size / 2,
            this._pos.y - this._size / 2,
            this._size,
            this._size
        )
    }
}