import { getLobbyOptionsHTML } from "./utils/concreteComponents";
import { router } from "../../routes/router";
import { getSelfData } from "../../api/userData/getSelfDataAPI";
import { createLobby } from "../../api/lobbyMatchAPI/createLobbyAPI";
//import { createLobby } from "../../testServices/testLobbyAPI";
import { lobbySocketService } from "../../services/lobbySocketService";
//import { lobbySocketService } from "../../testServices/testLobySocketService";
import { TLobbyType, TMap, TMode, TDuration, LobbyCreationConfigsDTO } from "./lobbyTyping";
import { lobbyService } from "../../services/LobbyService";


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
                                <option value="friendly">Friendly Match</option>
                                <option value="ranked">Ranked Match</option>
                                <option value="tournament">Tournament</option>
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
        `;
  },

  init() {
    const title = document.getElementById("create-lobby-title") as HTMLElement;
    title.textContent = "New Lobby";

    const lobbyTypeInput = document.getElementById(
      "lobby-type"
    ) as HTMLSelectElement;

    //Updates the match options available depending on the type of lobby
    lobbyTypeInput.addEventListener("change", () =>
      this._updateLobbyOptions(
        lobbyTypeInput.options[lobbyTypeInput.selectedIndex].value as TLobbyType
      )
    );

    //This just renders the match options depending on the default lobby type
    this._updateLobbyOptions(
      lobbyTypeInput.options[lobbyTypeInput.selectedIndex].value as TLobbyType
    );

    const buttonReturn = document.getElementById("btn-return") as HTMLElement;
    buttonReturn.addEventListener("click", () => router.navigateTo("/play"));

    const form = document.getElementById('lobby-creation-form') as HTMLFormElement;
    form.addEventListener('submit', async (e) => {
      await this._onCreateLobbyClicked(e);
    })
  },

  _updateLobbyOptions(currentType: TLobbyType) {
    const mutableSettings = document.getElementById(
      "mutable-settings"
    ) as HTMLElement;
    mutableSettings.innerHTML = "";
    mutableSettings.innerHTML += getLobbyOptionsHTML(true, currentType, {
      map: "2-players-small",
      mode: "classic",
      duration: "classical",
    });
  },


  //Logic
  async _onCreateLobbyClicked(e: SubmitEvent) {
    e.preventDefault();
    const form = e.currentTarget as HTMLFormElement;
    if (!form.reportValidity()) return;
    const formData = new FormData(form);

    const selfData = await getSelfData();
    const nameInput = formData.get("lobby-name")?.toString();
    const typeInput = formData.get("lobby-type")?.toString();
    const matchMapInput = formData.get("match-map")?.toString();
    const matchModeInput = formData.get("match-mode")?.toString();
    const matchDurationInput = formData.get("match-duration")?.toString();
    if (!nameInput || !typeInput || !matchMapInput || !matchModeInput || !matchDurationInput) {
      throw Error("Could not fetch form data!")
    }

    const lobbySettings: LobbyCreationConfigsDTO = {
      name: nameInput,
      type: typeInput as TLobbyType,
      matchSettings: {
        map: matchMapInput as TMap,
        mode: matchModeInput as TMode,
        duration: matchDurationInput as TDuration
      }
    }

    const lobbyID = await createLobby(lobbySettings)
    const lobby = await lobbySocketService.connect(lobbyID);
    if (!lobby) {throw Error("Socket was already connected somehow!")}
    lobbyService.init(selfData.id, lobby)
    router.navigateTo('/lobby')
  }
};
