import { lobbyService } from "../../../services/LobbyService";
import { applySettingsClicked, inviteUserClicked, leaveClicked, readyClicked, startClicked } from "../buttonCallbacks";
import { TDynamicLobbySettings, TLobby } from "../lobbyTyping";
import { getLobbyOptionsHTML } from "../utils/concreteComponents";
import { flashButton, getButton, toggleButton } from "../utils/stylingComponents";

export abstract class ALobbyRenderer {
    constructor() {}

    renderTitles() {
        const titleElement = document.getElementById('lobby-title') as HTMLElement;
        titleElement.textContent = lobbyService.lobby.name;
        const subtitleElement = document.getElementById('lobby-subtitle') as HTMLElement;
        subtitleElement.textContent = this.subtitleText;
    }

    async renderSettings() {
        const lobbySettingsElement = document.getElementById('lobby-settings') as HTMLElement;
        const lobbySettingsListing: TLobby = lobbyService.lobby;
        
        lobbySettingsElement.innerHTML = getLobbyOptionsHTML(false, lobbyService.lobby.type, lobbySettingsListing.matchSettings)

        if (lobbyService.amIHost()) {
            const buttonChangeSettings = getButton("btn-change-settings", "button", "Change lobby settings", false);
            buttonChangeSettings.addEventListener('click', () => this.renderChangeSettings(lobbySettingsListing.matchSettings))
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
            startButton.addEventListener('click', () => startClicked(/*startButton*/))
            buttonsDiv.appendChild(startButton);
        }
    }

    resetReadyButton() {
        const readyButton = document.getElementById('btn-ready') as HTMLButtonElement;
        if (readyButton.classList.contains("active")) {
            toggleButton(readyButton, "I'm ready! (cancel...)", "Ready");
        }
    }

    //Handling of blocked actions by server
    handleNotEveryoneReady() {
        const buttonElement = document.getElementById('btn-start') as HTMLButtonElement;
        flashButton(buttonElement, "Not everyone is ready!")
    }
    handleNotAllSlotsFilled() {
        const buttonElement = document.getElementById('btn-start') as HTMLButtonElement;
        flashButton(buttonElement, "Not all slots are filled!")
    }
    handleTooFewPlayersForTournament() {
        const buttonElement = document.getElementById('btn-start') as HTMLButtonElement;
        flashButton(buttonElement, "Not enough players for tournament!")
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

    abstract renderPlayers(): Promise<void>;
    abstract updatePlayers(): Promise<void>;

    protected abstract readonly subtitleText: string;
}