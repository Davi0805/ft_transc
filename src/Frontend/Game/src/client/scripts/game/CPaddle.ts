import Point from "../../../misc/Point.js";
import { SIDES } from "../../../misc/types.js";
import { computeOrientation } from "../../../misc/utils.js";
import { Container } from "pixi.js";
import CObject from "../../../abstracts/CObject.js";


export default class CPaddle extends CObject {
    constructor(id: number, side: SIDES, pos: Point, size: Point, spriteName: string, canvas: Container) {
        super(id, pos, size, computeOrientation(side), spriteName, canvas);
    }
}