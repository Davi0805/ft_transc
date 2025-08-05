import { router } from "../../routes/router";
import { lobbyService } from "../../services/LobbyService";
import { LobbyPage } from "./lobby";
import { TDuration, TDynamicLobbySettings, TMap, TMode } from "./lobbyTyping";
import { areAllSlotsFull } from "./utils/helpers";
import { flashButton, toggleButton } from "./utils/stylingComponents";

export function changeSettingsClicked(lobbySettingsListing: TDynamicLobbySettings) {
    LobbyPage.renderer?.renderChangeSettings(lobbySettingsListing)
}

export function applySettingsClicked(e: SubmitEvent) {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);

    lobbyService.updateSettingsIN({
        map: formData.get('match-map') as TMap,
        mode: formData.get('match-mode') as TMode,
        duration: formData.get('match-duration') as TDuration
    })
    console.log("New settings applied!")
}

export function inviteUserClicked(inviteeID: number) {
    lobbyService.inviteUserToLobby(inviteeID)
}

export function leaveClicked() {
    lobbyService.leave()
    router.navigateTo('/play')
}

export function readyClicked(readyButton: HTMLButtonElement) {
    if (!lobbyService.isUserParticipating(lobbyService.myID)) {
        flashButton(readyButton, "You must join first!")
    } else {
        const state = toggleButton(readyButton, "I'm ready! (cancel...)", "Ready");
        lobbyService.updateReadinessIN(state);
    }
}

export function startClicked(startButton: HTMLButtonElement) {
    if (!lobbyService.isEveryoneReady()) {
        flashButton(startButton, "Not everyone is ready!");
    } else if (lobbyService._isLobbyOfType("ranked") && !areAllSlotsFull(lobbyService.getSlots())) {
        flashButton(startButton, "Not all slots are filled!")
    } else {        
        lobbyService.startMatchIN();
    }
}