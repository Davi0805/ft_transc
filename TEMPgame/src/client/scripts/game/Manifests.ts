import { AssetsManifest } from "pixi.js"
import { ExampleSceneConfigs, CGameSceneConfigs } from "../../../misc/types"

import AScene from "../system/AScene"
import ExampleScene from "./ExampleScene"
import GameScene from "./GameScene"

export type SceneConfigMap = {
    exampleScene: ExampleSceneConfigs
    gameScene: CGameSceneConfigs
}

// This is how the ScenesManager saves the scenes
export type ScenesManifest = {
    [K in keyof SceneConfigMap]: new () => AScene<SceneConfigMap[K]>
}



export const scenesManifest: ScenesManifest = {
    exampleScene: ExampleScene,
    gameScene: GameScene
}

export const assetsManifest: AssetsManifest = {
    bundles: [
        {
            name: "gameScene",
            assets: [
                {
                    alias: "ball",
                    src: "sprites/ball.png"
                },
                {
                    alias: "paddle",
                    src: "sprites/paddle.png"
                }
            ]
        },
        {
            name: "exampleScene",
            assets: [
                {
                    alias: "example",
                    src: "sprites/example.png"
                }
            ]
        }
    ]
}