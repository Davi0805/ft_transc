import { LobbyMatchPage } from "./templates/lobbyMatch.js"

export const LobbyFriendlyPage = {
    template() {
        return LobbyMatchPage.template();
    },

    init() {
        //Set title
        const titleElement = document.getElementById('lobby-title');
        titleElement.textContent = "Friendly Match Lobby" //TODO: Probably should get the name of the lobby instead?


        //Set slots
        // -1: doesnt exist; 0: empty slot; 1+: userid
        const slots = {
            LEFT: {
                front: -1,
                back: 123
            },
            RIGHT: {
                front: -1,
                back: 0
            },
            TOP: {
                front: -1,
                back: 0
            },
            BOTTOM: {
                front: -1,
                back: 0
            },
        } //TODO: This has to be a function that returns this object

        const teamsElement = document.getElementById('slots');
        let slotsHtml = "";
        for (const [team, roles] of Object.entries(slots)) {
            slotsHtml += `<div class="flex flex-col">`;
            slotsHtml += `<h3>${team}</h3>`
            if (roles.front !== -1) {
                slotsHtml += `<div class="flex flex-row>"`
                slotsHtml += `<p>front</p>`
                if (roles.back === 0) {
                    slotsHtml += `<button type="button">Join</button>`
                } else {
                    slotsHtml += `<p>${roles.front}</p>` //TODO: Get info of player with this userid instead
                }
                slotsHtml += `</div>`
            }
            if (roles.back !== -1) {
                slotsHtml += `<div class="flex flex-row>"`
                slotsHtml += `<p>back</p>`
                if (roles.back === 0) {
                    slotsHtml += `<button type="button">Join</button>`
                } else {
                    slotsHtml += `<p>${roles.back}</p>` //TODO: Get info of player with this userid instead
                }
                slotsHtml += `</div>`
            }
            slotsHtml += `</div>`;
        }

        teamsElement.innerHTML = slotsHtml;


        //Set settings
        const settingsListingElement = document.getElementById('settings-listing')
        const lobbySettings = {
            type: "Friendly Match",
            name: "Some lobby",
            map: "1v1 medium",
            mode: "modern",
            length: "marathon"
        }
        let lobbySettingsHtml = "";
        for (let setting in lobbySettings) {
            lobbySettingsHtml += `<p>${setting}: ${lobbySettings[setting]}</p>`
        }
        settingsListingElement.innerHTML = lobbySettingsHtml;



        console.log('Lobby Friendly page loaded!')
    }
}