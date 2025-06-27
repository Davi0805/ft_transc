export const LobbyMatchPage = {
    template() {
        return `
            <div class="flex flex-col items-center justify-center backdrop-blur-3xl border-2 border-black/40 shadow-sm text-white rounded-lg px-16 py-12 overflow-hidden">
                <h1 id="lobby-title" class="text-3xl p-3"></h1>
                <div id="lobby-body" class="flex flex-row">
                    <div id="slots" class="flex flex-col">
                    </div>
                    <div id="lobby-settings-and-buttons" class="flex flex-col">
                        <div id="lobby-settings">
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
}