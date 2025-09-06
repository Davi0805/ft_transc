export default class Rectangle {
    constructor(x, y, width, height) {
        this._x = x;
        this._y = y;
        this._width = width;
        this._height = height;
    }
    _x;
    set x(x) { this._x = x; }
    get x() { return this._x; }
    _y;
    set y(y) { this._y = y; }
    get y() { return this._y; }
    _width;
    set width(width) { this._width = width; }
    get width() { return this._width; }
    _height;
    set height(height) { this._height = height; }
    get height() { return this._height; }
    // Returns collision wall of this instance
    areColliding(other) {
        const collision = this.x < other.x + other.width
            && this.x + this.width > other.x
            && this.y < other.y + other.height
            && this.y + this.height > other.y;
        if (!collision) {
            return null;
        }
        const wallDistances = [
            Math.abs(this.x - (other.x + other.width)),
            Math.abs(this.y - (other.y + other.height)),
            Math.abs((this.x + this.width) - other.x),
            Math.abs((this.y + this.height) - other.y)
        ];
        return wallDistances.indexOf(Math.min(...wallDistances));
    }
}
