import { getLobbyOptionsHTML } from "./utils/concreteComponents";
import { router } from "../../routes/router";
import { getSelfData } from "../../api/getSelfDataAPI";
import { TLobbyCreationConfigs, createLobby } from "../../api/lobbyMatchAPI/createLobbyAPI";
import { lobbySocketService } from "../../services/lobbySocketService";
import { TLobbyType, TMapType, TMatchMode, TMatchDuration, TLobby } from "./lobbyTyping";
import { lobby } from "../../services/LobbyService";
import { getMaxPlayersFromMap } from "./utils/helpers";

export const CreateLobbyPage = {
    template() {
        return `
            <div class="flex flex-col items-center justify-center backdrop-blur-3xl border-2 border-black/40 shadow-sm text-white rounded-lg px-16 py-12">
                <form id="lobby-creation-form" class="flex flex-col items-center justify-center gap-6">
                    <h1 id="create-lobby-title" class="text-3xl p-3"></h1>
                    <div id="lobby-options" class="flex flex-col items-center gap-4">
                        <div class="flex flex-row w-full justify-between gap-4">
                            <label for="lobby-name" class="text-xl">Name:</label>
                            <input id="lobby-name" name="lobby-name" class="bg-gray-900/50 rounded-2xl px-4 text-center" required></input>
                        </div>
                        <div class="flex flex-row w-full justify-between gap-4">
                            <label for="lobby-type" class="text-xl">Type:</label>
                            <select id="lobby-type" name="lobby-type" class="bg-gray-900/50 rounded-2xl px-4 text-center" required>
                                <option id="friendly">Friendly Match</option>
                                <option id="ranked">Ranked Match</option>
                                <option id="tournament">Tournament</option>
                            </select>
                        </div>
                        <div id="mutable-settings" class="flex flex-col w-full gap-4"></div>
                    </div>
                    <div id="create-lobby-form-buttons" class="flex flex-row gap-6">
                        <button id="btn-return" type="button" class="bg-gray-900/50 bg-opacity-60 p-5 rounded-4xl hover:bg-gray-900/90 active:bg-gray-900/25">Return</button>
                        <button type="submit" class="bg-gray-900/50 bg-opacity-60 p-5 rounded-4xl hover:bg-gray-900/90 active:bg-gray-900/25">Create Lobby</button>
                    </div>
                </form>
            </div>
        `
    },

    init() {
        const title = document.getElementById('create-lobby-title') as HTMLElement;
        title.textContent = "New Lobby"

        const lobbyTypeInput = document.getElementById('lobby-type') as HTMLSelectElement;
        lobbyTypeInput.addEventListener('change', () => this._updateLobbyOptions(
            lobbyTypeInput.options[lobbyTypeInput.selectedIndex].id as TLobbyType
        ))

        this._updateLobbyOptions(lobbyTypeInput.options[lobbyTypeInput.selectedIndex].id as TLobbyType)

        const buttonReturn = document.getElementById('btn-return') as HTMLElement;
        buttonReturn.addEventListener('click', () => router.navigateTo('/play'))

        const form = document.getElementById('lobby-creation-form') as HTMLFormElement;
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            //const selfData = await getSelfData();
            const hostName = "lol" //TODO: selfData.nickname;
            if (!hostName) { throw Error(); }
            const nameInput = document.getElementById("lobby-name") as HTMLInputElement
            const typeInput = document.getElementById("lobby-type") as HTMLSelectElement
            const matchMapInput = document.getElementById("match-map") as HTMLSelectElement
            const matchModeInput = document.getElementById("match-mode") as HTMLSelectElement
            const matchDurationInput = document.getElementById("match-duration") as HTMLSelectElement
            const lobbySettings: TLobbyCreationConfigs = {
                name: nameInput.value,
                host: hostName,
                type: typeInput.options[typeInput.selectedIndex].id as TLobbyType,
                map: matchMapInput.value as TMapType,
                mode: matchModeInput.value as TMatchMode,
                duration: matchDurationInput.value as TMatchDuration
            }
            
            //const lobbyID = await createLobby(lobbySettings);
            //lobbySocketService.connect(/*lobbyID*/0); //TODO
            router.navigateTo('/lobby')
        })
        console.log('Create Friendly page loaded!')
    },

    _updateLobbyOptions(currentType: TLobbyType) {
        const mutableSettings = document.getElementById('mutable-settings') as HTMLElement;
        mutableSettings.innerHTML = ""
        mutableSettings.innerHTML += getLobbyOptionsHTML(true, currentType,
            {map: "2-players-small", mode: "classic", duration: "classical"});
    }
}