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
        console.log("paddle0:")
        console.log(paddle0);
        const paddleConfigs: CPaddleConfigs = {
            ...paddle0,
            speed: 2
        }
        paddleConfigs.pos = targetCoords;
        const paddle: CPaddle = new CPaddle(paddleConfigs, this._root)
        console.log("paddleConfigs:")
        console.log(paddleConfigs)
        console.log("Paddle obj:")
        console.log(paddle)
        this._paddles.set(paddle.id, {
            paddle: paddle,
            moveVector: new Point(50, 0),
            target: targetCoords
        })

        /* paddle.pos = paddle.pos.add(new Point(50, 50)) */
    }

    override tickerUpdate(delta: number, counter: number): void {
        this._paddles.forEach(paddle => {
            console.log(paddle.paddle)
            paddle.paddle.pos = paddle.paddle.pos.add(paddle.moveVector.multiplyScalar(delta));
        })
    }

    private _paddles = new Map<number, {
        paddle: CPaddle,
        moveVector: Point,
        target: point
    }>()
}