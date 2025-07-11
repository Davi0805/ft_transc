import { AssetsManifest } from "../system/framework/Assets"
import { CGameSceneConfigs } from "../setup"

import AScene from "../system/AScene"
import GameScene from "./GameScene"

export type SceneConfigMap = {
    gameScene: CGameSceneConfigs
}

// This is how the ScenesManager saves the scenes
export type ScenesManifest = {
    [K in keyof SceneConfigMap]: new () => AScene<SceneConfigMap[K]>
}



export const scenesManifest: ScenesManifest = {
    gameScene: GameScene
}

export const assetsManifest: AssetsManifest = {
    bundles: [
        {
            name: "gameScene",
            assets: [
                {
                    alias: "ballBasic",
                    src: "Assets/sprites/ballBasic.png"
                },
                {
                    alias: "ballExpand",
                    src: "Assets/sprites/ballExpand.png"
                },
                {
                    alias: "ballShrink",
                    src: "Assets/sprites/ballShrink.png"
                },
                {
                    alias: "ballSlowDown",
                    src: "Assets/sprites/ballSlowDown.png"
                },
                {
                    alias: "ballSpeedUp",
                    src: "Assets/sprites/ballSpeedUp.png"
                },
                {
                    alias: "ballDestroy",
                    src: "Assets/sprites/ballDestroy.png"
                },
                {
                    alias: "ballExtraBall",
                    src: "Assets/sprites/ballExtraBall.png"
                },
                {
                    alias: "ballMassiveDamage",
                    src: "Assets/sprites/ballMassiveDamage.png"
                },
                {
                    alias: "ballMystery",
                    src: "Assets/sprites/ballMystery.png"
                },
                {
                    alias: "ballRestore",
                    src: "Assets/sprites/ballRestore.png"
                },
                {
                    alias: "paddle0",
                    src: "Assets/sprites/paddle0.png"
                },
                {
                    alias: "gameFont",
                    src: "Assets/sprites/gameFont.ttf"
                }
            ]
        },
        {
            name: "exampleScene",
            assets: [
                {
                    alias: "example",
                    src: "sprites/paddle0.png"
                }
            ]
        }
    ]
}