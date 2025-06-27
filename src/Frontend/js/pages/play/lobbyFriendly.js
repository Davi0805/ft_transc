import { LobbyMatchPage } from "./templates/lobbyMatch.js"

/* export enum SLOT_TYPES = {
    INEXISTENT = -3,
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
                front: -3,
                back: 123
            },
            RIGHT: {
                front: -3,
                back: -2
            },
            TOP: {
                front: -3,
                back: -2
            },
            BOTTOM: {
                front: -3,
                back: -2
            },
        } //TODO: This has to be a function that returns this object

        const teamsElement = document.getElementById('slots');
        let slotsHtml = "";
        for (const [team, roles] of Object.entries(slots)) {
            slotsHtml += `<div class="flex flex-col">`;
            slotsHtml += `<h3>${team}</h3>`
            if (roles.front !== -3) {
                slotsHtml += `<div class="flex flex-row>"`
                slotsHtml += `<p>front</p>`
                if (roles.back === -2) {
                    slotsHtml += `<button type="button">Join</button>`
                } else {
                    slotsHtml += `<p>${roles.front}</p>` //TODO: Get info of player with this userid instead
                }
                slotsHtml += `</div>`
            }
            if (roles.back !== -3) {
                slotsHtml += `<div class="flex flex-row>"`
                slotsHtml += `<p>back</p>`
                if (roles.back === -2) {
                    slotsHtml += `<button type="button">Join</button>`
                } else {
                    slotsHtml += `<p>${roles.back}</p>` //TODO: Get info of player with this userid instead
                }
                slotsHtml += `</div>`
            }
            slotsHtml += `</div>`;
        }

        teamsElement.innerHTML = slotsHtml;
    },

    renderSettings() {
        const lobbySettingsElement = document.getElementById('lobby-settings');
        const lobbySettingsListing = {
            type: "Friendly Match",
            name: "Some lobby",
            map: "1v1 medium",
            mode: "modern",
            length: "marathon"
        } //TODO: Get Lobby Settings from db

        let settingsListingHtml = ""
        for (let setting in lobbySettingsListing) {
            settingsListingHtml += `
                <div class="flex flex-row">
                    <p>${setting}</p><p>${lobbySettingsListing[setting]}</p>
                </div>
            `
        }
        let lobbySettingsHtml = `
            <div id="settings-listing" class="flex flex-col">
                ${settingsListingHtml}
                <button id="btn-change-settings" type="button" class="bg-gray-900/50 bg-opacity-60 p-2 rounded-4xl hover:bg-gray-900/90 active:bg-gray-900/25">Change lobby settings</button>
            </div>
        `;
        lobbySettingsElement.innerHTML = lobbySettingsHtml;

        const buttonChangeSettings = document.getElementById('btn-change-settings');
        buttonChangeSettings.addEventListener('click', () => this.renderChangeSettings())
    },

    renderChangeSettings() {
        const lobbySettingsElement = document.getElementById('lobby-settings');
        const lobbySettingsListing = {
            type: "Friendly Match",
            name: "Some lobby",
            map: "1v1 medium",
            mode: "modern",
            length: "marathon"
        } //TODO: Get Lobby Settings from db

        let settingsListingHtml = ""
        for (let setting in lobbySettingsListing) {

            settingsListingHtml += `
                <div class="flex flex-row">
                    <p>${setting}</p><input type="text" name="${setting}" value="${lobbySettingsListing[setting]}" ${setting === "type" ? "readonly" : "required"}></input>
                </div>
            `
        }
        let lobbySettingsHtml = `
            <form id="settings-change-form" class="flex flex-col">
                ${settingsListingHtml}
                <button id="btn-change-settings" type="submit" class="bg-gray-900/50 bg-opacity-60 p-2 rounded-4xl hover:bg-gray-900/90 active:bg-gray-900/25">Apply</button>
            </div>
        `;
        lobbySettingsElement.innerHTML = lobbySettingsHtml;

        const formChangeSettings = document.getElementById('settings-change-form');
        formChangeSettings.addEventListener('submit', async (e) => {
            e.preventDefault();
            //TODO: Update the database here with new lobby settings
            this.renderSettings()
        })
    },
}