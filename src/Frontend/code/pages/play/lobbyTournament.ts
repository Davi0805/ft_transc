import { LobbyMatchPage } from "./templates/lobbyMatch";

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

        const titleElement = document.getElementById('lobby-title') as HTMLElement;
        titleElement.textContent = lobbySettingsListing.name
        const subtitleElement = document.getElementById('lobby-subtitle') as HTMLElement;
        subtitleElement.textContent = "Friendly Match Lobby"
        
        LobbyMatchPage.renderParticipants();
        LobbyMatchPage.renderSettings();
        LobbyMatchPage.activateButtons();
        console.log('Lobby Tournament page loaded!')
    }
}