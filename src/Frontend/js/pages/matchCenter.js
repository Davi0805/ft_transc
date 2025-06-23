//? PlayPage is an object with

export const MatchCenterPage = {
    template() {
        return `
            <div class="flex flex-col items-center justify-center bg-transparent backdrop-blur-3xl border-2 border-black/40 shadow-sm text-white rounded-lg px-[40px] py-[30px]">
                <h2>About Us</h2>
                <div>This is the About Us Page</div>
            </div>
        `;
    }, 

    // Page specifc logic as lobby initialization for example
    init () {
        console.log('Match Center page loaded!');
    }
};