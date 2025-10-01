export default class Point {
    constructor(x: number, y: number) {
        this._x = x;
        this._y = y;
    }

    static fromObj(obj: { x: number, y: number }) {
        return new Point(obj.x, obj.y);
    }

    toObj(): { x: number, y: number } {
        return { x: this.x, y: this.y }
    }

    clone(): Point {
        return new Point(this.x, this.y);
    }

    setPoint(x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    setValue(n: number) {
        this.x = n;
        this.y = n;
    }

    add(other: Point): Point {
        return new Point(this.x + other.x, this.y + other.y);
    }

    subtract(other: Point): Point {
        return new Point(this.x - other.x, this.y - other.y);
    }

    normalize(): Point {
        const length = Math.sqrt(this.x * this.x + this.y * this.y);
        if (length === 0) return new Point(0, 0); // Avoid division by zero
        return new Point(this.x / length, this.y / length);
    }

    multiplyScalar(scalar: number): Point {
        return new Point(this.x * scalar, this.y * scalar);
    }

    rotate(degrees: number) {
        const radians = degrees * (Math.PI / 180);
        const cos = Math.cos(radians);
        const sin = Math.sin(radians);
        const x = this.x * cos - this.y * sin;
        const y = this.x * sin + this.y * cos;
        return new Point(x, y);
    }

    isEqual(other: Point) {
        return (this._x === other._x && this._y == other._y)
    }

    isAproxEqual(other: Point, epsylon: number = 0.01) {
        const isXEqual = Math.abs(this._x - other._x) < epsylon;
        const isYEqual = Math.abs(this._y - other._y) < epsylon;
        return isXEqual && isYEqual;
    }


    private _x: number;
    set x(x: number) { this._x = x; }
    get x(): number { return this._x; }

    private _y: number;
    set y(y: number) { this._y = y; }
    get y(): number { return this._y; }
}