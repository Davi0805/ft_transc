import { SIDES } from "../matchSharedDependencies/sharedTypes";
import AnimationBad from "./Animations/AnimationBad";
import AnimationGood from "./Animations/AnimationGood";
import AnimationScaleUp from "./Animations/AnimationScaleUp";
import AnimationShake from "./Animations/AnimationShake";
import CNumbersText from "./CNumbersText";

export default class CTeam {
    constructor(side: SIDES, score: CNumbersText) {
        this._side = side;
        this._hp = score;
        this._state = "calm";
    }

    update(newHP: number) {
        if (this._hp.value !== newHP) {
            this.hp.addAnimations([
                (this.hp.value > newHP) ? AnimationBad : AnimationGood,
                AnimationShake,
                AnimationScaleUp
            ])
            this.hp.value = newHP;
        }
    }

    private _side: SIDES
    get side(): SIDES { return this._side; }

    private _hp: CNumbersText
    set hp(hp: CNumbersText) { this._hp = hp; }
    get hp(): CNumbersText { return this._hp; }

    private _state: "calm" | "scared";
    set state(state: "calm" | "scared") {
        this._state = state;
        if (state === "scared") {
            this.hp.addAnimations([
                AnimationShake
            ], true);
            this.hp.sprite.tint = 0xFFFF00;
        }
    }
    get state() { return this._state; }
}