import { router } from "../../routes/router";
import { flashButton, getButton, getTable, toggleButton } from "./utils/stylingComponents";
import { getLobbyOptionsHTML } from "./utils/concreteComponents";
import { TLobby } from "./lobbyTyping";
import { TDynamicLobbySettings } from "./lobbyTyping";
import { getLobbySettingsByID} from "../../api/lobbyMatchAPI/getLobbySettingsAPI";
import { lobbySocketService } from "../../services/lobbySocketService";
import { LobbyLogic, TSlots } from "./lobbyLogic";
import { lobby } from "../../services/LobbyService";
import { ROLES, SIDES } from "../../../../../TempIsolatedMatchLogic/src/misc/types";

export const LobbyPage = {
    template() {
        return `
            <div class="flex flex-col items-center h-full max-h-[650px] justify-center backdrop-blur-3xl border-2 border-black/40 shadow-sm text-white rounded-lg px-16 py-12 gap-3 overflow-hidden">
                <h1 id="lobby-title" class="text-3xl p-2"></h1>
                <h3 id="lobby-subtitle" class="text-xl p-1"></h3>
                <div id="lobby-body" class="flex flex-row w-full min-h-0 gap-3">
                    <div id="participants" class="flex flex-col min-w-[300px] border-2 rounded-2xl border-gray-900/75 min-h-0 overflow-hidden">
                    </div>
                    <div id="lobby-settings-and-buttons" class="flex flex-col justify-between gap-6">
                        <div id="lobby-settings">
                        </div>
                        <div id="lobby-buttons" class="flex flex-col gap-1">
                        </div>
                    </div>
                </div>
            </div>
        `;
    },

    async init() {
        if (!lobbySocketService.lobbyID) { throw Error("Socket service is not active"); }
        await lobby.initSettings(lobbySocketService.lobbyID)
        if (!lobby.staticSettings) { throw Error("Settings could not be fetched from backend")}
        const lobbySettings = await lobby.getMySettings();

        const titleElement = document.getElementById('lobby-title') as HTMLElement;
        titleElement.textContent = lobbySettings.name
        const subtitleElement = document.getElementById('lobby-subtitle') as HTMLElement;
        switch (lobbySettings.type) {
            case "friendly": subtitleElement.textContent = "Friendly Match Lobby"; break;
            case "ranked": subtitleElement.textContent = "Ranked Match Lobby"; break;
            case "tournament": subtitleElement. textContent = "Tournament Lobby"; break;
            default: throw new Error("GAVE SHIT");
        }
        
        if (lobby.staticSettings.type == "tournament") {
            await this.renderParticipants();
        } else {
            await this.renderSlots();
        }
        await this.renderSettings();
        await this.activateButtons();

        console.log('Lobby Ranked page loaded!')
    },

    async renderSettings() {
        if (!lobbySocketService.lobbyID) {
            throw Error("How the fuck did I get to this lobby without opening the socket??")
        }
        const lobbySettingsElement = document.getElementById('lobby-settings') as HTMLElement;
        const lobbySettingsListing: TLobby = await getLobbySettingsByID(lobbySocketService.lobbyID)
        
        if (!lobby.staticSettings) { throw Error("Lobby is not initizlized when it should"); }
        let lobbySettingsHtml = `
            <div id="settings-listing" class="flex flex-col gap-1">
                ${getLobbyOptionsHTML(false, lobby.staticSettings?.type, lobbySettingsListing)}
                ${getButton("btn-change-settings", "button", "Change lobby settings", false).outerHTML}
            </div>
        `;
        lobbySettingsElement.innerHTML = lobbySettingsHtml;

        const buttonChangeSettings = document.getElementById('btn-change-settings') as HTMLElement;
        buttonChangeSettings.addEventListener('click', () => this.renderChangeSettings(lobbySettingsListing))
    },

    renderChangeSettings(lobbySettingsListing: TDynamicLobbySettings) {
        const lobbySettingsElement = document.getElementById('lobby-settings') as HTMLElement;
        if (!lobby.staticSettings) { throw Error("Lobby is not initizlized when it should"); }
        let lobbySettingsHtml = `
            <form id="settings-change-form" class="flex flex-col gap-1">
                ${getLobbyOptionsHTML(true, lobby.staticSettings?.type, lobbySettingsListing)}
                ${getButton("apply-lobby-settings", "submit", "Apply", false).outerHTML}
            </div>
        `;
        lobbySettingsElement.innerHTML = lobbySettingsHtml;

        const formChangeSettings = document.getElementById('settings-change-form') as HTMLElement;
        formChangeSettings.addEventListener('submit', async (e) => {
            e.preventDefault()
            await LobbyLogic.fetchAndSubmitSettings();
            this.renderSettings();
        })
    },


    async activateButtons() {
        const buttonsDiv = document.getElementById("lobby-buttons") as HTMLElement;

        const inviteButton = getButton("btn-invite", "button", "Invite");
        inviteButton.addEventListener('click', () => { lobby.inviteUserToLobby(1); }) //TODO: "1" is hardcoded. Find a way to invite specific user
        buttonsDiv.appendChild(inviteButton);

        const leaveButton = getButton("btn-leave", "button", "Leave");
        leaveButton.addEventListener('click', () => {
            lobby.leave()
            router.navigateTo('/play')
        })
        buttonsDiv.appendChild(leaveButton);

        const readyButton = getButton("btn-ready", "button", "Ready");
        readyButton.addEventListener('click', async () => {
            const participating = await lobby.amIParticipating();
            if (!participating) {
                flashButton(readyButton, "You must join first!")
            } else {
                const state = toggleButton(readyButton, "I'm ready! (cancel...)", "Ready");
                lobby.updateMyReadiness(state);
            }
        });
        buttonsDiv.appendChild(readyButton);

        if (lobby.amIHost) {
            const startButton = getButton("btn-start", "button", "Start");
            buttonsDiv.appendChild(startButton);
            startButton.addEventListener('click', async () => {
                const everyoneReady = await lobby.isEveryoneReady();
                if (!everyoneReady) {
                    flashButton(startButton, "Not everyone is ready!");
                } else {
                    LobbyLogic.startLogic();
                }
            })
        }
    },

    async renderSlots() {
        const slots = await lobby.getSlots();
        const canJoin = !(await lobby.amIParticipating()) || lobby.staticSettings?.type == "friendly";

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
                if (!player) { continue; }

                const slotElement = document.createElement("tr");
                slotElement.className = "border-b border-gray-900/50"

                const roleNameElement = document.createElement("td");
                roleNameElement.className = "text-xl p-2 bg-gray-900/50 w-0"
                roleNameElement.textContent = roleName;
                slotElement.appendChild(roleNameElement)
                
                const slotSpaceElement = document.createElement("td");
                slotSpaceElement.className = "text-center"
                if (player !== null) {
                    //TODO should find a way to identify if player is current user and add a withdraw button
                    const playerElement = document.createElement("p");
                    playerElement.className = "text-xl p-2"
                    playerElement.textContent = player.toString();
                    slotSpaceElement.appendChild(playerElement);
                } else if (canJoin){
                    const slotJoinElement = getButton(`join-${teamName}-${roleName}`, "button", "Join", false);
                    slotJoinElement.addEventListener('click', async () => {
                        lobby.staticSettings?.type === "friendly"
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
                        <option>1</option>
                        <option>2</option>
                        <option>3</option>
                    </select>
                </div>

                ${getButton("btn-close-dialog", "submit", "Join", false).outerHTML}
            </form>
        `;
        document.body.appendChild(settingsDialog);
        const closeDialogButton = document.getElementById("btn-close-dialog") as HTMLElement;
        closeDialogButton.addEventListener("click", (e) => {
            e.preventDefault();
            LobbyLogic.fetchAndAddPlayerToSlot(settingsDialog, team, role);
            this.renderSlots();
            settingsDialog.close();
            settingsDialog.remove();
        })
        settingsDialog.showModal();
    },

    async slotJoinRankedCallback(team: SIDES, role: ROLES) {
        const leftControl: string = "LeftArrow" //TODO: calculate from team
        const rightControl: string = "RightArrow" //TODO: calculate from team
        lobby.addMatchPlayer({
            userID: null,
            id: null,
            nick: null,
            spriteID: null,
            team: team,
            role: role,
            leftControl: leftControl,
            rightControl: rightControl
        });
        this.renderSlots();
    },

    async renderParticipants() {
        const participants = await lobby.getTournParticipants();
        const participantsElement = document.getElementById('participants') as HTMLElement;

        const header = document.createElement("h2");
        header.className = "text-center text-2xl bg-gray-900/75 p-1"
        header.textContent = "Participants";
        participantsElement.appendChild(header)


        let participantsTableBody = ""
        let place = 1
        for (let participant of participants) {
            participantsTableBody += `<tr class="bg-gray-900/${place % 2 === 0 ? "25" : "50"}"><td>${place++}</td>`;
            Object.values(participant).forEach(info => {
                participantsTableBody += `<td>${info}</td>`
            })
            participantsTableBody += "</tr>";
        }

        const participantsTableHead = `
            <tr class="text-xl bg-gray-900/90">
                <td>Place</td><td>Player</td><td>rank</td><td>score</td>
            </tr>
        `
        const participantsTable = getTable("participants", participantsTableHead, participantsTableBody)
        participantsElement.innerHTML += participantsTable.outerHTML;
        
        const participating = await lobby.amIParticipating();
        const joinWithdrawButton = getButton("btn-join-withdraw", "button", participating ? "Withdraw" : "Join", false)
        joinWithdrawButton.addEventListener("click", () => {
            lobby.addTournPlayer()
        })
        //TODO: callback for this button is missing!
        joinWithdrawButton.classList.add("w-full");

        participantsElement.appendChild(joinWithdrawButton)
    },
}