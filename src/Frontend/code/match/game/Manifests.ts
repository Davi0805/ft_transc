import { AssetsManifest } from "../system/framework/Assets"
import { CGameSceneConfigs } from "../matchSharedDependencies/SetupDependencies"

import AScene from "../system/AScene"
import GameScene from "./GameScene"
import { AudioManifestT } from "../system/framework/AudioPlayer"

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
                    alias: "paddle1",
                    src: "Assets/sprites/paddle1.png"
                },
                {
                    alias: "paddle2",
                    src: "Assets/sprites/paddle2.png"
                },
                {
                    alias: "paddle3",
                    src: "Assets/sprites/paddle3.png"
                },
                {
                    alias: "paddle4",
                    src: "Assets/sprites/paddle4.png"
                },
                {
                    alias: "paddle5",
                    src: "Assets/sprites/paddle5.png"
                },
                {
                    alias: "paddle6",
                    src: "Assets/sprites/paddle6.png"
                },
                {
                    alias: "paddle7",
                    src: "Assets/sprites/paddle7.png"
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

export const audioManifest: AudioManifestT = [
    {
        audioName: "start",
        audioTrack: {
            tempoBPM: 60,
            notes: [
                {
                    frequency: 440,
                    startBeat: 1,
                    durationBeats: 0.5
                },
                {
                    frequency: 440,
                    startBeat: 2,
                    durationBeats: 0.5
                },
                {
                    frequency: 440,
                    startBeat: 3,
                    durationBeats: 0.5
                },
                {
                    frequency: 880,
                    startBeat: 4,
                    durationBeats: 1
                }
            ]
        }
    }
]