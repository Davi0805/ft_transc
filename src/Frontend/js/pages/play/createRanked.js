import { CreateLobbyPage } from "./templates/createLobby.js";

export const CreateRankedPage = {
    template() {
        return CreateLobbyPage.template();
    },

    init() {
        const title = document.getElementById('create-lobby-title');
        title.textContent = "New Ranked Match"

        const buttonReturn = document.getElementById('btn-return');
        buttonReturn.addEventListener('click', () => window.router.navigateTo('/play'))
        console.log('Create Ranked page loaded!')
    }
}