import { Point, Rectangle } from "@pixi/math"
import '@pixi/math-extras'
import { SIDES } from "./types.js";

// Returns the wall of the FIRST rect that collides with the second rect
export function areColliding(rect1: Readonly<Rectangle>, rect2: Readonly<Rectangle>): SIDES | null{
    const collision = rect1.x < rect2.x + rect2.width
                        && rect1.x + rect1.width > rect2.x
                        && rect1.y < rect2.y + rect2.height
                        && rect1.y + rect1.height > rect2.y
    if (!collision) {
        return null;
    }

    const wallDistances = [
        Math.abs(rect1.x - (rect2.x + rect2.width)),
        Math.abs((rect1.x + rect1.width) - rect2.x),
        Math.abs(rect1.y - (rect2.y + rect2.height)),
        Math.abs((rect1.y + rect1.height) - rect2.y)
    ]
    return wallDistances.indexOf(Math.min(...wallDistances))
}

export function getNewPosition(pos: Readonly<Point>, movVector: Readonly<Point>) {
    const newPos = pos.clone()
    newPos.x += movVector.x;
    newPos.y += movVector.y;
    return newPos;
}

export function rotatePoint(point: Point, angleInDegrees: number): Point {
    const angleInRadians = (angleInDegrees * Math.PI) / 180; // Convert degrees to radians
    const cos = Math.cos(angleInRadians);
    const sin = Math.sin(angleInRadians);

    const rotatedX = point.x * cos - point.y * sin;
    const rotatedY = point.x * sin + point.y * cos;

    return new Point(rotatedX, rotatedY);
}

export function computeOrientation(paddleSide: SIDES): Point {
    const sidesToOrientation = {
        [SIDES.LEFT]: new Point(1, 0),
        [SIDES.RIGHT]: new Point(-1, 0),
        [SIDES.BOTTOM]: new Point(0, -1),
        [SIDES.TOP]: new Point(0, 1)
    }
    return sidesToOrientation[paddleSide]
}