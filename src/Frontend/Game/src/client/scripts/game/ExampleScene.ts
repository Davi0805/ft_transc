import AScene from "../system/AScene";
import { ExampleSceneConfigs } from "../../../misc/types";
import { Assets, Sprite } from "pixi.js";
import { EventBus } from "../system/EventBus";

export default class ExampleScene extends AScene<ExampleSceneConfigs> {
    override async init(configs: ExampleSceneConfigs) {
        await Assets.loadBundle("exampleScene");
        
        const exampleSprite = Sprite.from("example");
        this._root.addChild(exampleSprite);
    }
}