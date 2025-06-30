import { LobbyMatchPage } from "./templates/lobbyMatch.js"

export const LobbyRankedPage = {
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
        titleElement.textContent = lobbySettingsListing.name
        const subtitleElement = document.getElementById('lobby-subtitle');
        subtitleElement.textContent = "Ranked Match Lobby"
        
        LobbyMatchPage.renderSlots(true);
        LobbyMatchPage.renderSettings();
        LobbyMatchPage.activateButtons();

        console.log('Lobby Ranked page loaded!')
    },
}