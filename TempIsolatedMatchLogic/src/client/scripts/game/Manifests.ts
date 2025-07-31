import { AssetsManifest } from "../system/framework/Assets"
import { CGameSceneConfigs } from "../../setup"

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
                    src: "sprites/ballBasic.png"
                },
                {
                    alias: "ballExpand",
                    src: "sprites/ballExpand.png"
                },
                {
                    alias: "ballShrink",
                    src: "sprites/ballShrink.png"
                },
                {
                    alias: "ballSlowDown",
                    src: "sprites/ballSlowDown.png"
                },
                {
                    alias: "ballSpeedUp",
                    src: "sprites/ballSpeedUp.png"
                },
                {
                    alias: "ballDestroy",
                    src: "sprites/ballDestroy.png"
                },
                {
                    alias: "ballExtraBall",
                    src: "sprites/ballExtraBall.png"
                },
                {
                    alias: "ballMassiveDamage",
                    src: "sprites/ballMassiveDamage.png"
                },
                {
                    alias: "ballMystery",
                    src: "sprites/ballMystery.png"
                },
                {
                    alias: "ballRestore",
                    src: "sprites/ballRestore.png"
                },
                {
                    alias: "paddle0",
                    src: "sprites/paddle0.png"
                },
                {
                    alias: "gameFont",
                    src: "sprites/gameFont.ttf"
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