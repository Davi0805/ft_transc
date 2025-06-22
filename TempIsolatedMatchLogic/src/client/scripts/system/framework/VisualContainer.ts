import Container from "./Container";
import Point from "../../../../misc/Point";

export default abstract class VisualContainer extends Container {
    constructor() {
        super()
        this._anchor = new Point(0, 0);
    }

    private _anchor: Point;
    set anchor(anchor: Point) { this._anchor = anchor}
    get anchor(): Point { return this._anchor; }
}