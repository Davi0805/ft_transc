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
                    alias: "ball0",
                    src: "./Game/public/sprites/ball0.png"
                },
                {
                    alias: "ball1",
                    src: "./Game/public/sprites/ball1.png"
                },
                {
                    alias: "paddle0",
                    src: "./Game/public/sprites/paddle0.png"
                },
                {
                    alias: "paddle1",
                    src: "./Game/public/sprites/paddle1.png"
                },
                {
                    alias: "scoreFont",
                    src: "./Game/public/sprites/scoreFont.ttf"
                }
            ]
        },
        {
            name: "exampleScene",
            assets: [
                {
                    alias: "example",
                    src: "./Game/public/sprites/example.png"
                }
            ]
        }
    ]
}