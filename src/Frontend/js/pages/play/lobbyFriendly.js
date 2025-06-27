import { LobbyMatchPage } from "./templates/lobbyMatch.js"
import { getLobbyOptionsHTML } from "./utils/concreteComponents.js";
import { getButtonHTML } from "./utils/stylingComponents.js";

/* export enum SLOT_TYPES = {
    EMPTY = -2,
    BOT = -1
} */

export const LobbyFriendlyPage = {
    template() {
        return LobbyMatchPage.template();
    },

    init() {
        //Set title
        const titleElement = document.getElementById('lobby-title');
        titleElement.textContent = "Friendly Match Lobby" //TODO: Probably should get the name of the lobby instead?

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
        for (const [team, roles] of Object.entries(slots)) {
            const teamElement = document.createElement("div");
            teamElement.className = "flex flex-col";

            const teamNameElement = document.createElement("h3");
            teamNameElement.textContent = team;
            teamElement.appendChild(teamNameElement);
            
            for (const [role, player] of Object.entries(roles)) {
                const slotElement = document.createElement("div");
                slotElement.className = "flex flex-row";

                const roleNameElement = document.createElement("p");
                roleNameElement.textContent = role;
                slotElement.appendChild(roleNameElement)
                
                if (player === -2) {
                    const slotJoinElement = document.createElement("button");
                    slotJoinElement.type = "button";
                    slotJoinElement.textContent = "Join";
                    slotJoinElement.addEventListener('click', async () => {
                        //TODO: add the player to this slot in the backend
                        //The slot would consist in vars team + role
                        console.log(`Player added to team ${team} and role ${role}!`) //How to have access to userid?
                        this.renderSlots();
                    })
                    slotElement.appendChild(slotJoinElement);
                } else {
                    const playerElement = document.createElement("p");
                    playerElement.textContent = player;
                    slotElement.appendChild(playerElement);
                }
                teamElement.appendChild(slotElement);
            }
            teamsElement.appendChild(teamElement);
        }
    },

    renderSettings() {
        const lobbySettingsElement = document.getElementById('lobby-settings');
        const lobbySettingsListing = {
            type: "Friendly Match",
            name: "Some lobby",
            map: "1v1-medium",
            mode: "modern",
            length: "marathon"
        } //TODO: Get Lobby Settings from db

        let lobbySettingsHtml = `
            <div id="settings-listing" class="flex flex-col">
                ${getLobbyOptionsHTML(false, lobbySettingsListing)}
                ${getButtonHTML("btn-change-settings", "button", "Change lobby settings")}
            </div>
        `;
        lobbySettingsElement.innerHTML = lobbySettingsHtml;

        const buttonChangeSettings = document.getElementById('btn-change-settings');
        buttonChangeSettings.addEventListener('click', () => this.renderChangeSettings(lobbySettingsListing))
    },

    renderChangeSettings(lobbySettingsListing) {
        const lobbySettingsElement = document.getElementById('lobby-settings');
        let settingsListingHtml = getLobbyOptionsHTML(true, lobbySettingsListing);
        /* for (let setting in lobbySettingsListing) {

            settingsListingHtml += `
                <div class="flex flex-row">
                    <p>${setting}</p><input type="text" name="${setting}" value="${lobbySettingsListing[setting]}" ${setting === "type" ? "readonly" : "required"}></input>
                </div>
            `
        } */
        let lobbySettingsHtml = `
            <form id="settings-change-form" class="flex flex-col">
                ${getLobbyOptionsHTML(true, lobbySettingsListing)}
                ${getButtonHTML("apply-lobby-settings", "submit", "Apply")}
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