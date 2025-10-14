import { Browser, BrowserContext, expect, Page } from "@playwright/test";

export interface ILoginPage{
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
}