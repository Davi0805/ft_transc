import { CEndSceneConfigs } from "../matchSharedDependencies/SetupDependencies";
import AScene from "../system/AScene";
import CPaddle, { CPaddleConfigs } from "./CPaddle";

export default class EndScene extends AScene<CEndSceneConfigs> {
    override async init(endSceneConfigs: CEndSceneConfigs) {
        //no need to load a new bundle, as all assets are already from game scene. Not the greatest of designs

        const targetCoords = {
            x: endSceneConfigs.fieldSize.x / 2,
            y: endSceneConfigs.fieldSize.y / 2
        }

        console.log(targetCoords)

        const paddle0 = endSceneConfigs.paddles[0];
        const paddleConfigs: CPaddleConfigs = {
            ...paddle0,
            speed: 2
        }
        paddleConfigs.pos = targetCoords
        const paddle: CPaddle = new CPaddle(paddleConfigs, this._root)
    }

    override tickerUpdate(delta: number, counter: number): void {
        
    }
}