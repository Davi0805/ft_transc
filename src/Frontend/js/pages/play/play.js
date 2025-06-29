import { getTable } from "./utils/stylingComponents.js";

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
                        <button id="btn-new-friendly" type="button" class="bg-gray-900/50 bg-opacity-60 p-5 rounded-4xl hover:bg-gray-900/90 active:bg-gray-900/25">New Friendly Match</button>
                        <button id="btn-new-ranked" type="button" class="bg-gray-900/50 p-5 rounded-4xl hover:bg-gray-900/90 active:bg-gray-900/25">New Ranked Match</button>
                        <button id="btn-new-tournament" type="button" class="bg-gray-900/50 p-5 rounded-4xl hover:bg-gray-900/90 active:bg-gray-900/25">New Tournament</button>
                    </div>
                </div>
            </div>
        `
    },

    init() {
        const lobbiesHead = document.getElementById('lobbies-head');
        lobbiesHead.innerHTML = this.getLobbyCategoriesHtml();

        this.updateCurrentLobbiesHtml();

        const buttonRefresh = document.getElementById('btn-refresh');
        buttonRefresh.addEventListener('click', () => this.updateCurrentLobbiesHtml());

        const buttonNewFriendly = document.getElementById('btn-new-friendly');
        const buttonNewRanked = document.getElementById('btn-new-ranked');
        const buttonNewTournament = document.getElementById('btn-new-tournament');
        buttonNewFriendly.addEventListener('click', () => window.router.navigateTo('/create-friendly'));
        buttonNewRanked.addEventListener('click', () => window.router.navigateTo('/create-ranked'));
        buttonNewTournament.addEventListener('click', () => window.router.navigateTo('/create-tournament'));

        
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

    updateCurrentLobbiesHtml() {
        const lobbiesBody = document.getElementById('lobbies-body');
        lobbiesBody.innerHTML = ""

        const lobbiesInfo = [
            {
                name: "Blobby Lobby",
                host: "ndo-vale",
                type: "friendly",
                capacity: "6/8",
                mode: "Classic",
                map: "4-sided-teams",
                matchLength: 300
            },
            {
                name: "Lelelele",
                host: "artuda",
                type: "tournament",
                capacity: "5/100",
                mode: "Modern",
                map: "1v1-small",
                matchLength: 150
            }
        ] // TODO change this for a function that gets this info from database

        for (let i = 0; i < lobbiesInfo.length; i++) {
            const row = document.createElement("tr");
            row.className = "hover:bg-gray-900/90 active:bg-gray-900/25"
            
            Object.values(lobbiesInfo[i % 2]).forEach(item =>{
                const bdBrightness = i % 2 === 0 ? "bg-gray-900/0" : "bg-gray-900/25";
                const tdata = document.createElement('td');
                tdata.className = `${bdBrightness} px-6 py-2 wrap-anywhere`;
                tdata.textContent = item;
                row.appendChild(tdata);
            })
            row.addEventListener('click', () => this.goToLobby(lobbiesInfo[i].name)) //TODO pass whatever is necessary to identify the lobby
            lobbiesBody.appendChild(row)
        }

        console.log("Lobby list updated!")
    },

    goToLobby(name) {
        //TODO: Logic to go to a lobby goes here
        console.log(`Should go to lobby ${name}`)
    }
}