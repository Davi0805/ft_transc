//? PlayPage is an object with

export const MatchCenterPage = {
    template() {
        const lobbiesInfo = [{
            name: "Blobby Lobby",
            host: "ndo-vale",
            type: "friendly",
            capacity: "6/8",
            mode: "Classic",
            map: "4-sided-teams",
            matchLength: 300
        }]

        let lobbiesHtml = "";
        for (let lobbyInfo of lobbiesInfo) {
            lobbiesHtml += "<tr>";
            Object.values(lobbyInfo).forEach(item =>{
                lobbiesHtml += `<td>${item}</td>`
            })
            lobbiesHtml += "</tr>";
        }
        return `
            <div class="flex flex-col items-center justify-center bg-transparent backdrop-blur-3xl border-2 border-black/40 shadow-sm text-white rounded-lg px-[40px] py-[30px]">
                <h1>Match Center</h1>
                <div id="match-center-body" class="flex flex-row">
                    <div id="open-lobies">
                        <h2>Open Lobbies</h2>
                        <div id="lobies-list">
                            <table>
                                <tr>
                                    <th>Name</th>
                                    <th>Host</th>
                                    <th>Type</th>
                                    <th>Capacity</th>
                                    <th>Mode</th>
                                    <th>Map</th>
                                    <th>Match Length</th>
                                </tr>
                                ${lobbiesHtml}
                            </table>
                        </div>
                    </div>
                    <div id="create-buttons" class="flex flex-col">
                        <button type="button">Create Friendly Match</button>
                        <button type="button">Create Ranked Match</button>
                        <button type="button">Create Tournament</button>
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