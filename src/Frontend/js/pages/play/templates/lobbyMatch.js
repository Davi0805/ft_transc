import { getButton, getTable } from "../utils/stylingComponents.js";
import { getLobbyOptionsHTML } from "../utils/concreteComponents.js";

export const LobbyMatchPage = {
    template() {
        return `
            <div class="flex flex-col items-center justify-center h-full backdrop-blur-3xl border-2 border-black/40 shadow-sm text-white rounded-lg px-16 py-12 gap-3 overflow-hidden">
                <h1 id="lobby-title" class="text-3xl p-2"></h1>
                <h3 id="lobby-subtitle" class="text-xl p-1"></h3>
                <div id="lobby-body" class="flex flex-row w-full min-h-0 gap-3">
                    <div id="participants" class="flex flex-col min-w-[300px] border-2 rounded-2xl border-gray-900/75 min-h-0 overflow-hidden">
                    </div>
                    <div id="lobby-settings-and-buttons" class="flex flex-col justify-between gap-6">
                        <div id="lobby-settings">
                        </div>
                        <div id="lobby-buttons" class="flex flex-col gap-1">
                            ${getButton("btn-invite", "button", "Invite").outerHTML}
                            ${getButton("btn-leave", "button", "Leave").outerHTML}
                            ${getButton("btn-ready", "button", "Ready").outerHTML}
                        </div>
                    </div>
                </div>
            </div>
        `;
    },

    renderSettings() {
        const lobbySettingsElement = document.getElementById('lobby-settings');
        const lobbySettingsListing = {
            name: "Some lobby",
            map: "1v1-medium",
            mode: "modern",
            length: "marathon"
        } //TODO: Get Lobby Settings from db

        let lobbySettingsHtml = `
            <div id="settings-listing" class="flex flex-col gap-1">
                ${getLobbyOptionsHTML(false, "friendly", lobbySettingsListing)}
                ${getButton("btn-change-settings", "button", "Change lobby settings", false).outerHTML}
            </div>
        `;
        lobbySettingsElement.innerHTML = lobbySettingsHtml;

        const buttonChangeSettings = document.getElementById('btn-change-settings');
        buttonChangeSettings.addEventListener('click', () => this.renderChangeSettings(lobbySettingsListing))
    },

    renderChangeSettings(lobbySettingsListing) {
        const lobbySettingsElement = document.getElementById('lobby-settings');
        let lobbySettingsHtml = `
            <form id="settings-change-form" class="flex flex-col gap-1">
                ${getLobbyOptionsHTML(true, "friendly", lobbySettingsListing)}
                ${getButton("apply-lobby-settings", "submit", "Apply", false).outerHTML}
            </div>
        `;
        lobbySettingsElement.innerHTML = lobbySettingsHtml;

        const formChangeSettings = document.getElementById('settings-change-form');
        formChangeSettings.addEventListener('submit', async (e) => {
            e.preventDefault();
            //TODO: Update the database here with new lobby settings
            console.log("New settings applied!")
            this.renderSettings()
        })
    },


    activateButtons() {
        const inviteButton = document.getElementById('btn-invite');
        inviteButton.addEventListener('click', () => {
            //TODO: ADD INVITE LOGIC HERE
            console.log("Invite button was clicked")
        })

        const leaveButton = document.getElementById('btn-leave');
        leaveButton.addEventListener('click', () => {
            //TODO: ADD COMM TO DB THAT PLAYER LEFT
            console.log("Leave button was clicked")

            window.router.navigateTo('/play')
        })

        const readyButton = document.getElementById('btn-ready');
        readyButton.addEventListener('click', () => {
            //TODO: ADD COMM TO DB THAT PLAYER IS READY
            readyButton.classList.toggle("active");
            const isActive = readyButton.classList.contains("active");
            console.log("button is now ", isActive ? "DOWN" : "UP");
            if (isActive) {
                //TODO: COMM WITH DB SAYING THAT PLAYER IS READY
                readyButton.textContent = "I'm ready! (cancel...)"
                readyButton.classList.remove("bg-gray-900/50") //the normal color
                readyButton.classList.add("bg-gray-900/25") //the active color
            } else {
                //TODO: COMM WITH DB SAYING THAT PLAYER IS NOT READY
                readyButton.textContent = "Ready"
                readyButton.classList.remove("bg-gray-900/25") //the active color
                readyButton.classList.add("bg-gray-900/50") //the normal color
            }
        })
    },

    renderSlots() {
        // TODO: change to enum values once typescript is applied
        const slots = {
            LEFT: {
                back: 123
            },
            RIGHT: {
                front: -2,
                back: -2
            },
            TOP: {
                front: -1,
            },
            BOTTOM: {
                front: 321,
                back: -2
            },
        } //TODO: This has to be a function that returns this object

        const teamsElement = document.getElementById('participants');
        teamsElement.innerHTML = "";
        const slotsTable = document.createElement('table');
        for (const [team, roles] of Object.entries(slots)) {
            const teamElement = document.createElement("tr");
    
            const teamNameElement = document.createElement("td");
            teamNameElement.className = "bg-gray-900/75 text-2xl"
            teamNameElement.colSpan = "2";
            teamNameElement.textContent = team;
            teamElement.appendChild(teamNameElement);
            slotsTable.appendChild(teamElement);
            
            for (const [role, player] of Object.entries(roles)) {
                const slotElement = document.createElement("tr");
                slotElement.className = "border-b border-gray-900/50"

                const roleNameElement = document.createElement("td");
                roleNameElement.className = "text-xl p-2 bg-gray-900/50 w-0"
                roleNameElement.textContent = role;
                slotElement.appendChild(roleNameElement)
                
                const slotSpaceElement = document.createElement("td");
                slotSpaceElement.className = "text-center"
                if (player === -2) {
                    const slotJoinElement = getButton(`join-${team}-${role}`, "button", "Join", false);
                    slotJoinElement.addEventListener('click', async () => {
                        //TODO: add the player to this slot in the backend
                        //The slot would consist in vars team + role
                        //TODO: Somehow this has to be different between friendly and ranked!!
                        console.log(`Player added to team ${team} and role ${role}!`) //How to have access to userid?
                        this.renderSlots();
                    })
                    slotSpaceElement.appendChild(slotJoinElement);
                } else {
                    const playerElement = document.createElement("p");
                    playerElement.className = "text-xl p-2"
                    playerElement.textContent = player;
                    slotSpaceElement.appendChild(playerElement);
                }
                slotElement.appendChild(slotSpaceElement);
                slotsTable.appendChild(slotElement);
            }
        }
        teamsElement.appendChild(slotsTable);
    },

    renderParticipants() {
        const participants = [
            {
                nick: "artuda-s",
                rank: 1800,
                score: 3
            },
            {
                nick: "dmelo-ca",
                rank: 1600,
                score: 1
            },
            {
                nick: "ndo-vale",
                rank: 1700,
                score: 0
            }
        ] //TODO: GET THIS FROM DB. DO NOT FORGET TO ORDER BT POINTS!!!!


        const participantsElement = document.getElementById('participants');

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
        

        const joinWithdrawButton = getButton("btn-join-withdraw", "button", this.participating ? "Withdraw" : "Join", false)
        joinWithdrawButton.classList.add("w-full");

        participantsElement.appendChild(joinWithdrawButton)
    },

    participating: false
}