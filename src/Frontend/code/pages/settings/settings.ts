export const SettingsPage = {
    template() {
        return `
            <div class="flex flex-dir-col flex-center content">
                <h1>Settings</h1>
                <p>This is the Settings Page</p>
            </div>
        `;
    },

    init() {
        console.log("Settings page loaded!")
    }
} as const;