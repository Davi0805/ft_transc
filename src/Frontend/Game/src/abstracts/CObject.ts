import AObject from "./AObject.js";
import Point from "../misc/Point.js";
import { Sprite } from "pixi.js";

export default abstract class CObject extends AObject {
    constructor(id: number, pos: Point, size: Point, orientation: Point, sprite: Sprite) {
        super(id, pos, size, orientation);
        this._sprite = sprite;
        this._sprite.anchor.set(0.5);
        this._sprite.setSize(size.x, size.y)
        this._sprite.rotation = Math.atan2(this._orientation.y, this._orientation.x);
        this._sprite.position.set(pos.x, pos.y);
    }

    override set pos(pos: Point) {
        super.pos = pos;
        this._sprite.position.set(pos.x, pos.y);
    }
    override get pos(): Point { return super.pos;}

    protected _sprite: Sprite;
    set sprite(sprite: Sprite) {
        this._sprite = sprite;
    }
    get sprite(): Sprite {
        return this._sprite;
    }

    override set size(size: Point) {
        super.size = size;
        this._sprite.setSize(size.x, size.y);
    }
    override get size() {
        return super.size;
    }
}