import { LobbyMatchPage } from "./templates/lobbyMatch.js"

export const LobbyRankedPage = {
    template() {
        return LobbyMatchPage.template();
    },

    init() {
        console.log('Lobby Ranked page loaded!')
    }
}