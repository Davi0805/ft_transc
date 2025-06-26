//? PlayPage is an object with

export const PlayPage = {
    template() {
        return `
            <div class="play-container">
                <h2>Game Area</h2>
                <div class="game-placeholder">Game</div>
            </div>        
        `;
    }, 

    // Page specifc logic as lobby initialization for example
    init () {
        console.log('Play page loaded!');
    }
} as const;