import { CreateLobbyPage } from "./templates/createLobby.js";

export const CreateFriendlyPage = {
    template() {
        return CreateLobbyPage.template();
    },

    init() {
        const title = document.getElementById('create-lobby-title');
        title.textContent = "New Friendly Match"

        const buttonReturn = document.getElementById('btn-return');
        buttonReturn.addEventListener('click', () => window.router.navigateTo('/play'))
        console.log('Create Friendly page loaded!')
    }
}