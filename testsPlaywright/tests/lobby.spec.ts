import { fromHomeCreateLobby } from "../dependencies/helpers";
import { LobbySettings } from "../dependencies/pages/CreateLobbyPage";
import HomePage from "../dependencies/pages/HomePage";
import PlayPage from "../dependencies/pages/PlayPage";
import { oneUser, twoUsers } from "../LobbyFixtures";

oneUser("goToPlay", async ({ user }) => {
    const homePage = new HomePage(user.page);
    await homePage.goToPlayPage();
    
    await user.destroy();
})

oneUser("goToHome", async ({ user }) => {
    const homePage = new HomePage(user.page);
    await homePage.goto();
    
    await user.destroy();
});

oneUser("CreateLobby", async ({ user }) => {
    const lobbySettings: LobbySettings = {
        name: "TestLobby",
        type: "friendly",
        matchSettings: {
            map: "2-players-big",
            mode: "modern",
            duration: "blitz"
        }
    }
    await fromHomeCreateLobby(user.page, lobbySettings);

    await user.destroy();
})

twoUsers("CreateEnterLobby", async ({ users }) => {
    const host = users[0];
    const user = users[1];

    const lobbySettings: LobbySettings = {
        name: "TestLobby",
        type: "friendly",
        matchSettings: {
            map: "2-players-big",
            mode: "modern",
            duration: "blitz"
        }
    }
    await fromHomeCreateLobby(host.page, lobbySettings);

    const uHomePage = new HomePage(user.page);
    await uHomePage.goToPlayPage();
    const uPlayPage = new PlayPage(user.page);
    await uPlayPage.enterFirstLobby();

    for (let user of users) {
        await user.logout();
    }
})

