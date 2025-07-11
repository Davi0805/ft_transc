import Point from "../../../shared/Point.js";
import Container from "../system/framework/Container.js";
import { point, SIDES } from "../../../shared/sharedTypes.js";
import { computeOrientation } from "../../../shared/sharedUtils.js";
import CObject from "./CObject.js";

type CPaddleConfigs = {
    id: number,
    side: SIDES,
    pos: point,
    size: point,
    speed: number,
    spriteID: number
}

export default class CPaddle extends CObject {
    constructor(configs: CPaddleConfigs, canvas: Container) {
        const spriteName = "paddle" + configs.spriteID
        super(
            configs.id,
            Point.fromObj(configs.pos),
            Point.fromObj(configs.size),
            computeOrientation(configs.side),
            configs.speed,
            spriteName,
            canvas
        );
    }
}