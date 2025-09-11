import { router } from "../../routes/router";
import { lobbySocketService } from "../../services/lobbySocketService";
import { getAllLobbies } from "../../api/lobbyMatchAPI/getAllLobbiesAPI";
import { getSelfData } from "../../api/userData/getSelfDataAPI";
import { lobbyService } from "../../services/LobbyService";

export const PlayPage = {
    template() {
        return `
            <div class="relative h-[650px] w-[800px] overflow-hidden bg-gradient-to-b from-blue-500 via-blue-800 to-neutral-900 shadow-2xl shadow-black border-y border-black text-myWhite rounded-xl p-8">
            
                <!-- Content Container -->
                <div class="flex items-center h-full flex-col p-8">
    
                    <!-- Container Title -->
                    <div class="text-center mb-8">
                        <h1 class="text-3xl font-bold text-myWhite mb-2">Play Center</h1>
                        <p class="text-white/70">Choose a lobby to join</p>
                    </div>

                    <!-- Lobby listing section -->
                    <div class="flex min-h-0 flex-1 flex-col gap-4">

                        <!-- Subtitle and refresh header -->
                        <div class="flex items-center justify-start gap-5">
                            <label for="btn-refresh" class="cursor-pointer text-2xl font-bold text-white hover:text-white/80 active:scale-95 transition-all duration-200">Lobby list</label>
                            <button id="btn-refresh" type="button" class="flex h-6 w-6 cursor-pointer items-center justify-center rounded-full border-none bg-gray-900/50 text-white transition-all duration-200 hover:bg-gray-900/90 active:bg-gray-900/50 active:scale-95">
                                <svg class="h-[18px] w-[18px] fill-current" viewBox="0 0 24 24">
                                <path d="M17.65 6.35C16.2 4.9 14.21 4 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08c-.82 2.33-3.04 4-5.65 4-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z" />
                                </svg>
                            </button>
                        </div>

                        <!-- Table with a sticky head. Allways 5 entries min (empty or filled) -->
                        <div class="min-h-0 flex-1 overflow-y-auto rounded-xl border border-white/10 bg-gray-900/30">
                            <table class="w-[600px] border-collapse table-fixed">
                                <thead id="lobbies-head" class="sticky top-0  bg-gray-900 h-14">
                                    <tr>
                                        <th class="h-14 px-6 py-3 text-center text-lg font-bold tracking-wider text-gray-300 uppercase">NAME</th>
                                        <th class="h-14 px-6 py-3 text-center text-lg font-bold tracking-wider text-gray-300 uppercase">HOST</th>
                                        <th class="h-14 px-6 py-3 text-center text-lg font-bold tracking-wider text-gray-300 uppercase">TYPE</th>
                                        <th class="h-14 px-6 py-3 text-center text-lg font-bold tracking-wider text-gray-300 uppercase">CAPACITY</th>
                                    </tr>
                                </thead>
                                <tbody id="lobbies-body">
                                </tbody>
                            </table>
                        </div>
                    </div>

                     <div id="new-buttons" class="mt-4 flex items-center justify-center">
                        <button id="btn-new-lobby" type="button" class="cursor-pointer rounded-lg bg-blue-600 px-6 py-2 font-semibold text-white transform active:scale-85 transition-all duration-100 hover:bg-blue-700">New Lobby</button>
                    </div>
                </div>
            </div>
        `
    },

    init() {
        //TODO: Add a check to see if user is in lobby. If yes, instead of running the below, just display a big button that allows the user to get in the lobby that it is in.
        // This is for the case the user exits a lobby in an unintended way, like disconnecting

        const lobbiesHead = document.getElementById('lobbies-head') as HTMLElement; //"lobbies-head" is an id created by getTable()
        this.updateCurrentLobbiesHtml();

        const buttonRefresh = document.getElementById('btn-refresh') as HTMLElement;
        buttonRefresh.addEventListener('click', () => this.updateCurrentLobbiesHtml());

        const buttonNewLobby = document.getElementById('btn-new-lobby') as HTMLElement;
        buttonNewLobby.addEventListener('click', () => router.navigateTo('/create-lobby'));
    },

    async updateCurrentLobbiesHtml() {
        const lobbiesInfo = await getAllLobbies(); //Info fetching from backend

        //RENDERING
        const lobbiesBody = document.getElementById('lobbies-body') as HTMLElement; //"lobbies-body" is an id created by getTable()
        lobbiesBody.innerHTML = ""
        const categories = ["name", "host", "type", "capacity"] as const

        for (let i = 0; i < lobbiesInfo.length; i++) {
            const lobby = lobbiesInfo[i]
            let rowData: string[] = [];
                
            categories.forEach(category => {
                if (category === "capacity") {
                    rowData.push(`${lobby["capacity"].taken}/${lobby["capacity"].max}`);
                } else {
                    rowData.push(lobby[category].toString());
                }
            })

            const row = document.createElement("tr");
            row.classList = "w-full h-12 cursor-pointer text-center border-b border-white/10 bg-gray-900/20 transition-colors duration-200 hover:bg-gray-900/60 active:bg-gray-900/25";
            
            row.innerHTML = `
                <td class="px-1 py-3 text-base leading-none text-gray-300 font-bold w-[178px] truncate">${rowData[0]}</td>
                <td class="px-1 py-3 text-base leading-none text-gray-300 font-bold w-[178px] truncate">${rowData[1]}</td>
                <td class="px-1 py-3 text-base leading-none text-gray-300 font-bold w-[96px] truncate capitalize">${rowData[2]}</td>
                <td class="px-1 py-3 text-base leading-none text-gray-300 font-bold w-[148px] truncate">${rowData[3]}</td>
            `;

            //Allows the user to click on a lobby in the list and go to it
            row.addEventListener('click', () => this.goToLobby(lobbiesInfo[i].id))

            lobbiesBody.appendChild(row)
        }
    },

    //Logic to get into a lobby
    async goToLobby(lobbyId: number) {
        const selfData = await getSelfData();
        const lobby = await lobbySocketService.connect(lobbyId);
        if (!lobby) {throw Error("Socket was already connected somehow!")}
        lobbyService.init(selfData.id, lobby)
        router.navigateTo('/lobby')
    }
}