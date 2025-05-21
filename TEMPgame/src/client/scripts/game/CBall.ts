import { Sprite } from "pixi.js";
import Point from "../../../misc/Point";
import CObject from "../../../abstracts/CObject";

export default class CBall extends CObject {
    constructor(pos: Point, size: Point, sprite: Sprite) {
        super(pos, size, new Point(1, 0), sprite);
    }
}