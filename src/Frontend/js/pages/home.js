export const HomePage = {
    template() {
        return `
            <div class="flex flex-dir-col flex-center content">
                <h1>Home</h1>


                <p> Play placeholder ----> <a href="/play" data-link>PLAY</a></p>
                <p>This is the Home Page</p>
            </div>
        `;
    },

    init() {
        console.log("Home page loaded!")
    }
};