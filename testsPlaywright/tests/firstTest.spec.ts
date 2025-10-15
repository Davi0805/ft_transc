import test from "@playwright/test";
import UserSession from "../dependencies/UserSession";

test("leave button", async ({ browser }) => {
    test.setTimeout(1000000);


    const lobbySettings = {
        name: "Test Friendly lobby name",
        type: "friendly",
        matchSettings: {
            map: "4-players-medium",
            mode: "modern",
            duration: "blitz"
        }
    };

    const vala = await UserSession.create(browser, '.auth/ndo-vala-auth.json');
    await vala.hostLobby(lobbySettings);
    await vala.leaveLobby(false);
    await vala.hostLobby(lobbySettings);

})

/* test("Friendly buttons", async ({ browser }) => {
    test.setTimeout(1000000)

    const lobbySettings = {
        name: "Test Friendly lobby name",
        type: "friendly",
        matchSettings: {
            map: "4-players-medium",
            mode: "modern",
            duration: "blitz"
        }
    }

    const userContext = await browser.newContext({ storageState: '.auth/ndo-vala-auth.json'});
    const userPage = await userContext.newPage();
    
    await hostLobby(userPage, lobbySettings);
    
    const lobby = new FriendlyLobbyPage(userPage);

    await lobby.leave();

    await hostLobby(userPage, lobbySettings);
    await lobby.toggleReady("ready failed");
    await lobby.start("Host is not present");

    await hostLobby(userPage, lobbySettings);
    await lobby.chooseSlot("LEFT", "BACK", {
        alias: "Meeeee",
        upButton: "q",
        downButton: "a",
        paddleSpriteIndex: 3
    });

    await lobby.start("Not everyone is ready!")
    await lobby.toggleReady("ready succeded");
    await lobby.toggleReady("un-ready succeded");
    await lobby.start("Not everyone is ready!");
    await lobby.toggleReady("ready succeded");
    await lobby.start("start succeded");

    await userContext.close();
}) */
