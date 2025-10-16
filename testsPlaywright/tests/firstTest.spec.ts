import test, { expect } from "@playwright/test";
import UserSession from "../dependencies/UserSession";
import { SlotSettings } from "../dependencies/pages/MatchLobbyPage";

test("leave button", async ({ browser }) => {
    test.setTimeout(1000000);

    const lobbySettings = {
        name: "Leave btn test lobby",
        type: "ranked",
        matchSettings: {
            map: "2-players-medium",
            mode: "modern",
            duration: "blitz"
        }
    };

    const vala = await UserSession.create(browser, '.auth/ndo-vala-auth.json');
    const vale = await UserSession.create(browser, '.auth/ndo-vale-auth.json');

    await vala.hostLobby(lobbySettings);
    await vale.enterLobby(lobbySettings.name);
    await vale.leaveLobby(true); //Lobby should not be deleted, as it still has players in it
    await vale.enterLobby(lobbySettings.name);
    await vala.leaveLobby(true); //Host leaves lobby, still should not be deleted as there's a player there
    await vala.enterLobby(lobbySettings.name);
    await vala.joinRankedSlot("LEFT", "BACK", "ndo-vala");
    await vale.joinRankedSlot("RIGHT", "BACK", "ndo-vale");    
    await vala.leaveLobby(true); //First player leaves, lobby SHOULD exist
    await expect(vala.page.locator(`#slot-RIGHT-BACK p`)).toHaveCount(0); //The slot should open up after user leaves
    await vale.leaveLobby(false); //Second player leaves, lobby should NOT exist

    lobbySettings.type = "friendly";
    await vala.hostLobby(lobbySettings);
    await vala.joinFriendlySlot({
        team: "LEFT",
        role: "BACK",
        playerSettings: {
            alias: "ndo-vala alias",
            upButton: "q",
            downButton: "a",
            paddleSpriteIndex: 2
        }
    });
    await vale.enterLobby(lobbySettings.name);
    await vale.joinFriendlySlot({
        team: "RIGHT",
        role: "BACK",
        playerSettings: {
            alias: "ndo-vale alias",
            upButton: "o",
            downButton: "l",
            paddleSpriteIndex: 5
        }
    });    
    await vale.leaveLobby(true);
    await expect(vala.page.locator(`#slot-RIGHT-BACK button`)).toHaveText("Join"); //The slot should open up after user leaves
    await vala.leaveLobby(false);

    lobbySettings.type = "tournament";
    await vala.hostLobby(lobbySettings);
    await vale.enterLobby((lobbySettings.name));
    await vale.joinTournament("ndo-vale");
    await vale.leaveLobby(true);
    await expect(vala.page.locator(`#participants-table tr td:nth-child(2):text("ndo-vale")`))
        .toHaveCount(0); //Player should also not be in the tournament after leaving lobby
    await vala.close();
    await vale.close();
});

test("ready/start buttons ranked", async ({ browser }) => {
    test.setTimeout(1000000);

    const lobbySettings = {
        name: "Ready btn test lobby",
        type: "ranked",
        matchSettings: {
            map: "2-players-medium",
            mode: "modern",
            duration: "blitz"
        }
    };

    const vala = await UserSession.create(browser, '.auth/ndo-vala-auth.json');
    const vale = await UserSession.create(browser, '.auth/ndo-vale-auth.json');

    await vala.hostLobby(lobbySettings);
    await vala.setReady(false);
    await vala.joinRankedSlot("LEFT", "BACK", "ndo-vala");
    await vala.setReady(true);
    await vala.unsetReady();
    await vale.enterLobby(lobbySettings.name);
    await vale.joinRankedSlot("RIGHT", "BACK", "ndo-vale");
    console.log("FIRST START");
    await vala.startLobbyEvent("Not everyone is ready!");
    await vala.setReady(true);
    console.log("SECOND START");
    await vala.startLobbyEvent("Not everyone is ready!");
    await vala.unsetReady();
    await vale.setReady(true);
    console.log("THIRD START");
    await vala.startLobbyEvent("Not everyone is ready!");
    console.log("Did it get here?")
    await vala.setReady(true);
    await vala.withdrawFromSlot("LEFT", "BACK");
    console.log("FOURTH START");
    await vala.startLobbyEvent("Not everyone is ready!");
    await vala.setReady(false);
    await vala.joinRankedSlot("LEFT", "BACK", "ndo-vala");
    console.log("FIFTH START");
    await vala.startLobbyEvent("Not everyone is ready!");
    await vala.setReady(true);
    
    console.log("CORRECT START")
    await vala.startLobbyEvent("start succeded");
    await vala.page.waitForTimeout(4000); //initial countdown
    await vala.page.keyboard.down("ArrowDown");
    await vala.page.keyboard.down("ArrowUp");
    await vala.page.waitForTimeout(4000); //Self destruct timer
    await vala.page.keyboard.up("ArrowDown");
    await vala.page.keyboard.up("ArrowUp");
    console.log("probably game over by this point")
    await expect(vala.page).toHaveTitle("Lobby", { timeout: 15000 });


    await vala.close();
    await vale.close();
});

test("ready/start buttons frienly", async ({ browser }) => {
    test.setTimeout(1000000);

    const lobbySettings = {
        name: "Ready btn test lobby",
        type: "friendly",
        matchSettings: {
            map: "4-players-medium",
            mode: "modern",
            duration: "blitz"
        }
    };

    const slotsSettings = [
        {
            team: "LEFT",
            role: "BACK",
            playerSettings: {
                alias: "player1 alias",
                upButton: "q",
                downButton: "a",
                paddleSpriteIndex: 1
            }
        },
        {
            team: "RIGHT",
            role: "BACK",
            playerSettings: {
                alias: "player2 alias",
                upButton: "o",
                downButton: "l",
                paddleSpriteIndex: 2
            }
        },
        {
            team: "TOP",
            role: "BACK",
            playerSettings: {
                alias: "playe3 alias",
                upButton: "t",
                downButton: "y",
                paddleSpriteIndex: 3
            }
        },
    ]

    const vala = await UserSession.create(browser, '.auth/ndo-vala-auth.json');
    const vale = await UserSession.create(browser, '.auth/ndo-vale-auth.json');

    await vala.hostLobby(lobbySettings);
    await vala.setReady(false);
    await vala.joinFriendlySlot(slotsSettings[0]);
    await vala.setReady(true);
    await vala.unsetReady();
    await vale.enterLobby(lobbySettings.name);
    await vale.joinFriendlySlot(slotsSettings[2]);
    await vala.withdrawFromSlot(slotsSettings[0].team, slotsSettings[0].role);

    /* console.log("FIRST START");
    await vala.startLobbyEvent("Not everyone is ready!");
    await vala.setReady(true);
    console.log("SECOND START");
    await vala.startLobbyEvent("Not everyone is ready!");
    await vala.unsetReady();
    await vale.setReady(true);
    console.log("THIRD START");
    await vala.startLobbyEvent("Not everyone is ready!");
    await vala.setReady(true);
    console.log("CORRECT START")
    await vala.startLobbyEvent("start succeded");
    await vala.page.waitForTimeout(4000); //initial countdown
    await vala.page.keyboard.down("ArrowDown");
    await vala.page.keyboard.down("ArrowUp");
    await vala.page.waitForTimeout(4000); //Self destruct timer
    await vala.page.keyboard.up("ArrowDown");
    await vala.page.keyboard.up("ArrowUp");
    console.log("probably game over by this point")
    await expect(vala.page).toHaveTitle("Lobby");


    await vala.close();
    await vale.close(); */
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
