//? PlayPage is an object with

export const MatchCenterPage = {
    template() {
        const lobbyCategories = ["NAME", "HOST", "TYPE", "CAPACITY", "MODE", "MAP", "MATCH LENGTH"]
        let lobbyCategoriesHtml = "";
        lobbyCategoriesHtml += `<tr class="backdrop-brightness-60 text-left">`;
        for (let category of lobbyCategories) {
            lobbyCategoriesHtml += `<th class="border-l border-white/50 px-6 py-2 relative">${category}</th>`
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
                name: "Lelelele",
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
                lobbiesHtml += `<td class="${bdBrightness} px-6 py-2 wrap-anywhere">${item}</td>`
            })
            lobbiesHtml += `</tr>`;
        }

        return `
            <div class="flex flex-col items-center justify-center h-full backdrop-blur-3xl border-2 border-black/40 shadow-sm text-white rounded-lg px-16 py-12">
                <h1 class="text-3xl p-3">Match Center</h1>
                <div id="match-center-body" class="flex flex-col min-h-0 gap-4">
                    <div id="lobby-list" class="flex flex-col min-h-0 gap-4">
                        <div class="flex flex-row justify-between">
                            <h2 class="text-2xl p-2">Lobby list</h2>
                            <button type="button" class="backdrop-brightness-60 p-2 rounded-4xl hover:backdrop-brightness-0 active:backdrop-brightness-80">Refresh</button>
                        </div>
                        <div id="lobby-table" class="block max-w-full max-h-full overflow-y-auto overflow-x-auto">
                            <table class="w-full">
                                <thead class="sticky top-0 z-1 backdrop-blur-xs">
                                    ${lobbyCategoriesHtml}
                                </thead>
                                <tbody>
                                    ${lobbiesHtml}
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <div id="new-buttons" class="flex flex-row gap-4 items-center justify-center text-xl">
                        <button type="button" class="backdrop-brightness-60 p-5 rounded-4xl hover:backdrop-brightness-0 active:backdrop-brightness-80">New Friendly Match</button>
                        <button type="button" class="backdrop-brightness-60 p-5 rounded-4xl hover:backdrop-brightness-0 active:backdrop-brightness-80">New Ranked Match</button>
                        <button type="button" class="backdrop-brightness-60 p-5 rounded-4xl hover:backdrop-brightness-0 active:backdrop-brightness-80">New Tournament</button>
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