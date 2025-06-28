import { LobbyMatchPage } from "./templates/lobbyMatch.js"
import { getLobbyOptionsHTML } from "./utils/concreteComponents.js";
import { getButton } from "./utils/stylingComponents.js";

/* export enum SLOT_TYPES = {
    EMPTY = -2,
    BOT = -1
} */

export const LobbyFriendlyPage = {
    template() {
        return LobbyMatchPage.template();
    },

    init() {
        const lobbySettingsListing = {
            name: "Some lobby",
            map: "1v1-medium",
            mode: "modern",
            duration: "marathon"
        } //TODO: Get Lobby Settings from db

        const titleElement = document.getElementById('lobby-title');
        titleElement.textContent = lobbySettingsListing.name //TODO: Probably should get the name of the lobby instead?
        const subtitleElement = document.getElementById('lobby-subtitle');
        subtitleElement.textContent = "Friendly Match Lobby"
        this.renderSlots();

        this.renderSettings();

        console.log('Lobby Friendly page loaded!')
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
        teamsElement.innerHTML = ""; //Clean current content
        const slotsTable = document.createElement('table');
        /* slotsTable.className = "w-full" */
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
            <form id="settings-change-form" class="flex flex-col">
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