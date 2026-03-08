import { lobbyService } from "../../services/LobbyService";
import { ALobbyRenderer } from "./renderers/ALobbyRenderer";
import { createLobbyRenderer } from "./renderers/createLobbyRenderer";

export const LobbyPage = {
    renderer: null as ALobbyRenderer | null,

    template() {
        return `
            <div class="flex rounded-xl bg-gradient-to-b from-blue-500 via-blue-800 to-neutral-900 shadow-2xl shadow-black border-y border-black text-white w-full h-full overflow-hidden">
                <div class="flex-1 p-8 flex flex-col gap-5 relative overflow-y-auto">
                    <div class="text-center mb-8">
                        <h1 id="lobby-title" class="text-4xl font-bold mb-2 tracking-widest"></h1>
                        <h3 id="lobby-subtitle" class="text-xl opacity-80"></h3>
                    </div>
                    <div id="players" class="grid grid-cols-2 gap-5 mb-8">
                    </div>
                    <h3 id="current-round"></h3>
                </div>
                <div id="lobby-settings-and-buttons" class="w-96 bg-black/20 p-8 flex flex-col border-l border-white/10 relative">
                    <div id="lobby-settings" class="flex flex-col">
                    </div>
                    <div class="h-px bg-gradient-to-r from-transparent via-white/20 to-transparent my-5"></div>
                    <div id="lobby-buttons" class="mt-auto flex flex-col gap-4">
                    </div>
                </div>
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