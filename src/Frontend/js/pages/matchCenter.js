//? PlayPage is an object with

export const MatchCenterPage = {
    template() {
        return `
            <div>
                <h2>Game Area</h2>
                <div class="underline decoration-wavy">Game</div>
            </div>        
        `;
    }, 

    // Page specifc logic as lobby initialization for example
    init () {
        console.log('Play page loaded!');
    }
};