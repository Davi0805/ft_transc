import { CreateLobbyPage } from "./templates/createLobby.js";
import { getLobbyOptionsHTML } from "./utils/concreteComponents.js";

export const CreateRankedPage = {
    template() {
        return CreateLobbyPage.template();
    },

    init() {
        
        const title = document.getElementById('create-lobby-title');
        title.textContent = "New Ranked Match"

        const lobbyOptions = document.getElementById('lobby-options');
        lobbyOptions.innerHTML += getLobbyOptionsHTML(true, "ranked");

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