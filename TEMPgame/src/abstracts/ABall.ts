import { Point } from "pixi.js";

export default abstract class ABall {
    protected _pos: Point = new Point(0, 0);
    abstract get pos(): Point;
    abstract set pos(value: Point);
}