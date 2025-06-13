import { Container, Sprite } from "pixi.js";
import Point from "../../../misc/Point";
import CObject from "../../../abstracts/CObject";

export default class CBall extends CObject {
    constructor(id: number, pos: Point, size: Point, spriteName: string, canvas: Container) {
        super(id, pos, size, new Point(1, 0), spriteName, canvas);
    }
}