export const AboutUsPage = {
    template() {
        return `
            <div class="flex flex-dir-col flex-center content">
                <h1>About Us</h1>
                <p>This is the About Us Page</p>
            </div>
        `;
    },

    init() {
        console.log("About Us page loaded!")
    }
};