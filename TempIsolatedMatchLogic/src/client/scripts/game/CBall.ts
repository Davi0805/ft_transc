import Point from "../../../shared/Point";
import Container from "../system/framework/Container";
import CObject from "./CObject";
import { point, BALL_TYPES } from "../../../shared/sharedTypes.js";

const TypeSpriteMap: Record<BALL_TYPES, string> = {
    [BALL_TYPES.BASIC]: "ballBasic",
    [BALL_TYPES.EXPAND]: "ballExpand",
    [BALL_TYPES.SHRINK]: "ballShrink",
    [BALL_TYPES.SPEED_UP]: "ballSpeedUp",
    [BALL_TYPES.SLOW_DOWN]: "ballSlowDown",
    [BALL_TYPES.EXTRA_BALL]: "ballExtraBall",
    [BALL_TYPES.RESTORE]: "ballRestore",
    [BALL_TYPES.DESTROY]: "ballDestroy",
    [BALL_TYPES.MASSIVE_DAMAGE]: "ballMassiveDamage",
    [BALL_TYPES.MYSTERY]: "ballMystery",
    [BALL_TYPES.BALL_TYPE_AM]: "ballUnknown" 
}

type CBallConfigs = {
    id: number,
    pos: point,
    size: point,
    speed: number,
    type: BALL_TYPES
}

export default class CBall extends CObject {
    constructor(configs: CBallConfigs, canvas: Container) {
        super(
            configs.id, 
            Point.fromObj(configs.pos),
            Point.fromObj(configs.size), 
            new Point(1, 0),
            configs.speed,
            TypeSpriteMap[configs.type],
            canvas
        );
    }
}