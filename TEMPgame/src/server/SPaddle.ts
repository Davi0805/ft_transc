import APaddle from "../abstracts/APaddle.js";
import { Point, Rectangle } from "@pixi/math"
import { SIDES } from "../misc/types.js";

export default class SPaddle extends APaddle {
    constructor(side: SIDES, pos: Point, size: Point, speed: number) {
        super(side, pos);
        this._speed = speed;
        this._size = size;
        this._collisionBox = this.calculateCollisionBox();
    }

    move(movVector: Point) { //TODO probably the add method can be used
        let newPos = this.pos;
        newPos.x += movVector.x;
        newPos.y += movVector.y;
        this.pos = newPos;
    }

    private _speed: number;
    get speed() {
        return this._speed;
    }
    set speed(value: number) {
        this._speed = value;
    }

    private _size: Point;

    private _collisionBox: Rectangle;
    get collisionBox() {
        return this._collisionBox;
    }
    set collisionBox(value: Rectangle) {
        this._collisionBox = value;
    }
    calculateCollisionBox(): Rectangle {
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

    get pos() {
        return this._pos;
    }
    set pos(value: Point) {
        this._pos = value;
        this.collisionBox = this.calculateCollisionBox();
    }
}