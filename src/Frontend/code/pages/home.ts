export const HomePage = {
    template() {
        return `
            <div class="flex flex-dir-col flex-center content">
                <h1>Home</h1>
                <p>This is the Home Page</p>
            </div>
        `;
    },

    init() {
        console.log("Home page loaded!")
    }
} as const;