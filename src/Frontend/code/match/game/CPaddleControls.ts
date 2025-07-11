import { EventBus } from "../system/EventBus";
import { TControls } from "../matchSharedDependencies/SetupDependencies";
import { TControlsState } from "../matchSharedDependencies/sharedTypes";
import { CGameDTO } from "../matchSharedDependencies/dtos";


export default class CPaddleControls {
    constructor(humanID: number, controls: TControls) {
        this._humanID = humanID;
        this._controlsState = {
            left: { pressed: false },
            right: { pressed: false },
            pause: { pressed: false }
        }
        this._onKeyDown = this._getOnKeyDown(controls); //TODO: Probably should put some of this in the AScene?
        this._onKeyUp = this._getOnKeyUp(controls);
        window.addEventListener("keydown", this._onKeyDown);
        window.addEventListener("keyup", this._onKeyUp);
    }

    destroy() {
        window.removeEventListener("keydown", this._onKeyDown);
        window.removeEventListener("keyup", this._onKeyUp);
    }

    private _humanID: number;
    private _controlsState: TControlsState;
    
    private _onKeyDown!: (event: KeyboardEvent) => void;
    private _getOnKeyDown(controls: TControls) {
        // Callbacks like these must be arrow functions and not methods!
        // This way, if it is needed to use class members (like _keys in this case),
        // the "this" keyword inherits context when passed as callback
        return (event: KeyboardEvent) => {
            
            
            /* if (event.key === "c") { //TODO: TEMPORARY: THIS IS JUST AN EXAMPLE ON HOW TO CHANGE SCENES 
                const detail: SceneChangeDetail =  {
                    sceneName: "exampleScene",
                    configs: {
                    }
                }
                EventBus.dispatchEvent(new CustomEvent("changeScene", { detail: detail}))
                return ;
            } */

            
            let stateChanged = false;
            switch (event.key) {
                case controls.left: {
                    this._controlsState.left.pressed = true;
                    stateChanged = true;
                    break;
                } case controls.right: {
                    this._controlsState.right.pressed = true;
                    stateChanged = true;
                    break;
                } case controls.pause: {
                    this._controlsState.pause.pressed = true;
                    stateChanged = true;
                    break;
                }
            }
            if (stateChanged) {
                const dto: CGameDTO = {
                    controlsState: {humanID: this._humanID, controlsState: this._controlsState}
                }
                EventBus.dispatchEvent(new CustomEvent("sendToServer", { detail: dto}))
            }
        }
    }

    private _onKeyUp!: (event: KeyboardEvent) => void;
    private _getOnKeyUp(controls: TControls) {
        return (event: KeyboardEvent) => {
            let stateChanged = false;
            switch (event.key) {
                case controls.left: {
                    this._controlsState.left.pressed = false;
                    stateChanged = true;
                    break;
                } case controls.right: {
                    this._controlsState.right.pressed = false;
                    stateChanged = true;
                    break;
                } case controls.pause: {
                    this._controlsState.pause.pressed = false;
                    stateChanged = true;
                    break;
                }
            }
            if (stateChanged) {
                const dto: CGameDTO = {
                    controlsState: {humanID: this._humanID, controlsState: this._controlsState}
                }
                EventBus.dispatchEvent(new CustomEvent("sendToServer", { detail: dto}))
            }
        }
    }
}