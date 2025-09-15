import { applySettingsClicked, inviteUserClicked, leaveClicked, readyClicked, startClicked } from "../buttonCallbacks";
import { TDynamicLobbySettings, TLobbyType } from "../lobbyTyping";
import { getLobbyOptionsHTML } from "../utils/concreteComponents";
import { flashButton, getButton, toggleButton } from "../utils/stylingComponents";

//The parent of all parents. Implements the rendering functions that are common to all lobby types
export abstract class ALobbyRenderer {
    constructor() {}

    //Renders the title and subtitle
    renderTitles(lobbyName: string) {
        const titleElement = document.getElementById('lobby-title') as HTMLElement;
        titleElement.textContent = lobbyName;
        const subtitleElement = document.getElementById('lobby-subtitle') as HTMLElement;
        subtitleElement.textContent = this.subtitleText;
    }

    //Renders the settings, including the button to change them
    async renderSettings(lobbyType: TLobbyType, matchSettings: TDynamicLobbySettings, amIHost: boolean) {
        const lobbySettingsElement = document.getElementById('lobby-settings') as HTMLElement;
        //As the html for the options is created inside the helper, it is inserted directly in the innerHTML
        lobbySettingsElement.innerHTML = getLobbyOptionsHTML(false, lobbyType, matchSettings)

        //Only the host can change the settings, so the button is only rendered in that case
        if (amIHost) {
            const buttonChangeSettings = getButton("btn-change-settings", "button", "Change lobby settings", false);
            buttonChangeSettings.addEventListener('click', () => this.renderChangeSettings(lobbyType, matchSettings))
            lobbySettingsElement.appendChild(buttonChangeSettings);
        }
    }

    //Renders the settings as dropdowns
    renderChangeSettings(lobbyType: TLobbyType, matchSettings: TDynamicLobbySettings) {
        const lobbySettingsElement = document.getElementById('lobby-settings') as HTMLElement;
        //This time, the getLobbyOptionsHTML "editable" parameter is set as true
        let lobbySettingsHtml = `
            <form id="settings-change-form" class="flex flex-col gap-1">
                ${getLobbyOptionsHTML(true, lobbyType, matchSettings)}
                ${getButton("apply-lobby-settings", "submit", "Apply", false).outerHTML}
            </div>
        `;
        lobbySettingsElement.innerHTML = lobbySettingsHtml;

        //Connect the callback of the apply button
        const formChangeSettings = document.getElementById('settings-change-form') as HTMLElement;
        formChangeSettings.addEventListener('submit', (e: SubmitEvent) => applySettingsClicked(e))
    }
    
    //The action buttons are the ones on the bottom right of the screen
    async renderActionButtons(amIHost: boolean) {
        const buttonsDiv = document.getElementById("lobby-buttons") as HTMLElement;

        //GetButton is just creates a simple button with the options provided
        const inviteButton = getButton("btn-invite", "button", "Invite");
        inviteButton.addEventListener('click', () => inviteUserClicked(1)) //TODO: "1" is hardcoded. Find a way to invite specific user
        buttonsDiv.appendChild(inviteButton);

        const leaveButton = getButton("btn-leave", "button", "Leave");
        leaveButton.addEventListener('click', () => leaveClicked());
        buttonsDiv.appendChild(leaveButton);

        const readyButton = getButton("btn-ready", "button", "Ready");
        readyButton.addEventListener('click', () => readyClicked())
        buttonsDiv.appendChild(readyButton);

        //Only render the start button if you are the host
        if (amIHost) {
            const startButton = getButton("btn-start", "button", "Start");
            startButton.addEventListener('click', () => startClicked())
            buttonsDiv.appendChild(startButton);
        }
    }

    updateReadyButton(ready: boolean) {
        const readyButton = document.getElementById('btn-ready') as HTMLButtonElement;
        //We only want to toggle the button if the readiness state this func receives is different from the one already displayed
        //The button is on ("active" is present in the classList) if the player is ready, off otherwise
        if (readyButton.classList.contains("active") !== ready) {
            toggleButton(readyButton, "I'm ready! (cancel...)", "Ready");
        }
    }

    //Handling of blocked actions by server (server sends a specific type of message if an action received by it is not allowed)
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

    //These are the functions that depend on lobby type and therefore must be implemented by children
    abstract renderPlayers(): Promise<void>;
    abstract updatePlayers(): Promise<void>;

    //The subtitle text, which must be saved at rendered creation so it can be fetched later when it is time to render it (as it is dependent on the type)
    protected abstract readonly subtitleText: string;
}