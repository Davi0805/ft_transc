import Point from "./Point.js";
import { SIDES } from "./sharedTypes.js";

export function computeOrientation(paddleSide: SIDES): Point {
    const sidesToOrientation: Record<SIDES, Point> = {
        [SIDES.LEFT]: new Point(1, 0),
        [SIDES.RIGHT]: new Point(-1, 0),
        [SIDES.BOTTOM]: new Point(0, -1),
        [SIDES.TOP]: new Point(0, 1)
    }
    return sidesToOrientation[paddleSide]
}

export function getRandomInt(min: number, max: number) {
    return Math.floor(Math.random() * (max - min) + min);
}