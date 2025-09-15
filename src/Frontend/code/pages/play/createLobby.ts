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
    <div class="h-[550px] w-[510px] bg-gradient-to-b from-blue-500 via-blue-800 to-neutral-900 shadow-2xl shadow-black border-y border-black text-myWhite rounded-xl p-8">
      <!-- Title and description -->
      <div class="text-center mb-8">
          <h1 class="text-3xl font-bold text-white mb-2">New Lobby</h1>
          <p class="text-white/70">Create a new game lobby</p>
      </div>
    
      <!-- Lobby creation form -->
      <form id="lobby-creation-form" class="space-y-6">
        <!-- Lobby Name -->
        <div class="flex flex-row items-center justify-between gap-4">
          <label for="lobby-name" class="text-base font-medium text-myWhite/90 min-w-fit">Name</label>
          <input 
              id="lobby-name" 
              name="lobby-name" 
              type="text" 
              class="h-11 w-[350px] ml-auto rounded-3xl border-2 border-black/20 bg-myWhite px-[20px] py-[20px] pr-[45px] text-base font-medium text-black caret-black outline-none focus:border-transparent focus:ring-2 focus:ring-blue-300  transition-all duration-200 ease-in"
              placeholder="Enter lobby name"
              required
          >
        </div>


        <div class="flex flex-row items-center justify-between gap-4">
            <label for="lobby-type" class="text-base font-medium text-myWhite/90 min-w-fit">Type</label>
            <select 
                id="lobby-type" 
                name="lobby-type" 
                class="h-11 w-[350px] ml-auto rounded-3xl border-2 border-black/20 bg-myWhite text-base pl-[20px] font-medium  text-black outline-none focus:border-transparent focus:ring-2 focus:ring-blue-300  transition-all duration-200 ease-in"
                required
            >
                <option value="friendly">Friendly Match</option>
                <option value="ranked">Ranked Match</option>
                <option value="tournament">Tournament</option>
            </select>
        </div>


        <div id="mutable-settings" class="flex flex-col w-full gap-4"></div>

        <div class="flex flex-row items-center justify-center gap-4 mt-8">
                <button 
                    type="button" 
                    id="btn-return" 
                    class="rounded-lg bg-slate-600/80 px-6 py-2 font-semibold text-myWhite transform active:scale-85 transition-all duration-100 hover:bg-blue-700"
                >
                    Return
                </button>
                <button 
                    type="submit" 
                    class="rounded-lg bg-blue-600  px-6 py-2 font-semibold text-myWhite transform active:scale-85 transition-all duration-100 hover:bg-blue-700"
                >
                    Create Lobby
                </button>
            </div>
      </form>
    </div>            
        `;
  },

  init() {
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
    const lobbyInfo = await lobbySocketService.connect(lobbyID);
    if (!lobbyInfo) {throw Error("Socket was already connected somehow!")}
    lobbyService.init(selfData.id, lobbyInfo.lobby)
    router.navigateTo('/lobby')
  }
};
