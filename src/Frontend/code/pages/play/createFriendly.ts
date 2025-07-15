import { router } from "../../routes/router";
import { CreateLobbyPage } from "./templates/createLobby";
import { getLobbyOptionsHTML } from "./utils/concreteComponents";

export const CreateFriendlyPage = {
    template() {
        return CreateLobbyPage.template();
    },

    init() {
        const title = document.getElementById('create-lobby-title') as HTMLElement;
        title.textContent = "New Friendly Match"

        const lobbyOptions = document.getElementById('lobby-options') as HTMLElement;
        lobbyOptions.innerHTML += getLobbyOptionsHTML(true, "friendly",
            {id: -1, name: "", map: "1v1-small", mode: "classic", duration: "classical"}); //The default settings

        const buttonReturn = document.getElementById('btn-return') as HTMLElement;
        buttonReturn.addEventListener('click', () => router.navigateTo('/play'))

        const form = document.getElementById('lobby-creation-form') as HTMLFormElement;
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            //TODO put here the logic to create the lobby in the backend
            router.navigateTo('/lobby-friendly')
        })
        console.log('Create Friendly page loaded!')
    },
}