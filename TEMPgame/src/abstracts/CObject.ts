import AObject from "./AObject.js";
import { Point } from "@pixi/math";
import '@pixi/math-extras'
import { Sprite } from "pixi.js";

export default abstract class CObject extends AObject {
    constructor(pos: Point, orientation: Point, sprite: Sprite) {
        super(pos, orientation);
        this._sprite = sprite;
        this._sprite.anchor.set(0.5);
        this._sprite.position.set(pos.x, pos.y);
        this._sprite.rotation = Math.atan2(this._orientation.y, this._orientation.x);
    }

    override move(movVector: Point): void {
        super.move(movVector);
        this.sprite.position.set(this.pos.x, this.pos.y)
    }

    protected _sprite: Sprite;
    set sprite(sprite: Sprite) {
        this._sprite = sprite;
    }
    get sprite(): Sprite {
        return this._sprite;
    }
}