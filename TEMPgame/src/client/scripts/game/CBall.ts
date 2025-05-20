import { Sprite, Point } from "pixi.js";
import CObject from "../../../abstracts/CObject";

export default class CBall extends CObject {
    constructor(pos: Point, size: Point, sprite: Sprite) {
        super(pos, size, new Point(1, 0), sprite);
    }
}