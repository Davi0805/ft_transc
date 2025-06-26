export const CreateLobbyPage = {
    template() {
        return `
            <div class="flex flex-col items-center justify-center backdrop-blur-3xl border-2 border-black/40 shadow-sm text-white rounded-lg px-16 py-12">
                <form id="lobby-creation-form" class="flex flex-col items-center justify-center gap-6">
                    <h1 id="create-lobby-title" class="text-3xl p-3"></h1>
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
                        <button id="btn-return" type="button" class="bg-gray-900/50 bg-opacity-60 p-5 rounded-4xl hover:bg-gray-900/90 active:bg-gray-900/25">Return</button>
                        <button type="submit" class="bg-gray-900/50 bg-opacity-60 p-5 rounded-4xl hover:bg-gray-900/90 active:bg-gray-900/25">Create Lobby</button>
                    </div>
                </form>
            </div>
        `
    },
    init() {}
}