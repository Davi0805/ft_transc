export default class AObject {
    constructor(id, pos, size, speed, orientation) {
        this._id = id;
        this._pos = pos;
        this._size = size;
        this._speed = speed;
        this._orientation = orientation;
    }
    _id;
    get id() { return this._id; }
    _pos;
    set pos(pos) { this._pos = pos; }
    get pos() { return this._pos; }
    _size;
    set size(size) { this._size = size; }
    get size() { return this._size; }
    _speed;
    set speed(speed) { this._speed = speed; }
    get speed() { return this._speed; }
    _orientation;
    set orientation(orientation) { this._orientation = orientation; }
    get orientation() { return this._orientation; }
}
