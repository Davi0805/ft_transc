import { LobbyMatchPage } from "./templates/lobbyMatch.js";

export const LobbyTournamentPage = {
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
        
        LobbyMatchPage.renderParticipants();
        LobbyMatchPage.renderSettings();
        console.log('Lobby Tournament page loaded!')
    }
}