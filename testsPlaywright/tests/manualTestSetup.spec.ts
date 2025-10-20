import test from "@playwright/test";
import UserSession from "../dependencies/UserSession";

test("setup friendly 2 players", async ({ browser }) => {
    test.setTimeout(10000000);
    
    const lobbySettings = {
            name: "Leave btn test lobby",
            type: "friendly",
            matchSettings: {
                map: "4-players-medium",
                mode: "modern",
                duration: "blitz"
            }
        };
    
        const vala = await UserSession.create(browser, '.auth/ndo-vala-auth.json');
        const vale = await UserSession.create(browser, '.auth/ndo-vale-auth.json');
    
        await vala.hostLobby(lobbySettings);
        await vale.enterLobby(lobbySettings.name);
        await vala.page.waitForTimeout(10000000);
})