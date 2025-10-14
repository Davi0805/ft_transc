import test from "@playwright/test";
import PlayPage from "../dependencies/pages/PlayPage";
import CreateLobbyPage from "../dependencies/pages/CreateLobbyPage";
import MatchPage from "../dependencies/pages/MatchPage";
import { hostLobby } from "../dependencies/helpers";



test("One user plays friendly", async ({ browser }) => {
    const userContext = await browser.newContext({ storageState: '.auth/ndo-vala-auth.json'});
    const userPage = await userContext.newPage();
    
    await hostLobby(userPage, {
        name: "Test Friendly lobby name",
        type: "friendly",
        matchSettings: {
            map: "4-players-medium",
            mode: "modern",
            duration: "blitz"
        }
    });
    
    const lobby = new MatchPage(userPage);
    await userPage.waitForTimeout(3000);
    await userContext.close();
})