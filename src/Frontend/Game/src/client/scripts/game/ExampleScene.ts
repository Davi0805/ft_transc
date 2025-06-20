import AScene from "../system/AScene";
import Sprite from "../system/framework/Sprite";
import { ExampleSceneConfigs } from "../../../misc/types";
import Assets from "../system/framework/Assets";
import { EventBus } from "../system/EventBus";

export default class ExampleScene extends AScene<ExampleSceneConfigs> {
    override async init(configs: ExampleSceneConfigs) {
        await Assets.loadBundle("exampleScene");
        
        const exampleSprite = Sprite.from("example");
        this._root.addChild(exampleSprite);
    }

    tickerUpdate(delta: number): void {
        
    }
}