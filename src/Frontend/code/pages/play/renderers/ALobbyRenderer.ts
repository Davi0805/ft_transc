import { lobbyService } from "../../../services/LobbyService";
import { applySettingsClicked, changeSettingsClicked, inviteUserClicked, leaveClicked, readyClicked, startClicked } from "../buttonCallbacks";
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
            buttonChangeSettings.addEventListener('click', () => changeSettingsClicked(lobbySettingsListing))
            lobbySettingsElement.appendChild(buttonChangeSettings);
        }
    }
    
    async renderActionButtons() {
        const buttonsDiv = document.getElementById("lobby-buttons") as HTMLElement;

        const inviteButton = getButton("btn-invite", "button", "Invite");
        inviteButton.addEventListener('click', () => inviteUserClicked(1)) //TODO: "1" is hardcoded. Find a way to invite specific user
        buttonsDiv.appendChild(inviteButton);

        const leaveButton = getButton("btn-leave", "button", "Leave");
        leaveButton.addEventListener('click', () => leaveClicked());
        buttonsDiv.appendChild(leaveButton);

        const readyButton = getButton("btn-ready", "button", "Ready");
        readyButton.addEventListener('click', () => readyClicked(readyButton))
        buttonsDiv.appendChild(readyButton);

        if (lobbyService.amIHost()) {
            const startButton = getButton("btn-start", "button", "Start");
            startButton.addEventListener('click', () => startClicked(startButton))
            buttonsDiv.appendChild(startButton);
        }
    }

    renderChangeSettings(lobbySettingsListing: TDynamicLobbySettings) {
        const lobbySettingsElement = document.getElementById('lobby-settings') as HTMLElement;
        let lobbySettingsHtml = `
            <form id="settings-change-form" class="flex flex-col gap-1">
                ${getLobbyOptionsHTML(true, lobbyService.lobby.type, lobbySettingsListing)}
                ${getButton("apply-lobby-settings", "submit", "Apply", false).outerHTML}
            </div>
        `;
        lobbySettingsElement.innerHTML = lobbySettingsHtml;

        const formChangeSettings = document.getElementById('settings-change-form') as HTMLElement;
        formChangeSettings.addEventListener('submit', (e: SubmitEvent) => applySettingsClicked(e))
    }

    protected abstract readonly subtitleText: string;
}