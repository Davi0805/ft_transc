import { getButton } from "../utils/stylingComponents.js";
import { getLobbyOptionsHTML } from "../utils/concreteComponents.js";

export const LobbyMatchPage = {
    template() {
        return `
            <div class="flex flex-col w-fit items-center justify-center backdrop-blur-3xl border-2 border-black/40 shadow-sm text-white rounded-lg px-16 py-12 overflow-hidden gap-3">
                <h1 id="lobby-title" class="text-3xl p-2"></h1>
                <h3 id="lobby-subtitle" class="text-xl p-1"></h3>
                <div id="lobby-body" class="flex flex-row w-full gap-3">
                    <div id="slots" class="flex flex-col min-w-[300px] border-2 rounded-2xl border-gray-900/75 overflow-hidden">
                    </div>
                    <div id="lobby-settings-and-buttons" class="flex flex-col justify-between">
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

        const teamsElement = document.getElementById('slots');
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
}