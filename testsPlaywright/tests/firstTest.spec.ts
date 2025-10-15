import test from "@playwright/test";
import { hostLobby } from "../dependencies/helpers";
import FriendlyLobbyPage from "../dependencies/pages/FriendlyLobbyPage";



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
    
    const lobby = new FriendlyLobbyPage(userPage);
    await lobby.chooseSlot("LEFT", "BACK", {
        alias: "Meeeee",
        upButton: "q",
        downButton: "a",
        paddleSpriteIndex: 3
    });

    await lobby.toggleReady();
    await lobby.start();



    await userPage.waitForTimeout(10000);
    await userContext.close();
})