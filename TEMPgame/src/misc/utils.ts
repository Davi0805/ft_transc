import { SIDES, Rectangle} from "./types.js";
import Point from "./Point.js";

// Returns the wall of the FIRST rect that collides with the second rect
/* export function areColliding(rect1: Readonly<Rectangle>, rect2: Readonly<Rectangle>): SIDES | null{ // TODO add this to the rectangle class
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
} */

export function computeOrientation(paddleSide: SIDES): Point {
    const sidesToOrientation: Record<SIDES, Point> = {
        [SIDES.LEFT]: new Point(1, 0),
        [SIDES.RIGHT]: new Point(-1, 0),
        [SIDES.BOTTOM]: new Point(0, -1),
        [SIDES.TOP]: new Point(0, 1)
    }
    return sidesToOrientation[paddleSide]
}