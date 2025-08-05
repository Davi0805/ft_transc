import { lobbyService } from "../../services/LobbyService";
import { TDuration, TMap, TMode } from "./lobbyTyping";

export async function submitSettings(e: SubmitEvent) {
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