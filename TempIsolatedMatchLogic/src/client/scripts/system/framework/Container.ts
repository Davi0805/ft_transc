import Point from "../../../../misc/Point";



export default class Container {
    constructor() {
        this._position = new Point(0, 0);
        this._size = new Point(0, 0);
        this._rotation = 0;
        this._scale = 1;
        this._pivot = new Point(0, 0);
        this._alpha = 1;
        this._tint = 0xFFFFFF
    }

    destroy() {
        this.removeChildren();
    }

    addChild(child: Container) {
        this._children.push(child);
    }

    removeChild(child: Container) {
        for (let i = this._children.length; i >= 0; i--) {
            if (this._children[i] === child) {
                this._children.splice(i, 1);
                return;
            }
        }
    }

    removeChildren() {
        this._children.forEach(child => {
            child.removeChildren();
        })
        this._children = [];
    }

    private _children: Container[] = [];
    get children(): Container[] { return this._children; }

    private _position: Point;
    get position(): Point { return this._position; }
    set position(position: Point) { this._position = position; }

    private _size: Point;
    get size(): Point { return this._size; }
    set size(size: Point) { this._size = this.size; }

    private _rotation: number;
    get rotation(): number { return this._rotation; }
    set rotation(rotation: number) { this._rotation = rotation; }

    private _scale: number;
    get scale(): number { return this._scale; }
    set scale(scale: number) { this._scale = scale; }

    private _pivot: Point
    get pivot(): Point { return this._pivot; }
    set pivot(pivot: Point) { this._pivot = pivot; }

    private _alpha: number;
    get alpha(): number {return this._alpha; }
    set alpha(alpha: number) { this._alpha = alpha; }

    private _tint: number;
    get tint() { return this._tint; }
    set tint(tint: number) { this._tint = tint; }
}