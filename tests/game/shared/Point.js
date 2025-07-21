export default class Point {
    constructor(x, y) {
        this._x = x;
        this._y = y;
    }
    static fromObj(obj) {
        return new Point(obj.x, obj.y);
    }
    toObj() {
        return { x: this.x, y: this.y };
    }
    clone() {
        return new Point(this.x, this.y);
    }
    setPoint(x, y) {
        this.x = x;
        this.y = y;
    }
    setValue(n) {
        this.x = n;
        this.y = n;
    }
    add(other) {
        return new Point(this.x + other.x, this.y + other.y);
    }
    normalize() {
        const length = Math.sqrt(this.x * this.x + this.y * this.y);
        if (length === 0)
            return new Point(0, 0); // Avoid division by zero
        return new Point(this.x / length, this.y / length);
    }
    multiplyScalar(scalar) {
        return new Point(this.x * scalar, this.y * scalar);
    }
    rotate(degrees) {
        const radians = degrees * (Math.PI / 180);
        const cos = Math.cos(radians);
        const sin = Math.sin(radians);
        const x = this.x * cos - this.y * sin;
        const y = this.x * sin + this.y * cos;
        return new Point(x, y);
    }
    isEqual(other) {
        return (this._x === other._x && this._y == other._y);
    }
    _x;
    set x(x) { this._x = x; }
    get x() { return this._x; }
    _y;
    set y(y) { this._y = y; }
    get y() { return this._y; }
}
