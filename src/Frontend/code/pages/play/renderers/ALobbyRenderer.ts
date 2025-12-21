import DOMPurify from "dompurify";
import { getAllFriends } from "../../../api/friends/chat/getAllFriendsAPI";
import { getUserAvatarById } from "../../../api/userData/getUserAvatarAPI";
import { chatWindowControler } from "../../../components/chatWindow";
import { lobbyService } from "../../../services/LobbyService";
import { ErrorPopup } from "../../../utils/popUpError";
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
        lobbySettingsElement.innerHTML = DOMPurify.sanitize(getLobbyOptionsHTML(false, lobbyType, matchSettings));

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
        lobbySettingsElement.innerHTML = DOMPurify.sanitize(lobbySettingsHtml);

        //Connect the callback of the apply button
        const formChangeSettings = document.getElementById('settings-change-form') as HTMLElement;
        formChangeSettings.addEventListener('submit', (e: SubmitEvent) => applySettingsClicked(e))
    }
    
    //The action buttons are the ones on the bottom right of the screen
    async renderActionButtons(amIHost: boolean) {
        const buttonsDiv = document.getElementById("lobby-buttons") as HTMLElement;

        //GetButton is just creates a simple button with the options provided
        const inviteButton = getButton("btn-invite", "button", "Invite");
        inviteButton.addEventListener('click', () => this.InviteClickEventListener());
        // inviteButton.addEventListener('click', () => inviteUserClicked(1)) //TODO: "1" is hardcoded. Find a way to invite specific user
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

    renderInviteFriendHTML() : string {
        return `
        <dialog class="p-0 m-0 fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[1000] min-w-[400px] max-w-[500px] h-[500px] bg-[rgb(20,20,20)] border-2 border-white/10 rounded-[12px] shadow-[0_0_30px_rgba(0,0,0,0.5)] text-[#eee]"
                id="friendRequestsDialog">
            <button class="close-dialog-btn">×</button> <!-- onclick="closeDialog()" -->

            <h1 class="text-[24px] font-semibold text-center px-[24px] pt-[20px] pb-[16px] border-b border-white/10 text-[#eee]">Invite friend</h1>

            <div id="friends-list-container" class="px-[24px] py-[5px] max-h-[50vh] overflow-y-auto text-center scrollbar-none">
            </div>
        </dialog>`;
    }

    async createFriendListEntryElement(userID: number, username: string) : Promise<HTMLDivElement> {
        let avatarURL;
        try {
            avatarURL = await getUserAvatarById(userID);
        } catch (error) {
            const errorPopup = new ErrorPopup();
            errorPopup.create("Error Loading Avatar", "Failed to fetch the user's avatar. Please try again later.");
            console.error("DEBUG:Error fetching user avatar:", error);
        }
        
        let element =document.createElement("div");
        element.classList = "friends-list-entry flex items-center justify-between gap-[16px] py-[12px] border-b border-white/5 last:border-b-0";
        element.innerHTML = DOMPurify.sanitize(`
                    <div class="flex  items-center gap-[12px] flex-1">
                        <img src="${avatarURL}" alt="user-avatar" class="w-[40px] h-[40px] rounded-full border-2 border-white/20 shadow-[0_0_4px_rgba(0,0,0,0.3)] object-cover">

                        <span class="text-[16px] font-medium text-[#eee]">${username}</span>
                    </div>

                    <div class="flex items-center gap-2">
                        <button
                            class="px-[16px] h-[36px] rounded-[8px] border border-white/20 bg-white/10 text-[#eee] text-[14px] font-medium cursor-pointer flex items-center justify-center transition-all duration-200 ease-in-out hover:bg-white/25 hover:border-white/40 hover:scale-[1.03] active:scale-[0.97]"
                            id="invite-btn"
                            data-id="${userID}"
                            title="Invite button"
                        >
                            Invite
                        </button>
                    </div>`);
        return element;
    }

    async InviteClickEventListener() {
        const dialogHTML = this.renderInviteFriendHTML();
        document.body.insertAdjacentHTML("beforeend", dialogHTML);

        const container = document.getElementById("friends-list-container") as HTMLElement;
        if (!container) return;

        try {
            const friendEntries = await getAllFriends();
            for (const friend of friendEntries) {
                const entryElement = await this.createFriendListEntryElement(friend.user_id, friend.username);
                container.appendChild(entryElement);
            }
        } catch (error) {
            const errorPopup = new ErrorPopup();
            errorPopup.create("Error Loading Friends", "Failed to fetch your friends list. Please try again later.");
            console.error("DEBUG: Error fetching friends list:", error);
            return;            
        }

        const dialog = document.getElementById("friendRequestsDialog") as HTMLDialogElement;
        if (dialog instanceof HTMLDialogElement) {
            dialog.showModal();
        }


        // Section for closing the dialog
        const closeHandler = () => {
            dialog.close();
            dialog.remove(); // Clean up from DOM
        };

        dialog.addEventListener("click", (e: MouseEvent) => {
            const rect = dialog.getBoundingClientRect();
            const clickInside =
                e.clientX >= rect.left &&
                e.clientX <= rect.right &&
                e.clientY >= rect.top &&
                e.clientY <= rect.bottom;

            if (!clickInside) {
                closeHandler();
            }
        });

        const closeButton = dialog.querySelector(".close-dialog-btn") as HTMLButtonElement;
        closeButton.addEventListener("click", () => closeHandler());

        // esc key closes dialog
        dialog.addEventListener("keydown", (e: KeyboardEvent) => {
            if (e.key === "Escape") {
                closeHandler();
            }
        });

        // Section for invite buttons
        const inviteButtons = container.querySelectorAll("#invite-btn");
        inviteButtons.forEach((button) => {
            const handler = async () => {
                const userID = parseInt((button as HTMLButtonElement).getAttribute("data-id") || "0");
                if (userID === 0) return;
                inviteUserClicked(userID);
                button.removeEventListener("click", handler);
                button.textContent = "Sent";
                button.classList.remove(
                    "hover:bg-white/25",
                    "hover:border-white/40",
                    "hover:scale-[1.03]",
                    "active:scale-[0.97]"
                );
                button.classList.add("cursor-default", "bg-white/20");
                if (chatWindowControler.isChatOpen && chatWindowControler.getFriendID === userID) {
                    chatWindowControler.AddGameInviteMessage(lobbyService.myID);
                } 
            };
            button.addEventListener("click", handler);

        });
    }

    //These are the functions that depend on lobby type and therefore must be implemented by children
    abstract renderPlayers(): Promise<void>;
    abstract updatePlayers(): Promise<void>;

    //The subtitle text, which must be saved at rendered creation so it can be fetched later when it is time to render it (as it is dependent on the type)
    protected abstract readonly subtitleText: string;
}