import Point from "../matchSharedDependencies/Point";
import { CEndSceneConfigs } from "../matchSharedDependencies/SetupDependencies";
import { point } from "../matchSharedDependencies/sharedTypes";
import AScene from "../system/AScene";
import CPaddle, { CPaddleConfigs } from "./CPaddle";

export default class EndScene extends AScene<CEndSceneConfigs> {
    override async init(endSceneConfigs: CEndSceneConfigs) {
        //no need to load a new bundle, as all assets are already from game scene. Not the greatest of designs

        const targetCoords = {
            x: endSceneConfigs.fieldSize.x / 2,
            y: endSceneConfigs.fieldSize.y / 2
        }
        const paddle0 = endSceneConfigs.paddles[0];

        const moveVector = Point.fromObj(targetCoords).subtract(Point.fromObj(paddle0.pos)).multiplyScalar(1/2);

        const paddleConfigs: CPaddleConfigs = {
            ...paddle0,
            speed: 2
        }
        const paddle: CPaddle = new CPaddle(paddleConfigs, this._root)
        this._paddles.set(paddle.id, {
            paddle: paddle,
            moveVector: moveVector,
            rotateVector: new Point(1, 0),
            target: targetCoords
        })

    }

    override tickerUpdate(delta: number, counter: number): void {
        this._paddles.forEach(paddle => {
            console.log(paddle.paddle)
            if (!paddle.paddle.pos.isAproxEqual(Point.fromObj(paddle.target))) {
                paddle.paddle.pos = paddle.paddle.pos.add(paddle.moveVector.multiplyScalar(delta));
            }
        })
    }

    private _paddles = new Map<number, {
        paddle: CPaddle,
        moveVector: Point,
        rotateVector: Point
        target: point
    }>()
}