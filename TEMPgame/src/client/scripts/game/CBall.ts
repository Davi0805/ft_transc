import { Sprite, Point } from "pixi.js";
import CObject from "../../../abstracts/CObject";

export default class CBall extends CObject {
    constructor(pos: Point, sprite: Sprite) {
        super(pos, new Point(1, 0), sprite);
    }
}