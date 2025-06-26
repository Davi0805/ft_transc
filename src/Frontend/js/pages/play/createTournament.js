import { CreateLobbyPage } from "./templates/createLobby.js";

export const CreateTournamentPage = {
    template() {
        return CreateLobbyPage.template();
    },

    init() {
        const title = document.getElementById('create-lobby-title');
        title.textContent = "New Tournament";

        const buttonReturn = document.getElementById('btn-return');
        buttonReturn.addEventListener('click', () => window.router.navigateTo('/play'))
        console.log('Create Tournament Page loaded!')
    }
}