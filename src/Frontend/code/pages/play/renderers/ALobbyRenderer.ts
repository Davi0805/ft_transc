import { applySettingsClicked, inviteUserClicked, leaveClicked, readyClicked, startClicked } from "../buttonCallbacks";
import { TDynamicLobbySettings, TLobbyType } from "../lobbyTyping";
import { getLobbyOptionsHTML } from "../utils/concreteComponents";
import { TSlots } from "../utils/helpers";
import { flashButton, getButton, toggleButton } from "../utils/stylingComponents";

export abstract class ALobbyRenderer {
    constructor() {}

    renderTitles(lobbyName: string) {
        const titleElement = document.getElementById('lobby-title') as HTMLElement;
        titleElement.textContent = lobbyName;
        const subtitleElement = document.getElementById('lobby-subtitle') as HTMLElement;
        subtitleElement.textContent = this.subtitleText;
    }

    async renderSettings(lobbyType: TLobbyType, matchSettings: TDynamicLobbySettings, amIHost: boolean) {
        const lobbySettingsElement = document.getElementById('lobby-settings') as HTMLElement;
        
        lobbySettingsElement.innerHTML = getLobbyOptionsHTML(false, lobbyType, matchSettings)

        if (amIHost) {
            const buttonChangeSettings = getButton("btn-change-settings", "button", "Change lobby settings", false);
            buttonChangeSettings.addEventListener('click', () => this.renderChangeSettings(lobbyType, matchSettings))
            lobbySettingsElement.appendChild(buttonChangeSettings);
        }
    }

    renderChangeSettings(lobbyType: TLobbyType, matchSettings: TDynamicLobbySettings) {
        const lobbySettingsElement = document.getElementById('lobby-settings') as HTMLElement;
        let lobbySettingsHtml = `
            <form id="settings-change-form" class="flex flex-col gap-1">
                ${getLobbyOptionsHTML(true, lobbyType, matchSettings)}
                ${getButton("apply-lobby-settings", "submit", "Apply", false).outerHTML}
            </div>
        `;
        lobbySettingsElement.innerHTML = lobbySettingsHtml;

        const formChangeSettings = document.getElementById('settings-change-form') as HTMLElement;
        formChangeSettings.addEventListener('submit', (e: SubmitEvent) => applySettingsClicked(e))
    }
    
    async renderActionButtons(amIHost: boolean) {
        const buttonsDiv = document.getElementById("lobby-buttons") as HTMLElement;

        const inviteButton = getButton("btn-invite", "button", "Invite");
        inviteButton.addEventListener('click', () => inviteUserClicked(1)) //TODO: "1" is hardcoded. Find a way to invite specific user
        buttonsDiv.appendChild(inviteButton);

        const leaveButton = getButton("btn-leave", "button", "Leave");
        leaveButton.addEventListener('click', () => leaveClicked());
        buttonsDiv.appendChild(leaveButton);

        const readyButton = getButton("btn-ready", "button", "Ready");
        readyButton.addEventListener('click', () => readyClicked())
        buttonsDiv.appendChild(readyButton);

        if (amIHost) {
            const startButton = getButton("btn-start", "button", "Start");
            startButton.addEventListener('click', () => startClicked())
            buttonsDiv.appendChild(startButton);
        }
    }

    updateReadyButton(ready: boolean) {
        const readyButton = document.getElementById('btn-ready') as HTMLButtonElement;
        if (readyButton.classList.contains("active") !== ready) {
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
    handleFewPlayersForTournament() {
        const buttonElement = document.getElementById('btn-start') as HTMLButtonElement;
        flashButton(buttonElement, "Not enough players for tournament!")
    }
    handleSetReadyWithoutJoining() {
        const buttonElement = document.getElementById('btn-ready') as HTMLButtonElement;
        flashButton(buttonElement, "You must join first!")
    }

    abstract renderPlayers(slots: TSlots, myID: number): Promise<void>;
    abstract updatePlayers(slots: TSlots, myID: number): Promise<void>;

    protected abstract readonly subtitleText: string;
}