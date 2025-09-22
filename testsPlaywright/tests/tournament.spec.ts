import { /* test as base, */ expect, Page } from "@playwright/test";
import UserSession from "../dependencies/User";
import LoginPage from "../dependencies/pages/LoginPage";
import HomePage from "../dependencies/pages/HomePage";
import PlayPage from "../dependencies/pages/PlayPage";
import CreateLobbyPage from "../dependencies/pages/CreateLobbyPage";
import MatchPage from "../dependencies/pages/MatchPage";
import TournamentPage from "../dependencies/pages/TournamentPage";
//import { transTest } from "./LobbyFixture";

/* const ADMIN_INFO = {
    username: "admin",
    password: "Qwer123$"
}
const USERS_INFO = [
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



const test = base.extend<{
    admin: UserSession,
    users: UserSession[]
}>({
    admin: async ({ browser }, use) => {
        const admin = await UserSession.create(
            browser,
            ADMIN_INFO.username,
            ADMIN_INFO.password,
            LoginPage
        );
        await use(admin);
    },

    users: async ({ browser }, use) => {
        const users = await Promise.all(
            USERS_INFO.map(async userInfo => {
                return await UserSession.create(browser, userInfo.username, userInfo.password, LoginPage);
            })
        );
        use(users);
    } 
}) */

/* transTest.beforeEach(async ({ admin, users }) => {
    console.log("Resetting repos...");
    await admin.page.goto(BASE_URL + "/admin");
    await admin.page.getByRole('button', { name: "Reset all databases"}).click();
    await expect(admin.page.getByTestId('admin-message')).toHaveText("Action successfull");

    console.log("Preparing users...")

    const promises: Promise<void>[] = [];
    for (const user of users) {
        const home = new HomePage(user.page);
        promises.push(home.goto());
        promises.push(home.goToPlayPage());
    }
    await Promise.all(promises);

    //Host creates lobby
    const host = users[0];
    const hplay = new PlayPage(host.page);
    await hplay.goToCreateLobbyPage();
    const create = new CreateLobbyPage(host.page);
    await create.createLobby("test", "tournament");
    
    //rest of players enter lobby
    for (let i = 1; i < users.length; i++) {
        const user = users[i];
        const uplay = new PlayPage(user.page);
        await uplay.enterFirstLobby();
    } 

    //Everyone applies and set themselves as ready
    for (const user of users) {
        const utourn = new TournamentPage(user.page);
        await utourn.join(user.username);
        await utourn.toggleReady();
    }

    //Host starts
    const htourn = new TournamentPage(host.page);
    await htourn.start();
}) */

/* test('tournament cycle', async ({ users }) => {
    test.setTimeout(120000);
    
    const host = users[0];
    await expectFullCycle(host.page)

    //await host.page.waitForTimeout(3000);
}) */

/* transTest('reconnect', async ({ users }) => {
    transTest.setTimeout(300000);
    const fullCyclePromise = expectFullCycle(users[0].page);

    const matchExpectTimeout = 120000;
    const tournamentPageExpectTimeout = 30000
    const hostPage = users[0].page;

    const playPage = new PlayPage(users[1].page);
    await playPage.goto();
    await playPage.enterFirstLobby();

    await fullCyclePromise;

}) */

async function expectFullCycle(hostPage: Page) {
    const matchExpectTimeout = 120000;
    const tournamentPageExpectTimeout = 30000
    await expect(hostPage).toHaveTitle("Tournament", { timeout: 20000});
    await expect(hostPage).toHaveTitle("Match", { timeout: tournamentPageExpectTimeout})
    await expect(hostPage).toHaveTitle("Tournament", { timeout: matchExpectTimeout});
    await expect(hostPage).toHaveTitle("Match", { timeout: tournamentPageExpectTimeout})
    await expect(hostPage).toHaveTitle("Tournament", { timeout: matchExpectTimeout});
    await expect(hostPage).toHaveTitle("Lobby", { timeout: tournamentPageExpectTimeout})
}