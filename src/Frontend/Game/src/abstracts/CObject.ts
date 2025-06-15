import AObject from "./AObject.js";
import Point from "../misc/Point.js";
import { Container, Sprite } from "pixi.js";
import AAnimation from "../client/scripts/game/Animations/AAnimation.js";
import AnimationBad from "../client/scripts/game/Animations/AnimationBad.js";
import AnimationGood from "../client/scripts/game/Animations/AnimationGood.js";
import AnimationShake from "../client/scripts/game/Animations/AnimationShake.js";

export default abstract class CObject extends AObject {
    constructor(id: number, pos: Point, size: Point, orientation: Point,
        speed: number, spriteName: string, canvas: Container) {
        super(id, pos, size, speed, orientation);
        this._sprite = Sprite.from(spriteName);
        this._sprite.anchor.set(0.5);
        this._sprite.setSize(size.x, size.y)
        this._sprite.rotation = Math.atan2(this._orientation.y, this._orientation.x);
        this._sprite.position.set(pos.x, pos.y);
        canvas.addChild(this._sprite);
    }

    updateAnimations() { 
        for (let i = this._animations.length - 1; i >= 0; i--) {
            const animation = this._animations[i];
            animation.update();
            if (animation.isDone) {
                this._animations.splice(i, 1);
            }
        }
    }

    override set pos(pos: Point) {
        super.pos = pos;
        this._sprite.position.set(pos.x, pos.y);
    }

    protected _sprite: Sprite;
    set sprite(sprite: Sprite) {
        this._sprite = sprite;
    }
    get sprite(): Sprite {
        return this._sprite;
    }

    protected _animations: AAnimation[] = [];

    override set size(size: Point) {
        if (!this._size.isEqual(size)) {
            this._animations.push((size.y < this._size.y)
                ? new AnimationBad(this._sprite)
                : new AnimationGood(this._sprite));
            super.size = size;
            this._sprite.setSize(size.x, size.y);
        }
    }
    override get size() {
        return super.size;
    }
    
    override set speed(speed: number) {
        if (speed != this._speed) {
            this._animations.push((speed < this._speed)
                ? new AnimationBad(this._sprite)
                : new AnimationGood(this._sprite));
            this._animations.push(new AnimationShake(this._sprite))
            super.speed = speed;
        }
    }
}