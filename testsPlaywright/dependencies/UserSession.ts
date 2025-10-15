import { Browser, BrowserContext, expect, Page } from "@playwright/test";
import CreateLobbyPage, { LobbySettings } from "./pages/CreateLobbyPage";
import PlayPage from "./pages/PlayPage";
import LobbyPage from "./pages/LobbyPage";
import FriendlyLobbyPage, { PlayerSettings, SlotSettings } from "./pages/FriendlyLobbyPage"

export default class UserSession {
    get page() { return this._page; }

    static async create(browser: Browser, sessionStorageFile: string) {
        const ctx = await browser.newContext({ storageState: sessionStorageFile});
        const page = await ctx.newPage();

        page.on('console', async msg => {
            const args = msg.args();
            for (const arg of args) {
                try {
                const val = await arg.jsonValue();
                console.log(`[${msg.type()}]`, val);
                } catch {
                console.log(`[${msg.type()}]`, arg.toString());
                }
            }
        });

        return new UserSession(ctx, page);
    }

    async hostLobby(lobbySettings: LobbySettings) {
      const playPage = new PlayPage(this._page);
      await playPage.goto();
      await playPage.goToCreateLobbyPage();
      const createPage = new CreateLobbyPage(this._page);
      await createPage.createLobby(lobbySettings);
    }

    async enterLobby(lobbyName: string) {
        const playPage = new PlayPage(this._page);
        await playPage.goto();
        await playPage.enterLobby(lobbyName);
    }

    async leaveLobby(shouldLobbyExistAfterLeaving: boolean) {
        await expect(this._page).toHaveTitle("Lobby");
        const lobbyPage = new LobbyPage(this._page);
        const lobbyName = await lobbyPage.getLobbyName();
        if (!lobbyName) { throw Error("a name must exist!!")}
        await lobbyPage.leave();
        const playPage = new PlayPage(this._page);
        await playPage.checkIfLobbyExists(lobbyName, shouldLobbyExistAfterLeaving);
    }

    async setReady(shouldSucceed: boolean) {
        await expect(this._page).toHaveTitle("Lobby");
        const lobbyPage = new LobbyPage(this._page);
        lobbyPage.toggleReady(shouldSucceed ? "ready succeded" : "ready failed");
    }

    async unsetReady() {
        await expect(this._page).toHaveTitle("Lobby");
        const lobbyPage = new LobbyPage(this._page);
        lobbyPage.toggleReady("un-ready succeded");
    }

    async joinFriendlySlot(slotSettings: SlotSettings) {
        await expect(this._page).toHaveTitle("Lobby");
        await expect(this._page.locator("#lobby-subtitle")).toHaveText("Friendly Match Lobby");
        const page = new FriendlyLobbyPage(this._page);
        page.chooseSlot(slotSettings);
        await expect(this._page.locator(`#slot-${slotSettings.team}-${slotSettings.role} p`))
            .toHaveText(slotSettings.playerSettings.alias);
    }

    async openJoinFriendlySlot(team: string, role: string) {
        await expect(this._page).toHaveTitle("Lobby");
        await expect(this._page.locator("#lobby-subtitle")).toHaveText("Friendly Match Lobby");
        const page = new FriendlyLobbyPage(this._page);
        page.openDialogOfSlot(team, role);
    }

    async fillAndSubmitFriendlySlot(slotSettings: SlotSettings, successful: boolean) {
        await expect(this._page).toHaveTitle("Lobby");
        await expect(this._page.locator("#lobby-subtitle")).toHaveText("Friendly Match Lobby");
        await expect(this._page.locator('dialog[open]')).toBeVisible();
        const page = new FriendlyLobbyPage(this._page);
        await page.fillAndSubmitSlotDialog(slotSettings.playerSettings);
        if (successful) {
            await expect(this._page.locator(`#slot-${slotSettings.team}-${slotSettings.role} p`))
                .toHaveText(slotSettings.playerSettings.alias);
        }
    } 

    async close() {
        await this._ctx.close();
    }

    private _ctx: BrowserContext;
    private _page: Page;

    private constructor(ctx: BrowserContext, page: Page) {
        this._ctx = ctx;
        this._page = page;
    }
}

/* export interface ILoginPage{
  goto(): Promise<void>; //Goes to the login page
  login(username: string, password: string): Promise<void>;
}

export default class UserSession {
    get ctx() { return this._ctx; }
    get page() { return this._page; }
    get username() { return this._username; }

    static async create(
        browser: Browser,
        username: string,
        password: string,
        LoginPage: new (page: Page) => ILoginPage
    ) {
        const ctx = await browser.newContext();
        const page = await ctx.newPage();
        const loginPage = new LoginPage(page);
        await loginPage.goto();
        await loginPage.login(username, password);
        page.on('console', async msg => {
            const args = msg.args();
            for (const arg of args) {
                try {
                const val = await arg.jsonValue();
                console.log(`[${msg.type()}]`, val);
                } catch {
                console.log(`[${msg.type()}]`, arg.toString());
                }
            }
        });
        await page.context().storageState({ path: './.auth/auth2.json' });
        return new UserSession(ctx, page, username);
    }

    async destroy() {
        await this.logout();
        await this.ctx.close();
    }

    async logout() {
        await this.page.getByAltText("logout icon").click();
        expect(this.page.getByText("Login"));
    }


    private _ctx: BrowserContext;
    private _page: Page;
    private _username: string;
    
    private constructor(ctx: BrowserContext, page: Page, username: string) {
        this._ctx = ctx;
        this._page = page;
        this._username = username;
    }
} */