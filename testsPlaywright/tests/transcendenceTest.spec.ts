import { test, expect, Page, Browser, BrowserContext } from '@playwright/test'

const BASE_URL = '127.0.0.1:8888';

abstract class APage {
    constructor(page: Page, url: string | null = null) {
        this._page = page;
        this._url = url;
    }

    async goto() {
        await this._page.goto(this.url);
    }

    protected _page: Page;

    private _url: string | null;
    get url() {
        if (!this._url) {throw Error("There is no url for this page")}
        return this._url
    }
}

class LoginPage extends APage {
    constructor(page: Page) {
        super(page, BASE_URL + "/login");
    }

    async login(username: string, password: string) {
        await this._page.getByPlaceholder('Username').fill(username);
        await this._page.getByPlaceholder('Password').fill(password);
        await this._page.getByRole("button", { name: "Login"}).click();
    }
}

class HomePage extends APage {
    constructor(page: Page) {
        super(page, BASE_URL);
    }

    async goToPlayPage() {
        await this._page.getByRole("link", { name: "Play Now"}).click();
    }
}

class PlayPage extends APage {
    constructor(page: Page) {
        super(page, BASE_URL + "/play")
    }

    async goToCreateLobbyPage() {
        await this._page.getByRole("button", { name: "New Lobby"}).click();
    }

    async enterFirstLobby() {
        await this._page.waitForSelector('table tbody tr');
        const firstRow = await this._page.locator('table tbody tr:first-child');
        if (firstRow) {
                await firstRow.click();
        }
    }
}

class CreateLobbyPage extends APage {
    constructor(page: Page) {
        super(page, BASE_URL + "/create-lobby")
    }

    async createLobby(lobbyName: string, type: string) {
        await this._page.getByLabel("Name").fill(lobbyName);
        await this._page.getByLabel("Type").selectOption(type);
        await this._page.getByRole("button", { name: "Create Lobby"}).click();
    }
}

class LobbyPage extends APage {
    constructor(page: Page) {
        super(page, BASE_URL + "/lobby")
    }

    async joinTournament(player: string) {
        await this._page.getByRole('button', { name: "Join"}).click();
        await this._page.waitForSelector(`#participants-table tr td:nth-child(2):text("${player}")`);
    }

    async setReady() {
        await this._page.getByRole('button', { name: "Ready"}).click();
        await this._page.getByRole('button', { name: "I'm ready! (cancel...)"}).waitFor();
    }

    async startTournament() {
        await this._page.getByRole('button', { name: "Start"}).click();
        
    }
}

type UserSession = {
  context: BrowserContext;
  page: Page;
};

export async function loginAsUser(
  browser: Browser,
  username: string,
  password: string = "PasswordExample",
  URL: string = BASE_URL + "/login",
): Promise<UserSession> {
  const context = await browser.newContext(); // 🔒 Isolated session
  const page = await context.newPage();
  const loginPage = new LoginPage(page);

  await loginPage.goto();
  await loginPage.login(username, password);

  return { context, page};
}

test('simply enter', async ({ browser }) => {
    const players = [
        {
            username: "ndo-vala",
            password: "Qwer123$"
        },
        {
            username: "ndo-vale",
            password: "Qwer123$"
        },
        {
            username: "ndo-vali",
            password: "Qwer123$"
        },
        {
            username: "ndo-valo",
            password: "Qwer123$"
        },
    ]

    const { context: aContext, page: aPage } = await loginAsUser(
        browser,
        players[0].username,
        players[0].password
    )
    const aHomePage = new HomePage(aPage);
    aHomePage.goToPlayPage();
    const aPlayPage = new PlayPage(aPage);
    await aPlayPage.goToCreateLobbyPage();
    await expect(aPage).toHaveTitle("Create Lobby");
    const aCreatePage = new CreateLobbyPage(aPage);
    await aCreatePage.createLobby("tournamentTest", "Tournament");
    await expect(aPage).toHaveTitle("Lobby");
    const aLobby = new LobbyPage(aPage);
    await aLobby.joinTournament(players[0].username);
    await aLobby.setReady();
    await expect(aPage.getByRole('button', { name: "I'm ready! (cancel...)"})).toHaveText("I'm ready! (cancel...)")




    for (let i = 1; i < players.length; i++) {
        const { context: pContext, page: pPage } = await loginAsUser(
            browser, players[i].username, players[i].password
        )
        const eHomePage = new HomePage(pPage);
        await eHomePage.goToPlayPage();
        const ePlayPage = new PlayPage(pPage);
        await ePlayPage.enterFirstLobby();
        await expect(pPage).toHaveTitle("Lobby");
        const pLobby = new LobbyPage(pPage);
        await pLobby.joinTournament(players[i].username);
        await pLobby.setReady();
        await expect(pPage.getByRole('button', { name: "I'm ready! (cancel...)"})).toHaveText("I'm ready! (cancel...)")



    }

    await aLobby.startTournament();
    await expect(aPage).toHaveTitle("Tournament");
    await aPage.waitForTimeout(10000);
    await expect(aPage).toHaveTitle("Match")
    
    //aContext.close();
    //eContext.close();
})