import AScene from "../system/AScene";
import { ExampleSceneConfigs } from "../../../misc/types";
import { Assets, Sprite } from "pixi.js";
import { EventBus } from "../system/EventBus";

export default class ExampleScene extends AScene<ExampleSceneConfigs> {
    override async init(configs: ExampleSceneConfigs) {
        this._assets = await Assets.loadBundle("exampleScene");
        
        const exampleSprite = new Sprite(this._assets.example);
        this._root.addChild(exampleSprite);
    }
}