import { lobbyService } from "../../services/LobbyService";
import { ALobbyRenderer } from "./renderers/ALobbyRenderer";
import { createLobbyRenderer } from "./renderers/createLobbyRenderer";

export const LobbyPage = {
    renderer: null as ALobbyRenderer | null,

    template() {
        return `
            <div class="w-full h-[calc(100vh-240px)] min-h-[625px] px-4 py-4 lg:px-16 lg:py-8 max-w-5xl mx-auto">
            <div class="flex rounded-xl bg-gradient-to-b from-blue-500 via-blue-800 to-neutral-900 shadow-2xl shadow-black border-y border-black text-white w-full h-full overflow-hidden">
                <!-- LEFT: teams / players area -->
                <div class="flex-1 p-4 lg:p-8 flex flex-col gap-3 lg:gap-5 relative overflow-hidden">
                    <div class="text-center mb-4 lg:mb-8">
                        <h1 id="lobby-title" class="text-2xl lg:text-4xl font-bold mb-2 tracking-widest"></h1>
                        <h3 id="lobby-subtitle" class="text-base lg:text-xl opacity-80"></h3>
                    </div>
                    <div id="players" class="grid grid-cols-1 gap-3 flex-1 min-h-0 overflow-y-auto no-scrollbar">
                    </div>
                    <h3 id="current-round"></h3>
                </div>
                <!-- RIGHT: sidebar -->
                <div id="lobby-settings-and-buttons" class="w-56 lg:w-72 bg-black/20 p-3 lg:p-6 flex flex-col border-l border-white/10 relative">
                    <div id="lobby-settings" class="flex flex-col">
                    </div>
                    <div class="mt-auto h-px bg-gradient-to-r from-transparent via-white/20 to-transparent my-4 lg:my-5"></div>
                    <div id="lobby-buttons" class="flex flex-col gap-2 lg:gap-4">
                    </div>
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

        //Renders the settings (right half, settings tab)
        await this.renderer.renderSettings(
            lobbyService.lobby.type,
            lobbyService.lobby.matchSettings,
            lobbyService.amIHost()
        );

        //Renders the buttons (right half, actions tab)
        await this.renderer.renderActionButtons(lobbyService.amIHost());

        console.log('Lobby page loaded!')
    },
}
