import { lobbyService } from "../../services/LobbyService";
import { ALobbyRenderer } from "./renderers/ALobbyRenderer";
import { createLobbyRenderer } from "./renderers/createLobbyRenderer";

export const LobbyPage = {
    renderer: null as ALobbyRenderer | null,

    template() {
        return `
            <div class="flex flex-col items-center h-full max-h-[650px] justify-center backdrop-blur-3xl border-2 border-black/40 shadow-sm text-white rounded-lg px-16 py-12 gap-3 overflow-hidden">
                <h1 id="lobby-title" class="text-3xl p-2"></h1>
                <h3 id="lobby-subtitle" class="text-xl p-1"></h3>
                <div id="lobby-body" class="flex flex-row w-full min-h-0 gap-3 ">
                    <div id="players" class="flex flex-col min-w-[300px] border-2 rounded-2xl border-gray-900/75 min-h-0 overflow-hidden">
                    </div>
                    <div id="lobby-settings-and-buttons" class="flex flex-col justify-between gap-6 outline outline-2 outline-red-500">
                        <div id="lobby-settings" class="flex flex-col gap-1">
                        </div>
                        <div id="lobby-buttons" class="flex flex-col gap-1">
                        </div>
                    </div>
                </div>
                <h3 id="current-round"></h3>
            </div>
        `;
    },

    async init() {
        //Creates the correct renderer according to the lobby type
        //See Doc at /Doc/Game/LobbyRenderersStructure for details
        this.renderer = createLobbyRenderer(lobbyService.lobby.type)
        //Renders the title and subtitle
        this.renderer.renderTitles(lobbyService.lobby.name);
        //Renders the players of the lobby (left half of the screen). Either the slots or the tournament participants
        this.renderer.renderPlayers();

        //Renders the settings (right half, top)
        await this.renderer.renderSettings(
            lobbyService.lobby.type,
            lobbyService.lobby.matchSettings,
            lobbyService.amIHost()
        );

        //Renders the buttons on the bottom right half of the screen
        await this.renderer.renderActionButtons(lobbyService.amIHost());

        console.log('Lobby Ranked page loaded!')
    },
}