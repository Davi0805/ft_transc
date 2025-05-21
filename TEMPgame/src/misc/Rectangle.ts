export default class Rectangle {
    constructor(x: number, y: number, width: number, height: number) {
        this._x = x;
        this._y = y;
        this._width = width;
        this._height = height;
    }

    private _x: number;
    set x(x: number) { this._x = x; }
    get x(): number { return this._x; }

    private _y: number;
    set y(y: number) { this._y = y; }
    get y(): number { return this._y; }

    private _width: number;
    set width(width: number) { this._width = width; }
    get width(): number { return this._width; }

    private _height: number;
    set height(height: number) { this._height = height; }
    get height(): number { return this._height; }
}