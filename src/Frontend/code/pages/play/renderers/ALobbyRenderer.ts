
import { getAllFriends } from "../../../api/friends/chat/getAllFriendsAPI";
import { getUserAvatarById } from "../../../api/userData/getUserAvatarAPI";
import { chatWindowControler } from "../../../components/chatWindow";
import { lobbyService } from "../../../services/LobbyService";
import { ErrorPopup } from "../../../utils/popUpError";
import { applySettingsClicked, inviteUserClicked, leaveClicked, readyClicked, startClicked } from "../buttonCallbacks";
import { TDynamicLobbySettings, TLobbyType } from "../lobbyTyping";
import { getLobbyOptionsHTML } from "../utils/concreteComponents";
import { flashButton } from "../utils/stylingComponents";

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

    private _pencilIconSVG = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="m18.5 2.5 a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>`;

    //Renders the settings. Selects always visible but disabled until host clicks pencil.
    async renderSettings(lobbyType: TLobbyType, matchSettings: TDynamicLobbySettings, amIHost: boolean) {
        const lobbySettingsElement = document.getElementById('lobby-settings') as HTMLElement;

        const pencilBtn = amIHost
            ? `<button id="btn-change-settings" class="bg-white/10 border border-white/20 w-9 h-9 rounded-lg flex items-center justify-center cursor-pointer transition-all hover:bg-white/20 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-black/30 text-white" title="Edit Settings">${this._pencilIconSVG}</button>`
            : '';

        lobbySettingsElement.innerHTML = `
            <div class="flex items-center justify-between mb-3">
                <h2 class="text-xl font-semibold">Lobby Settings</h2>
                ${pencilBtn}
            </div>
            <form id="settings-change-form" class="flex flex-col gap-4">
                ${getLobbyOptionsHTML(true, lobbyType, matchSettings)}
                <button type="submit" id="apply-lobby-settings" class="hidden px-6 py-3.5 border-0 rounded-lg font-semibold text-base cursor-pointer transition-all uppercase tracking-wide text-white bg-gradient-to-br from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-blue-500/30">
                    Apply
                </button>
            </form>
        `;

        // Selects start disabled for everyone
        lobbySettingsElement.querySelectorAll('select').forEach(s => (s as HTMLSelectElement).disabled = true);

        if (amIHost) {
            document.getElementById('btn-change-settings')?.addEventListener('click', () => {
                const isEditing = !document.getElementById('apply-lobby-settings')?.classList.contains('hidden');
                // Toggle edit mode: enable/disable selects and show/hide Apply
                lobbySettingsElement.querySelectorAll('select').forEach(s => (s as HTMLSelectElement).disabled = isEditing);
                document.getElementById('apply-lobby-settings')?.classList.toggle('hidden');
                // Hide all action buttons except Leave while editing
                ['btn-invite', 'btn-ready', 'btn-start'].forEach(id => {
                    document.getElementById(id)?.classList.toggle('hidden', !isEditing);
                });
            });
            document.getElementById('settings-change-form')?.addEventListener('submit', (e: SubmitEvent) => {
                applySettingsClicked(e);
                // settings re-render from server will reset the state (and re-render re-shows all buttons)
            });
        }
    }
    
    //The action buttons are the ones on the bottom right of the screen
    async renderActionButtons(amIHost: boolean) {
        const buttonsDiv = document.getElementById("lobby-buttons") as HTMLElement;
        const base = "px-6 py-3.5 border-0 rounded-lg font-semibold text-base cursor-pointer transition-all uppercase tracking-wide text-white hover:-translate-y-0.5";

        const inviteButton = document.createElement('button');
        inviteButton.id = "btn-invite"; inviteButton.type = "button";
        inviteButton.className = `${base} bg-gradient-to-br from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 hover:shadow-xl hover:shadow-purple-500/30`;
        inviteButton.textContent = "Invite Friends";
        inviteButton.addEventListener('click', () => this.InviteClickEventListener());
        buttonsDiv.appendChild(inviteButton);

        const leaveButton = document.createElement('button');
        leaveButton.id = "btn-leave"; leaveButton.type = "button";
        leaveButton.className = `${base} bg-gradient-to-br from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 hover:shadow-xl hover:shadow-red-500/30`;
        leaveButton.textContent = "Leave Lobby";
        leaveButton.addEventListener('click', () => leaveClicked());
        buttonsDiv.appendChild(leaveButton);

        const readyButton = document.createElement('button');
        readyButton.id = "btn-ready"; readyButton.type = "button";
        readyButton.className = `${base} bg-gradient-to-br from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 hover:shadow-xl hover:shadow-emerald-500/30`;
        readyButton.textContent = "Ready";
        readyButton.addEventListener('click', () => readyClicked());
        buttonsDiv.appendChild(readyButton);

        //Only render the start button if you are the host
        if (amIHost) {
            const startButton = document.createElement('button');
            startButton.id = "btn-start"; startButton.type = "button";
            startButton.className = `px-6 py-4 border-0 rounded-lg font-semibold text-lg cursor-pointer transition-all uppercase tracking-wide text-white hover:-translate-y-0.5 bg-gradient-to-br from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 hover:shadow-2xl hover:shadow-blue-500/40`;
            startButton.textContent = "Start Game";
            startButton.addEventListener('click', () => startClicked());
            buttonsDiv.appendChild(startButton);
        }
    }

    updateReadyButton(ready: boolean) {
        const readyButton = document.getElementById('btn-ready') as HTMLButtonElement;
        if (readyButton.classList.contains("active") === ready) return;
        readyButton.classList.toggle('active', ready);
        readyButton.textContent = ready ? "I'm ready! (cancel...)" : "Ready";
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
        element.innerHTML = `
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
                    </div>`;
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