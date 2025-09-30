import AObject from "../matchSharedDependencies/AObject";
import Point from "../matchSharedDependencies/Point";
import Container from "../system/framework/Container";
import Sprite from "../system/framework/Sprite";
import AAnimation from "./Animations/AAnimation";
import AnimationBad from "./Animations/AnimationBad";
import AnimationGood from "./Animations/AnimationGood";
import AnimationShake from "./Animations/AnimationShake";

export default abstract class CObject extends AObject {
    constructor(id: number, pos: Point, size: Point, orientation: Point,
        speed: number, spriteName: string, canvas: Container) {
        super(id, pos, size, speed, orientation);
        this._sprite = Sprite.from(spriteName);
        this._sprite.anchor.setValue(0.5);
        this._sprite.size.setPoint(size.x, size.y)
        this._sprite.rotation = Math.atan2(this._orientation.y, this._orientation.x);
        this._sprite.position.setPoint(pos.x, pos.y);
        canvas.addChild(this._sprite);
        this._spriteOffset = new Point(0, 0);
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
        const newSpritePos = pos.add(this._spriteOffset);
        this._sprite.position.setPoint(newSpritePos.x, newSpritePos.y);
    }
    override get pos() { return this._pos; }

    protected _sprite: Sprite;
    set sprite(sprite: Sprite) { this._sprite = sprite; }
    get sprite(): Sprite { return this._sprite; }
    
    protected _spriteOffset: Point;
    get spriteOffset(): Point { return this._spriteOffset; }
    set spriteOffset(spriteOffset: Point) { this._spriteOffset = spriteOffset; }

    protected _animations: AAnimation[] = [];

    override set size(size: Point) {
        if (!this._size.isEqual(size)) {
            this._animations.push((size.y < this._size.y)
                ? new AnimationBad(this)
                : new AnimationGood(this));
            super.size = size;
            this._sprite.size.setPoint(size.x, size.y);
        }
    }
    override get size() {
        return super.size;
    }
    
    override set speed(speed: number) {
        if (speed != this._speed) {
            this._animations.push((speed < this._speed)
                ? new AnimationBad(this)
                : new AnimationGood(this));
            this._animations.push(new AnimationShake(this))
            super.speed = speed;
        }
    }
}