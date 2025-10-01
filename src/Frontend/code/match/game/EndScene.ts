import Point from "../matchSharedDependencies/Point";
import { CEndSceneConfigs } from "../matchSharedDependencies/SetupDependencies";
import { point, SIDES } from "../matchSharedDependencies/sharedTypes";
import AScene from "../system/AScene";
import CNumbersText from "./CNumbersText";
import CPaddle, { CPaddleConfigs } from "./CPaddle";

export default class EndScene extends AScene<CEndSceneConfigs> {
    override async init(endSceneConfigs: CEndSceneConfigs) {
        //no need to load a new bundle, as all assets are already from game scene. Not the greatest of designs

        const ANIMATION_lENGTH = 2 // in seconds
        const fieldSize = endSceneConfigs.fieldSize;
        const targetCoords = [
            { x: fieldSize.x / 2, y: fieldSize.y / 4 },
            { x: fieldSize.x / 4, y: fieldSize.y / 2 },
            { x: fieldSize.x / 4 * 3, y: fieldSize.y / 2 },
            { x: fieldSize.x / 2, y: fieldSize.y / 4 * 3 }
        ]
        const rotationAM: Record<SIDES, number> = {
            [SIDES.LEFT]: -((Math.PI / 2) / ANIMATION_lENGTH),
            [SIDES.TOP]: Math.PI / ANIMATION_lENGTH,
            [SIDES.RIGHT]: (Math.PI / 2 ) / ANIMATION_lENGTH,
            [SIDES.BOTTOM]: 0
        };
        


        for (let i = 0; i < endSceneConfigs.result.length; i++) {
            const place = i+1;
            const side = endSceneConfigs.result[i];
            const paddlesInPlace = endSceneConfigs.paddles.filter(paddle => paddle.side === side);
            paddlesInPlace.forEach(paddle => {
                const paddleConfigs = {
                    ...paddle,
                    speed: 0 // the mov vector is directly calculated, so speed isn't needed
                }
                const paddleTargetPos = Point.fromObj(targetCoords[i]).add(new Point(0, -20));
                const movVector = paddleTargetPos.subtract(Point.fromObj(paddle.pos)).multiplyScalar(1 / ANIMATION_lENGTH)
                const paddleInstance = new CPaddle(paddleConfigs, this._root);
                this._paddles.push({
                    paddle: paddleInstance,
                    movVector: movVector,
                    targetPos: paddleTargetPos,
                    rotateAm: rotationAM[paddle.side]
                })
            })


            this._places.push(new CNumbersText(
                place,
                {
                    position: Point.fromObj(targetCoords[i]).add(new Point(0, 20)),
                    size: 50
                },
                this._root
            ))
        }
    }

    override tickerUpdate(delta: number, counter: number): void {
        this._paddles.forEach(paddleInfo => {
            const paddle = paddleInfo.paddle;
            if (!paddle.pos.isAproxEqual(paddleInfo.targetPos)) {
                paddle.pos = paddle.pos.add(paddleInfo.movVector.multiplyScalar(delta));
            }
            if (!paddle.orientation.isAproxEqual(new Point(0, -1))) {
                paddle.rotate(paddleInfo.rotateAm * delta);
            }
        })

        this._places.forEach(place => {
            
        })
    }

    private _paddles: {
        paddle: CPaddle,
        movVector: Point,
        rotateAm: number
        targetPos: Point
    }[] = [];

    private _places: CNumbersText[] = [];
}