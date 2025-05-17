export const HomePage = {
    template() {
        return `
            <div>
                <h1>Home</h1>
                <p>This is the Home Page</p>
            </div>
        `;
    },

    init() {
        console.log("Home page loaded!")
    }
};