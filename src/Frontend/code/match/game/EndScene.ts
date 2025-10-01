import Point from "../matchSharedDependencies/Point";
import { CEndSceneConfigs } from "../matchSharedDependencies/SetupDependencies";
import { point } from "../matchSharedDependencies/sharedTypes";
import AScene from "../system/AScene";
import CNumbersText from "./CNumbersText";
import CPaddle, { CPaddleConfigs } from "./CPaddle";

export default class EndScene extends AScene<CEndSceneConfigs> {
    override async init(endSceneConfigs: CEndSceneConfigs) {
        //no need to load a new bundle, as all assets are already from game scene. Not the greatest of designs

        const fieldSize = endSceneConfigs.fieldSize;
        const targetCoords = [
            { x: fieldSize.x / 2, y: fieldSize.y / 4 },
            { x: fieldSize.x / 4, y: fieldSize.y / 2 },
            { x: fieldSize.x / 4 * 3, y: fieldSize.y / 2 },
            { x: fieldSize.x / 2, y: fieldSize.y / 4 * 3 }
        ]


        for (let i = 0; i < endSceneConfigs.result.length; i++) {
            const place = i+1;
            const side = endSceneConfigs.result[i];
            const paddlesInPlace = endSceneConfigs.paddles.filter(paddle => paddle.side === side);
            paddlesInPlace.forEach(paddle => {
                const paddleConfigs = {
                    ...paddle,
                    speed: 0 // the mov vector is directly calculated, so speed isn't needed
                }
                const movVector = Point.fromObj(targetCoords[i]).subtract(Point.fromObj(paddle.pos)).multiplyScalar(1/2) //The divisor is the number of seconds it takes to get from pos to target
                this._paddles.push({
                    paddle: new CPaddle(paddleConfigs, this._root),
                    movVector: movVector,
                    targetPos: targetCoords[i],
                    rotateVector: new Point(1, 0) //TODO
                })
            })


            this._places.push(new CNumbersText(
                place,
                {
                    position: targetCoords[i],
                    size: 50
                },
                this._root
            ))
        }
    }

    override tickerUpdate(delta: number, counter: number): void {
        this._paddles.forEach(paddle => {
            console.log(paddle.paddle)
            if (!paddle.paddle.pos.isAproxEqual(Point.fromObj(paddle.targetPos))) {
                paddle.paddle.pos = paddle.paddle.pos.add(paddle.movVector.multiplyScalar(delta));
            }
        })

        this._places.forEach(place => {
            
        })
    }

    private _paddles: {
        paddle: CPaddle,
        movVector: Point,
        rotateVector: Point
        targetPos: point
    }[] = [];

    private _places: CNumbersText[] = [];
}