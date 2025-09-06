import AObject from "../shared/AObject.js";
import Rectangle from "../shared/Rectangle.js";
export default class SObject extends AObject {
    constructor(id, pos, orientation, size, speed) {
        super(id, pos, size, speed, orientation);
        this._size = size;
        this._cbox = this._calculateCBox();
    }
    set pos(pos) {
        super.pos = pos;
        this.cbox = this._calculateCBox();
    }
    get pos() { return super.pos; }
    set size(size) {
        super.size = size;
        this.cbox = this._calculateCBox();
    }
    get size() { return super.size; }
    _cbox;
    set cbox(cbox) {
        this._cbox = cbox;
    }
    get cbox() {
        return this._cbox;
    }
    _calculateCBox() {
        let collisionBox;
        if (this._orientation.x != 0) { // If it is oriented to the right or left
            collisionBox = new Rectangle(this._pos.x - this._size.x / 2, this._pos.y - this._size.y / 2, this._size.x, this._size.y);
        }
        else {
            collisionBox = new Rectangle(this._pos.x - this._size.y / 2, this._pos.y - this._size.x / 2, this._size.y, this._size.x);
        }
        return collisionBox;
    }
}
