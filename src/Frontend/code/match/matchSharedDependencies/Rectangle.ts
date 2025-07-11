import { SIDES } from "./sharedTypes";

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

    // Returns collision wall of this instance
    areColliding(other: Readonly<Rectangle>): SIDES | null {
        const collision = this.x < other.x + other.width
                            && this.x + this.width > other.x
                            && this.y < other.y + other.height
                            && this.y + this.height > other.y
        if (!collision) {
            return null;
        }

        const wallDistances = [
            Math.abs(this.x - (other.x + other.width)),
            Math.abs(this.y - (other.y + other.height)),
            Math.abs((this.x + this.width) - other.x),
            Math.abs((this.y + this.height) - other.y)
        ]
        return wallDistances.indexOf(Math.min(...wallDistances)) as SIDES
    }
}