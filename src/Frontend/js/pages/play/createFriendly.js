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

        const form = document.getElementById('lobby-creation-form');
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            //TODO put here the logic to create the lobby in the backend
            window.router.navigateTo('/lobby-friendly')
        })
        console.log('Create Friendly page loaded!')
    },
}