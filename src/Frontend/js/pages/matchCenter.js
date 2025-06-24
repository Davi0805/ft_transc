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
        for (let i = 0; i < lobbiesInfo.length; i++) {
            lobbiesHtml += `<tr>`;
            Object.values(lobbiesInfo[i]).forEach(item =>{
                lobbiesHtml += `<td class="backdrop-brightness-${i%2 === 0 ? 100 : 75} p-2">${item}</td>`
            })
            lobbiesHtml += `</tr>`;
        }

        return `
            <div class="flex flex-col items-center justify-center bg-transparent backdrop-blur-3xl border-2 border-black/40 shadow-sm text-white rounded-lg px-[40px] py-[30px]">
                <h1 class="text-3xl">Match Center</h1>
                <div id="match-center-body" class="flex flex-row">
                    <div id="open-lobies">
                        <h2>Open Lobbies</h2>
                        <div id="lobies-list">
                            <table class="w-full table-fixed">
                                ${lobbyCategoriesHtml}
                                ${lobbiesHtml}
                            </table>
                        </div>
                    </div>
                    <div id="new-buttons" class="flex flex-col">
                        <button type="button">New Friendly Match</button>
                        <button type="button">New Ranked Match</button>
                        <button type="button">New Tournament</button>
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