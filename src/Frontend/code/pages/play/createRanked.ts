import { getSelfData } from "../../api/getSelfDataAPI";
import { createLobby, TLobbyCreationConfigs } from "../../api/lobbyMatchAPI/createLobbyAPI";
import { TMapType, TMatchDuration, TMatchMode } from "../../api/lobbyMatchAPI/getLobbySettingsAPI";
import { router } from "../../routes/router";
import { CreateLobbyPage } from "./templates/createLobby";
import { getLobbyOptionsHTML } from "./utils/concreteComponents";

export const CreateRankedPage = {
    template() {
        return CreateLobbyPage.template();
    },

    init() {
        const title = document.getElementById('create-lobby-title') as HTMLElement;
        title.textContent = "New Ranked Match"

        const lobbyOptions = document.getElementById('lobby-options') as HTMLElement;
        lobbyOptions.innerHTML += getLobbyOptionsHTML(true, "ranked", 
            {id: -1, name: "", map: "1v1-small", mode: "classic", duration: "classical"}
        );

        const buttonReturn = document.getElementById('btn-return') as HTMLElement;
        buttonReturn.addEventListener('click', () => router.navigateTo('/play'))
        
        const form = document.getElementById('lobby-creation-form') as HTMLFormElement;
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const hostName = (await getSelfData()).nickname;
            if (!hostName) { throw Error(); }
            const nameInput = document.getElementById("lobby-name") as HTMLInputElement
            const matchMapInput = document.getElementById("match-map") as HTMLSelectElement
            const matchModeInput = document.getElementById("match-mode") as HTMLSelectElement
            const matchDurationInput = document.getElementById("match-duration") as HTMLSelectElement
            const lobbySettings: TLobbyCreationConfigs = {
                name: nameInput.value,
                host: hostName,
                type: "ranked",
                map: matchMapInput.value as TMapType,
                mode: matchModeInput.value as TMatchMode,
                duration: matchDurationInput.value as TMatchDuration
            }
            await createLobby(lobbySettings);
            router.navigateTo('/lobby-ranked')
        })
        
        console.log('Create Ranked page loaded!')
    },
}