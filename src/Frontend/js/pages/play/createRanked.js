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
        
        const form = document.getElementById('lobby-creation-form');
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            //TODO put here the logic to create the lobby in the backend
            window.router.navigateTo('/lobby-ranked')
        })
        
        console.log('Create Ranked page loaded!')
    },
}