import { router } from "../../routes/router";
import { flashButton, getButton, getTable, setupKeyCaptureButton, toggleButton } from "./utils/stylingComponents";
import { getLobbyOptionsHTML } from "./utils/concreteComponents";
import { TLobby, TDynamicLobbySettings, TMap, TDuration, TMode } from "./lobbyTyping";
import { lobbyService } from "../../services/LobbyService";
import { ROLES, SIDES } from "../../match/matchSharedDependencies/sharedTypes";
import { matchService } from "../../services/matchService";
import { areAllSlotsFull } from "./utils/helpers";

export const LobbyPage = {
    template() {
        return `
            <div class="flex flex-col items-center h-full max-h-[650px] justify-center backdrop-blur-3xl border-2 border-black/40 shadow-sm text-white rounded-lg px-16 py-12 gap-3 overflow-hidden">
                <button id="test-inv">invite teset1</button>
                <button id="test-inv2">invite test2</button>


                <h1 id="lobby-title" class="text-3xl p-2"></h1>
                <h3 id="lobby-subtitle" class="text-xl p-1"></h3>
                <div id="lobby-body" class="flex flex-row w-full min-h-0 gap-3 ">
                    <div id="participants" class="flex flex-col min-w-[300px] border-2 rounded-2xl border-gray-900/75 min-h-0 overflow-hidden">
                    </div>
                    <div id="lobby-settings-and-buttons" class="flex flex-col justify-between gap-6 outline outline-2 outline-red-500">
                        <div id="lobby-settings" class="flex flex-col gap-1">
                        </div>
                        <div id="lobby-buttons" class="flex flex-col gap-1">
                        </div>
                    </div>
                </div>
                <h3 id="current-round"></h3>
            </div>
        `;
    },

    async init() {
        console.log(lobbyService.lobby)


    const test1 = document.getElementById("test-inv");
    test1?.addEventListener('click', ()=> {
      lobbyService.inviteUserToLobby(1);
      console.log("invited user id 1");
    })

const test2 = document.getElementById("test-inv");
    test2?.addEventListener('click', ()=> {
      lobbyService.inviteUserToLobby(2);
      console.log("invited user id 2");
    })

        const titleElement = document.getElementById('lobby-title') as HTMLElement;
        titleElement.textContent = lobbyService.lobby.name;
        const subtitleElement = document.getElementById('lobby-subtitle') as HTMLElement;
        switch (lobbyService.lobby.type) {
            case "friendly": subtitleElement.textContent = "Friendly Match Lobby"; break;
            case "ranked": subtitleElement.textContent = "Ranked Match Lobby"; break;
            case "tournament": subtitleElement. textContent = "Tournament Lobby"; break;
            default: throw new Error("GAVE SHIT");
        }
        
        if (lobbyService.lobby.type == "tournament") {
            await this.renderParticipants();
        } else {
            await this.renderSlots();
        }
        await this.renderSettings();
        await this.activateButtons();

        this.updateRound();

        console.log('Lobby Ranked page loaded!')
    },

    async renderSettings() {
        const lobbySettingsElement = document.getElementById('lobby-settings') as HTMLElement;
        const lobbySettingsListing: TLobby = lobbyService.lobby;
        
        lobbySettingsElement.innerHTML = getLobbyOptionsHTML(false, lobbyService.lobby.type, lobbySettingsListing)

        if (lobbyService.amIHost()) {
            const buttonChangeSettings = getButton("btn-change-settings", "button", "Change lobby settings", false);
            buttonChangeSettings.addEventListener('click', () => this.renderChangeSettings(lobbySettingsListing))
            lobbySettingsElement.appendChild(buttonChangeSettings);
        }
    },

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
        formChangeSettings.addEventListener('submit', async (e) => {
            e.preventDefault()
            this.fetchAndSubmitSettings();
        })
    },

    updateRound() {
        const roundElement = document.getElementById("current-round") as HTMLElement;
        roundElement.textContent = `Current round: ${lobbyService.lobby.round}`
    },


    async activateButtons() {
        const buttonsDiv = document.getElementById("lobby-buttons") as HTMLElement;

        const inviteButton = getButton("btn-invite", "button", "Invite");
        inviteButton.addEventListener('click', () => { lobbyService.inviteUserToLobby(1); }) //TODO: "1" is hardcoded. Find a way to invite specific user
        buttonsDiv.appendChild(inviteButton);

        const leaveButton = getButton("btn-leave", "button", "Leave");
        leaveButton.addEventListener('click', () => {
            lobbyService.leave()
            router.navigateTo('/play')
        })
        buttonsDiv.appendChild(leaveButton);

        const readyButton = getButton("btn-ready", "button", "Ready");
        readyButton.addEventListener('click', async () => {
            if (!lobbyService.isUserParticipating(lobbyService.myID)) {
                flashButton(readyButton, "You must join first!")
            } else {
                const state = toggleButton(readyButton, "I'm ready! (cancel...)", "Ready");
                lobbyService.updateReadinessIN(state);
            }
        });
        buttonsDiv.appendChild(readyButton);

        if (lobbyService.amIHost()) {
            const startButton = getButton("btn-start", "button", "Start");
            buttonsDiv.appendChild(startButton);
            startButton.addEventListener('click', async () => {
                if (!lobbyService.isEveryoneReady()) {
                    flashButton(startButton, "Not everyone is ready!");
                } else if (lobbyService._isLobbyOfType("ranked") && !areAllSlotsFull(lobbyService.getSlots())) {
                    flashButton(startButton, "Not all slots are filled!")
                } else {        
                    lobbyService.startMatchIN();
                }
            })
        }
    },

    async renderSlots() {
        const slots = lobbyService.getSlots();
        const canJoin = !(lobbyService.isUserParticipating(lobbyService.myID)) || lobbyService.lobby.type == "friendly";

        const teamsElement = document.getElementById('participants') as HTMLElement;
        teamsElement.innerHTML = "";
        const slotsTable = document.createElement('table');
        for (const teamName of (Object.keys(slots) as (keyof typeof SIDES)[])) {
            const team = slots[teamName];
            if (!team) continue;

            const teamElement = document.createElement("tr");
            const teamNameElement = document.createElement("td");
            teamNameElement.className = "bg-gray-900/75 text-2xl"
            teamNameElement.colSpan = 2;
            teamNameElement.textContent = teamName;
            teamElement.appendChild(teamNameElement);
            slotsTable.appendChild(teamElement);
  
            for (const roleName of (Object.keys(team) as (keyof typeof ROLES)[])) {
                const player = team[roleName]
                if (player === undefined) { continue; }

                const slotElement = document.createElement("tr");
                slotElement.className = "border-b border-gray-900/50"

                const roleNameElement = document.createElement("td");
                roleNameElement.className = "text-xl p-2 bg-gray-900/50 w-0"
                roleNameElement.textContent = roleName;
                slotElement.appendChild(roleNameElement)
                
                const slotSpaceElement = document.createElement("td");
                slotSpaceElement.className = "text-center"
                if (player !== null) {
                    const playerDiv = document.createElement("div");
                    playerDiv.className = "flex flex-row"
                    
                    const playerElement = document.createElement("p");
                    playerElement.className = "w-full text-xl p-2"
                    playerElement.textContent = player.nickname.toString();
                    playerDiv.appendChild(playerElement);

                    if (player.userID === lobbyService.myID) {
                        const withdrawButton = getButton("btn-withdraw", "button", "X", false);
                        withdrawButton.addEventListener("click", () => {
                            matchService.removeControls(player.id);
                            lobbyService.lobby.type === "friendly"
                            ? lobbyService.removeFriendlyPlayerIN(player.id)
                            : lobbyService.removeRankedPlayerIN(player.id)
                        })
                        playerDiv.appendChild(withdrawButton);
                    }
                    
                    slotSpaceElement.appendChild(playerDiv);
                } else if (canJoin){
                    const slotJoinElement = getButton(`join-${teamName}-${roleName}`, "button", "Join", false);
                    slotJoinElement.addEventListener('click', async () => {
                        lobbyService.lobby.type === "friendly"
                        ? this.slotJoinFriendlyCallback(SIDES[teamName], ROLES[roleName])
                        : this.slotJoinRankedCallback(SIDES[teamName], ROLES[roleName])
                    })
                    slotSpaceElement.appendChild(slotJoinElement);
                }
                slotElement.appendChild(slotSpaceElement);
                slotsTable.appendChild(slotElement);
            }
        }
        teamsElement.appendChild(slotsTable);
    },

    async slotJoinFriendlyCallback(team: SIDES, role: ROLES) {
        const directions = matchService.getDirectionsFromTeam(team);

        const leftKey = "Arrow" + directions.left
        const rightKey = "Arrow" + directions.right

        const settingsDialog = document.createElement('dialog');
        settingsDialog.className = "fixed m-auto overflow-hidden rounded-lg"
        settingsDialog.innerHTML = `
            <form id="player-settings" method="dialog" class="flex flex-col items-center justify-center bg-gray-900/75 border-2 border-black/40 shadow-sm text-white rounded-lg gap-3 p-3 overflow-hidden">
                <h2>Configure player</h2>
                <div id="choose-alias" class="flex flex-row gap-3">
                    <label for="player-alias" class="text-xl">Alias:</label>
                    <input id="player-alias" name="player-alias" class="bg-gray-900/50 rounded-2xl px-4 text-center" required></input>
                </div>
                <div id="choose-paddle" class="flex flex-row gap-3">
                    <label for="player-paddle" class="text-xl">Paddle:</label>
                    <select id="player-paddle" name="player-alias" class="bg-gray-900/50 rounded-2xl px-4 text-center">
                        <option>0</option>
                        <option>1</option>
                        <option>2</option>
                    </select>
                </div>
                <div id="choose-left-ctr" class="flex flex-row gap-3">
                    <label for="left-listener" class="text-xl">${directions.left} button:</label>
                    ${getButton("left-listener", "button", leftKey, false).outerHTML}
                </div>
                <div id="choose-right-ctr" class="flex flex-row gap-3">
                    <label for="right-listener" class="text-xl">${directions.right} button:</label>
                    ${getButton("right-listener", "button", rightKey, false).outerHTML}
                </div>

                ${getButton("btn-close-dialog", "submit", "Join", false).outerHTML}
            </form>
        `;
        document.body.appendChild(settingsDialog);

        
        const leftListener = document.getElementById("left-listener") as HTMLButtonElement
        const rightListener = document.getElementById("right-listener") as HTMLButtonElement
        setupKeyCaptureButton(leftListener)
        setupKeyCaptureButton(rightListener)


        const closeDialogButton = document.getElementById("btn-close-dialog") as HTMLElement;
        closeDialogButton.addEventListener("click", (e) => {
            e.preventDefault();
            this.fetchAndAddPlayerToSlot(settingsDialog, team, role);
            this.renderSlots();
            settingsDialog.close();
            settingsDialog.remove();
        })
        settingsDialog.showModal();
    },

    async slotJoinRankedCallback(team: SIDES, role: ROLES) {
        matchService.addDefaultControls(lobbyService.myID, team);
        lobbyService.addRankedPlayerIN({
            team: team,
            role: role
        });
    },

    async renderParticipants() {
        const participantsElement = document.getElementById('participants') as HTMLElement;
        const participantsTableElement = document.createElement("div");
        participantsTableElement.id = "participants-table";
        participantsTableElement.className = "h-full"
        participantsElement.appendChild(participantsTableElement);

        this.renderTournamentTable()
        
        const participating = lobbyService.isUserParticipating(lobbyService.myID);
        const joinWithdrawButton = getButton("btn-join-withdraw", "button", "Join", false)
        joinWithdrawButton.addEventListener("click", () => {
            const state = toggleButton(joinWithdrawButton, "Withdraw", "Join")
            console.log(state)
            if (state === true) {
                lobbyService.addTournamentPlayerIN()
            } else {
                lobbyService.removeTournamentPlayerIN()
            }
        })
        joinWithdrawButton.classList.add("w-full");

        participantsElement.appendChild(joinWithdrawButton)
    },

    renderTournamentTable() {
        const tableElement = document.getElementById("participants-table");
        if (!tableElement) {throw Error("Tournament table element was not found")}
        tableElement.innerHTML = ""
        
        const header = document.createElement("h2");
        header.className = "text-center text-2xl bg-gray-900/75 p-1"
        header.textContent = "Participants";
        tableElement.appendChild(header)


        let participantsTableBody = ""
        let place = 1
        const categories = ["nick", "rating", "score"] as const
        for (let participant of lobbyService.getTournPlayers()) {
            const opacity = `opacity-${participant.participating ? "100" : "25"}`
            const bg = `bg-gray-900/${place % 2 === 0 ? "25" : "50"}`;
            participantsTableBody += `<tr class="${bg} ${opacity}"><td>${place++}</td>`;
            categories.forEach(category => {
                participantsTableBody += `<td>${participant[category]}</td>`;
            })
            participantsTableBody += "</tr>";
        }

        const participantsTableHead = `
            <tr class="text-xl bg-gray-900/90">
                <td>Place</td><td>Player</td><td>Rating</td><td>Score</td>
            </tr>
        `
        const participantsTable = getTable("participants", participantsTableHead, participantsTableBody)
        tableElement.innerHTML += participantsTable.outerHTML;
    },

    //Settings logic
    fetchAndSubmitSettings() {
        const map = (document.getElementById('match-map') as HTMLSelectElement).value;
        const mode = (document.getElementById('match-mode') as HTMLSelectElement).value;
        const duration = (document.getElementById('match-duration') as HTMLSelectElement).value;
        lobbyService.updateSettingsIN({
            map: map as TMap,
            mode: mode as TMode,
            duration: duration as TDuration
        })
        console.log("New settings applied!")
    },

    fetchAndAddPlayerToSlot(settingsDialog: HTMLDialogElement,
            team: SIDES, role: ROLES) {
        const form = settingsDialog.querySelector("form") as HTMLFormElement;
        if (!form.reportValidity()) return;
        const aliasInput = document.getElementById("player-alias") as HTMLInputElement;
        const alias = aliasInput.value;
        const spriteIdInput = document.getElementById("player-paddle") as HTMLInputElement;
        const spriteID = Number(spriteIdInput.value)
        lobbyService.addFriendlyPlayerIN({
            id: -1, //This is supposed to be generated by backend
            nickname: alias,
            spriteID: spriteID,
            team: team,
            role: role 
        });

        const leftKey = (document.getElementById("left-listener") as HTMLButtonElement).textContent
        const rightKey = (document.getElementById("right-listener") as HTMLButtonElement).textContent
        if (!leftKey || !rightKey) {throw Error("tired of this bullshit")}
        matchService.addControls(-1, {
            left: leftKey,
            right: rightKey
        })
        console.log(`Player saved with alias ${alias} and sprite id ${spriteID}`)
        console.log(`Player added to team ${team} and role ${role}!`)
    },

}