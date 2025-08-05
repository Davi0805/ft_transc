import { lobbyService } from "../../../services/LobbyService";
import { submitSettings } from "../buttonCallbacks";
import { TDynamicLobbySettings, TLobby } from "../lobbyTyping";
import { getLobbyOptionsHTML } from "../utils/concreteComponents";
import { getButton } from "../utils/stylingComponents";

export abstract class ALobbyRenderer {
    constructor() {}

    renderTitles() {
        const titleElement = document.getElementById('lobby-title') as HTMLElement;
        titleElement.textContent = lobbyService.lobby.name;
        const subtitleElement = document.getElementById('lobby-subtitle') as HTMLElement;
        subtitleElement.textContent = this.subtitleText;
    }

    renderPlayers() {}

    async renderSettings() {
            const lobbySettingsElement = document.getElementById('lobby-settings') as HTMLElement;
            const lobbySettingsListing: TLobby = lobbyService.lobby;
            
            lobbySettingsElement.innerHTML = getLobbyOptionsHTML(false, lobbyService.lobby.type, lobbySettingsListing)
    
            if (lobbyService.amIHost()) {
                const buttonChangeSettings = getButton("btn-change-settings", "button", "Change lobby settings", false);
                buttonChangeSettings.addEventListener('click', () => this._renderChangeSettings(lobbySettingsListing))
                lobbySettingsElement.appendChild(buttonChangeSettings);
            }
        }
    
    renderActionButtons() {

    }

    private _renderChangeSettings(lobbySettingsListing: TDynamicLobbySettings) {
        const lobbySettingsElement = document.getElementById('lobby-settings') as HTMLElement;
        let lobbySettingsHtml = `
            <form id="settings-change-form" class="flex flex-col gap-1">
                ${getLobbyOptionsHTML(true, lobbyService.lobby.type, lobbySettingsListing)}
                ${getButton("apply-lobby-settings", "submit", "Apply", false).outerHTML}
            </div>
        `;
        lobbySettingsElement.innerHTML = lobbySettingsHtml;

        const formChangeSettings = document.getElementById('settings-change-form') as HTMLElement;
        formChangeSettings.addEventListener('submit', submitSettings)
    }

    protected abstract readonly subtitleText: string;
}