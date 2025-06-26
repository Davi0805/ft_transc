//? PlayPage is an object with



//Command to run tailwind: npx @tailwindcss/cli -i ./css/matchCenter/tailwindInput.css -o ./css/matchCenter/tailwindOutput.css --watch
export const MatchCenterPage = {
    template() {

        const lobbySettings = {
            type: "Friendly Match",
            name: "Some lobby",
            map: "1v1 medium",
            mode: "modern",
            length: "marathon"
        }
        let lobbySettingsHtml = "";
        for (let setting in lobbySettings) {
            lobbySettingsHtml += `<p>${setting}: ${lobbySettings[setting]}</p>`
        }


        const matchPositions = {

        }
        let matchPositionsHtml = "";
        //TODO: How to get players?

        return `
            <div class="flex flex-col items-center justify-center backdrop-blur-3xl border-2 border-black/40 shadow-sm text-white rounded-lg px-16 py-12 overflow-hidden">
                <h1 id="lobby-title" class="text-3xl p-3">${lobbySettings.name}</h1>
                <div id="lobby-body" class="flex flex-row">
                    <div id="teams" class="flex flex-col">
                        ${matchPositionsHtml}
                    </div>
                    <div id="lobby-settings-and-buttons" class="flex flex-col">
                        <div id="lobby-settings">
                            <div id="settings-listing">
                                ${lobbySettingsHtml}
                            </div>
                            <button type="button" class="bg-gray-900/50 bg-opacity-60 p-2 rounded-4xl hover:bg-gray-900/90 active:bg-gray-900/25">Change lobby settings</button>
                        </div>
                        <div id="lobby-buttons" class="flex flex-col">
                            <button type="button" class="bg-gray-900/50 bg-opacity-60 p-5 rounded-4xl hover:bg-gray-900/90 active:bg-gray-900/25">Invite</button>
                            <button type="button" class="bg-gray-900/50 bg-opacity-60 p-5 rounded-4xl hover:bg-gray-900/90 active:bg-gray-900/25">Leave</button>
                            <button type="button" class="bg-gray-900/50 bg-opacity-60 p-5 rounded-4xl hover:bg-gray-900/90 active:bg-gray-900/25">Ready</button>
                        </div>
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
