import { LobbyMatchPage } from "./templates/lobbyMatch.js"

export const LobbyFriendlyPage = {
    template() {
        return LobbyMatchPage.template();
    },

    init() {
        console.log('Lobby Friendly page loaded!')
    }
}