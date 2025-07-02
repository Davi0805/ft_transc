import { LobbyMatchPage } from "./templates/lobbyMatch.js"

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

        //Should create websocket here and save it
        
        const titleElement = document.getElementById('lobby-title');
        titleElement.textContent = lobbySettingsListing.name //TODO: Probably should get the name of the lobby instead?
        const subtitleElement = document.getElementById('lobby-subtitle');
        subtitleElement.textContent = "Friendly Match Lobby"
        
        LobbyMatchPage.renderSlots();
        LobbyMatchPage.renderSettings();
        LobbyMatchPage.activateButtons();

        console.log('Lobby Friendly page loaded!')

        //
    },
}