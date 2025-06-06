import { SIDES } from "./types.js";
import Point from "./Point.js";

export function getRelativeSide(side: SIDES, relationship: 'left' | 'right' | 'opposite'): SIDES {
    switch (relationship) {
        case 'left': return (side + 1) % 4;
        case 'opposite': return (side + 2) % 4;
        case 'right': return (side + 3) % 4;
    }
}

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