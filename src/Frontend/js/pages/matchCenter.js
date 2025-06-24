//? PlayPage is an object with

export const MatchCenterPage = {
    template() {
        const lobbyCategories = ["NAME", "HOST", "TYPE", "CAPACITY", "MODE", "MAP", "MATCH LENGTH"]
        let lobbyCategoriesHtml = "";
        lobbyCategoriesHtml += `<tr class="backdrop-brightness-50 text-left">`;
        for (let category of lobbyCategories) {
            lobbyCategoriesHtml += `<th class="border-l border-current/50 p-2">${category}</th>`
        }
        lobbyCategoriesHtml += `</tr>`

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
                name: "Lelelelele",
                host: "artuda",
                type: "tournament",
                capacity: "5/100",
                mode: "Modern",
                map: "1v1-small",
                matchLength: 150
            }
        ]

        let lobbiesHtml = "";
        for (let i = 0; i < 30; i++) {
            lobbiesHtml += `<tr>`;
            Object.values(lobbiesInfo[i % 2]).forEach(item =>{
                const bdBrightness = i % 2 === 0 ? "backdrop-brightness-100" : "backdrop-brightness-75";
                lobbiesHtml += `<td class="${bdBrightness} p-2">${item}</td>`
            })
            lobbiesHtml += `</tr>`;
        }

        return `
            <div class="flex flex-col items-center justify-center h-full bg-transparent backdrop-blur-3xl border-2 border-black/40 shadow-sm text-white rounded-lg px-[40px] py-[30px]">
                <h1 class="text-3xl p-3">Match Center</h1>
                <div id="match-center-body" class="flex flex-col min-h-0">
                    <div id="lobby-list" class="flex flex-col min-h-0">
                        <h2 class="text-2xl p-2">Lobby list</h2>
                        <div id="lobby-table" class="flex-1 overflow-auto">
                            <table class="table-fixed">
                                ${lobbyCategoriesHtml}
                                ${lobbiesHtml}
                            </table>
                        </div>
                    </div>
                    <div id="new-buttons" class="flex flex-row gap-4 items-center justify-center">
                        <button type="button" class="backdrop-brightness-50 p-5 rounded-4xl">New Friendly Match</button>
                        <button type="button" class="backdrop-brightness-50 p-5 rounded-4xl">New Ranked Match</button>
                        <button type="button" class="backdrop-brightness-50 p-5 rounded-4xl">New Tournament</button>
                    </div>
                </div>
            </div>
        `;
    }, 

    // Page specifc logic as lobby initialization for example
    init () {
        console.log('Match Center page loaded!');
    }
};