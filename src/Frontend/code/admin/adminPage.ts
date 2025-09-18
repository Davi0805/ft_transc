import { resetRepos } from "./adminAPI";

export const AdminPage = {
    template(): string {
        return `
            <button id="reset-databases-btn" type="button" class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">
                Reset all databases
            </button>
            <div id="admin-message" data-testid="admin-message" style="display:none; color: green;"></div>
        `
    },

    init() {
        const resetDatabasesBtn = document.getElementById("reset-databases-btn") as HTMLButtonElement;
        resetDatabasesBtn.addEventListener('click', async () => {
            await this.attemptAction(resetRepos);
        })
        console.log("Admin page loaded!");
    },

    async attemptAction(action: () => Promise<void>) {
        try {
            await action();
            this.showMessage("Action successfull");
        } catch {
            this.showMessage("You cannot do that", true)
        }
    },

    showMessage(msg: string, isError = false) {
        const el = document.getElementById('admin-message');
        if (!el) return;
        el.textContent = msg;
        el.style.display = 'block';
        el.style.color = isError ? 'red' : 'green';
        setTimeout(() => el.style.display = 'none', 2000);
    }


}