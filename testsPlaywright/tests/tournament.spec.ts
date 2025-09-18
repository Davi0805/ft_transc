import { test as base, expect } from "@playwright/test";
import { loginAsUser } from "../dependencies/helpers";
import { BASE_URL } from "../dependencies/typesAndConsts";
import UserSession from "../dependencies/User";
import LoginPage from "../dependencies/pages/LoginPage";
import HomePage from "../dependencies/pages/HomePage";
import PlayPage from "../dependencies/pages/PlayPage";
import CreateLobbyPage from "../dependencies/pages/CreateLobbyPage";
import MatchPage from "../dependencies/pages/MatchPage";
import TournamentPage from "../dependencies/pages/TournamentPage";

const ADMIN_INFO = {
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
})

test.beforeEach(async ({ admin, users }) => {
    console.log("Resetting repos...");
    await admin.page.goto(BASE_URL + "/admin");
    await admin.page.getByRole('button', { name: "Reset all databases"}).click();
    await expect(admin.page.getByTestId('admin-message')).toHaveText("Action successfull");

    console.log("Preparing users...")
    for (const user of users) {
        const home = new HomePage(user.page);
        await home.goto();
        await home.goToPlayPage();
    }
}) 

test('tournament cycle', async ({ users }) => {
    test.setTimeout(120000);
    
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
    htourn.start();

    await host.page.waitForTimeout(20000);


})