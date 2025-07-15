import { LobbyMatchPage } from "./templates/lobbyMatch"

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

        const titleElement = document.getElementById('lobby-title') as HTMLElement;
        titleElement.textContent = lobbySettingsListing.name //TODO: Probably should get the name of the lobby instead?
        const subtitleElement = document.getElementById('lobby-subtitle') as HTMLElement;
        subtitleElement.textContent = "Friendly Match Lobby"
        
        LobbyMatchPage.renderSlots(false);
        LobbyMatchPage.renderSettings();
        LobbyMatchPage.activateButtons();

        console.log('Lobby Friendly page loaded!')

        //
    },
}