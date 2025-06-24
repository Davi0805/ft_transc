export const NotFoundPage = {
    template() {
        return `
            <div class="not-found">
                <h1>404 Page Not Found</h1>
                <p>Not found page content</p>
            </div>
        `;
    },

    init () {
        console.log('404 page loaded!');
    }
};

