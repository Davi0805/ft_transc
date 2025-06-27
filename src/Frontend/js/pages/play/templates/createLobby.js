
export const CreateLobbyPage = {
    template() {
        return `
            <div class="flex flex-col items-center justify-center backdrop-blur-3xl border-2 border-black/40 shadow-sm text-white rounded-lg px-16 py-12">
                <form id="lobby-creation-form" class="flex flex-col items-center justify-center gap-6">
                    <h1 id="create-lobby-title" class="text-3xl p-3"></h1>
                    <div id="lobby-options" class="flex flex-col items-center gap-4">
                        <div class="flex flex-row w-full justify-between">
                            <label for="match-name" class="text-xl">Name:</label>
                            <input id="match-map" name="lobby-map" class="bg-gray-900/50 rounded-2xl px-4 text-center" required></input>
                        </div>
                        
                    </div>
                    <div id="create-lobby-form-buttons" class="flex flex-row gap-6">
                        <button id="btn-return" type="button" class="bg-gray-900/50 bg-opacity-60 p-5 rounded-4xl hover:bg-gray-900/90 active:bg-gray-900/25">Return</button>
                        <button type="submit" class="bg-gray-900/50 bg-opacity-60 p-5 rounded-4xl hover:bg-gray-900/90 active:bg-gray-900/25">Create Lobby</button>
                    </div>
                </form>
            </div>
        `
    },
    init() {
        
    }
}