import Point from "../matchSharedDependencies/Point";
import Container from "../system/framework/Container";
import { point, SIDES } from "../matchSharedDependencies/sharedTypes";
import { computeOrientation } from "../matchSharedDependencies/sharedUtils";
import CObject from "./CObject";

export type CPaddleConfigs = {
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