import Point from "../../../misc/Point.js";
import { point, SIDES } from "../../../misc/types.js";
import { computeOrientation } from "../../../misc/utils.js";
import { Container } from "pixi.js";
import CObject from "../../../abstracts/CObject.js";

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