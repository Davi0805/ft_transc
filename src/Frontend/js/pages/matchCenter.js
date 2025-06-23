//? PlayPage is an object with

export const MatchCenterPage = {
    template() {
        return `
            <div class="flex flex-col items-center justify-center bg-transparent backdrop-blur-[50px] border-2 border-black/40 shadow-[0_0_10px_rgba(0,0,0,0.4)] text-white rounded-[10px] px-[40px] py-[30px]">
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