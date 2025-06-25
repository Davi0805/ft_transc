//? PlayPage is an object with

export const MatchCenterPage = {
    template() {

        return `
            <div class="flex flex-col items-center justify-center backdrop-blur-3xl border-2 border-black/40 shadow-sm text-white rounded-lg px-16 py-12">
                <form id="lobby-creation-form" class="flex flex-col items-center justify-center gap-6">
                    <h1 class="text-3xl p-3">New Friendly Match</h1>
                    <div id="lobby-options" class="flex flex-col items-center gap-4">
                        <div class="flex flex-row justify-between gap-3">
                            <label for="lobby-name" class="text-xl">Lobby name:</label>
                            <input id="lobby-name" type="text" name="lobby-name" class="bg-gray-900/50 rounded-2xl px-4" required/>
                        </div>
                        <div class="flex flex-row w-full justify-between">
                            <label for="match-map" class="text-xl">Map:</label>
                            <select id="match-map" name="lobby-map" class="bg-gray-900/50 rounded-2xl px-4 text-center">
                                <option value="1v1-small">1v1 small</option>
                                <option value="1v1-medium">1v1 medium</option>
                                <option value="1v1-big">1v1 big</option>
                                <option value="1v1v1v1-small">1v1v1v1 small</option>
                                <option value="1v1v1v1-medium">1v1v1v1 medium</option>
                                <option value="1v1v1v1-big">1v1v1v1 big</option>
                                <option value="2v2-small">2v2 small</option>
                                <option value="2v2-medium">2v2 medium</option>
                                <option value="2v2-big">2v2 big</option>
                                <option value="2v2v2v2-small">2v2v2v2 small</option>
                                <option value="2v2v2v2-medium">2v2v2v2 medium</option>
                                <option value="2v2v2v2-big">2v2v2v2 big</option>
                            </select>
                        </div>
                        <div class="flex flex-row w-full justify-between">
                            <label for="match-mode" class="text-xl">Mode:</label>
                            <select id="match-mode" name="match-mode" class="bg-gray-900/50 rounded-2xl px-4 text-center">
                                <option value="classic">Classic</option>
                                <option value="modern">Modern</option>
                            </select>
                        </div>
                        <div class="flex flex-row w-full justify-between">
                            <label for="match-length" class="text-xl">Match Length:</label>
                            <select id="match-length" name="match-length" class="bg-gray-900/50 rounded-2xl px-4 text-center">
                                <option value="blitz">blitz</option>
                                <option value="rapid">rapid</option>
                                <option value="classic">classic</option>
                                <option value="long">long</option>
                                <option value="marathon">marathon</option>
                            </select>
                        </div>
                    </div>
                    <div id="create-lobby-form-buttons" class="flex flex-row gap-6">
                        <button type="button" class="bg-gray-900/50 bg-opacity-60 p-5 rounded-4xl hover:bg-gray-900/90 active:bg-gray-900/25">Return</button>
                        <button type="submit" class="bg-gray-900/50 bg-opacity-60 p-5 rounded-4xl hover:bg-gray-900/90 active:bg-gray-900/25">Create Lobby</button>
                    </div>
                </form>
            </div>
        `;
    }, 

    // Page specifc logic as lobby initialization for example
    init () {
        console.log('Match Center page loaded!');
    }
};


/* MATCH CENTER */
/*
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
                const bdBrightness = i % 2 === 0 ? "bg-gray-900/0" : "bg-gray-900/25";
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
                            <button type="button" class="bg-gray-900/50 p-2 rounded-4xl hover:bg-gray-900/90 active:bg-gray-900/25">Refresh</button>
                        </div>
                        <div id="lobby-table" class="block max-w-full max-h-full rounded-2xl overflow-y-auto">
                            <table class="w-full">
                                <thead class="sticky top-0 z-1 bg-gray-900/75">
                                    ${lobbyCategoriesHtml}
                                </thead>
                                <tbody>
                                    ${lobbiesHtml}
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <div id="new-buttons" class="flex flex-row gap-4 items-center justify-center text-xl">
                        <button type="button" class="bg-gray-900/50 bg-opacity-60 p-5 rounded-4xl hover:bg-gray-900/90 active:bg-gray-900/25">New Friendly Match</button>
                        <button type="button" class="bg-gray-900/50 p-5 rounded-4xl hover:bg-gray-900/90 active:bg-gray-900/25">New Ranked Match</button>
                        <button type="button" class="bg-gray-900/50 p-5 rounded-4xl hover:bg-gray-900/90 active:bg-gray-900/25">New Tournament</button>
                    </div>
                </div>
            </div>
        `;
    },
*/