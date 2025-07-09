import { getSelfData } from "../../api/getSelfDataAPI";
import { getLobbySettings} from "../../api/lobbyMatchAPI/getLobbySettingsAPI";
import { TLobbyType } from "./lobbyTyping";
import { router } from "../../routes/router";
import { lobbySocketService } from "../../services/lobbySocketService";
import { getTable } from "./utils/stylingComponents";
import { lobby } from "../../services/LobbyService";

export const PlayPage = {
    template() {
        return `
            <div class="flex flex-col items-center justify-center h-full backdrop-blur-3xl border-2 border-black/40 shadow-sm text-white rounded-lg px-16 py-12">
                <h1 class="text-3xl p-3">Play Center</h1>
                <div id="match-center-body" class="flex flex-col min-h-0 gap-4">
                    <div id="lobby-list" class="flex flex-col min-h-0 gap-4">
                        <div class="flex flex-row justify-between">
                            <h2 class="text-2xl p-2">Lobby list</h2>
                            <button id="btn-refresh" type="button" class="bg-gray-900/50 p-2 rounded-4xl hover:bg-gray-900/90 active:bg-gray-900/25">Refresh</button>
                        </div>
                        ${getTable("lobbies", "", "").outerHTML}
                    </div>
                    <div id="new-buttons" class="flex flex-row gap-4 items-center justify-center text-xl">
                        <button id="btn-new-lobby" type="button" class="bg-gray-900/50 p-5 rounded-4xl hover:bg-gray-900/90 active:bg-gray-900/25">New Lobby</button>
                    </div>
                </div>
            </div>
        `
    },

    init() {
        const lobbiesHead = document.getElementById('lobbies-head') as HTMLElement;
        lobbiesHead.innerHTML = this.getLobbyCategoriesHtml();

        this.updateCurrentLobbiesHtml();

        const buttonRefresh = document.getElementById('btn-refresh') as HTMLElement;
        buttonRefresh.addEventListener('click', () => this.updateCurrentLobbiesHtml());

        const buttonNewLobby = document.getElementById('btn-new-lobby') as HTMLElement;
        buttonNewLobby.addEventListener('click', () => router.navigateTo('/create-lobby'));
    },

    getLobbyCategoriesHtml() {
        const lobbyCategories = ["NAME", "HOST", "TYPE", "CAPACITY", "MODE", "MAP", "MATCH LENGTH"]
        let lobbyCategoriesHtml = "";
        lobbyCategoriesHtml += `<tr class="backdrop-brightness-60 text-left">`;
        for (let category of lobbyCategories) {
            lobbyCategoriesHtml += `<th class="border-l border-white/50 px-6 py-2 relative">${category}</th>`
        }
        lobbyCategoriesHtml += `</tr>`
        return lobbyCategoriesHtml;
    },

    async updateCurrentLobbiesHtml() {
        const lobbiesBody = document.getElementById('lobbies-body') as HTMLElement;
        lobbiesBody.innerHTML = ""

        const lobbiesInfo = await getLobbySettings();

        for (let i = 0; i < lobbiesInfo.length; i++) {
            const row = document.createElement("tr");
            const bgBrightness = i % 2 === 0 ? "bg-gray-900/0" : "bg-gray-900/25";
            row.className = `${bgBrightness} hover:bg-gray-900/90 active:bg-gray-900/25`
            
            Object.values(lobbiesInfo[i]).forEach(item => {
                const tdata = document.createElement('td');
                tdata.className = `px-6 py-2 wrap-anywhere`;
                tdata.textContent = item.toString();
                row.appendChild(tdata);
            })
            row.addEventListener('click', () => this.goToLobby(lobbiesInfo[i].id))
            lobbiesBody.appendChild(row)
        }

        console.log("Lobby list updated!")
    },

    async goToLobby(id: number) {
        lobbySocketService.connect(id);
        router.navigateTo('/lobby')
    }
}