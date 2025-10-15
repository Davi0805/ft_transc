import { Browser, BrowserContext, expect, Page } from "@playwright/test";
import CreateLobbyPage, { LobbySettings } from "./pages/CreateLobbyPage";
import HomePage from "./pages/HomePage";
import PlayPage from "./pages/PlayPage";
import LobbyPage from "./pages/LobbyPage";

export default class UserSession {
    get page() { return this._page; }

    static async create(browser: Browser, sessionStorageFile: string) {
        const ctx = await browser.newContext({ storageState: sessionStorageFile});
        const page = await ctx.newPage();

        return new UserSession(page);
    }

    async hostLobby(lobbySettings: LobbySettings) {
      const homePage = new HomePage(this._page);
      await homePage.goto();
      await homePage.goToPlayPage();
      const playPage = new PlayPage(this._page);
      await playPage.goToCreateLobbyPage();
      const createPage = new CreateLobbyPage(this._page);
      await createPage.createLobby(lobbySettings);
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

    private _page: Page;

    private constructor(page: Page) {
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