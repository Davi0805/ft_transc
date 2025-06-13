/* import { TControls } from "../../../misc/types";

export function _getOnKeyUp = (controlsMap: Map<number, TControls>) => {
        return (event: KeyboardEvent) => {
            controlsMap.forEach((controls, id) => {
                const specificControlsState = this.controlsState.get(id);
                if (specificControlsState === undefined) {
                    throw new Error(`This client cannot find the controlsState of the human with ID ${id}`)
                }
                let stateChanged = false;
                switch (event.key) {
                    case controls.left: {
                        specificControlsState.left.pressed = false;
                        stateChanged = true;
                        break;
                    } case controls.right: {
                        specificControlsState.right.pressed = false;
                        stateChanged = true;
                        break;
                    } case controls.pause: {
                        specificControlsState.pause.pressed = false;
                        stateChanged = true;
                        break;
                    }
                }
                if (stateChanged) {
                    const dto: CGameDTO = {
                        controlsState: {humanID: id, controlsState: specificControlsState}
                    }
                    EventBus.dispatchEvent(new CustomEvent("sendToServer", { detail: dto}))
                }
            })
        }
    } */