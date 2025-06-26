export const PlayPage = {
    template() {
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
                                    
                                </thead>
                                <tbody>
                                    
                                </tbody>
                            </table>
                        </div>
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
        const buttonNewFriendly = document.getElementById('btn-new-friendly');
        const buttonNewRanked = document.getElementById('btn-new-ranked');
        const buttonNewTournament = document.getElementById('btn-new-tournament');
        buttonNewFriendly.addEventListener('click', () => window.router.navigateTo('/create-friendly'));
        buttonNewRanked.addEventListener('click', () => window.router.navigateTo('/create-ranked'));
        buttonNewTournament.addEventListener('click', () => window.router.navigateTo('/create-tournament'));

        
    }
}