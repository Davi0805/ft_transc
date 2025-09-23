import { expect } from "@playwright/test";
import { fromHomeCreateLobby } from "../dependencies/helpers";
import { LobbySettings } from "../dependencies/pages/CreateLobbyPage";
import MatchPage from "../dependencies/pages/MatchPage";
import PlayPage from "../dependencies/pages/PlayPage";
import TournamentPage from "../dependencies/pages/TournamentPage";
import { fourUsers, twoUsers } from "../LobbyFixtures";

/* twoUsers("ReconnectRanked", async ({ users }) => {
    const host = users[0];
    const user = users[1];
    const lobbySettings: LobbySettings = {
        name: "TestLobby",
        type: "ranked",
        matchSettings: {
            map: "2-players-small",
            mode: "classic",
            duration: "blitz"
        }
    }

    await fromHomeCreateLobby(host.page, lobbySettings);
    const hMatch = new MatchPage(host.page);
    await hMatch.chooseSlot("RIGHT", "BACK");
    await hMatch.toggleReady();

    const uPlay = new PlayPage(user.page);
    await uPlay.goto();
    await uPlay.enterLobby(lobbySettings.name, "Lobby");
    const uMatch = new MatchPage(user.page);
    await uMatch.chooseSlot("LEFT", "BACK");
    await uMatch.toggleReady();
    
    await hMatch.start();

    await user.page.waitForTimeout(4 * 1000);
    await user.page.keyboard.down("ArrowDown");
    await user.page.waitForTimeout(0.3 * 1000);
    await user.page.keyboard.up("ArrowDown");
    await user.page.screenshot({ path: 'screenshots/beforeReconnectMove.png'})

    await uPlay.goto();
    await uPlay.enterLobby(lobbySettings.name, "Match");

    await user.page.waitForTimeout(1 * 1000);
    await user.page.keyboard.down("ArrowUp");
    await user.page.waitForTimeout(0.3 * 1000);
    await user.page.keyboard.up("ArrowUp");

    await user.page.waitForTimeout(1 * 1000);
    await user.page.screenshot({ path: 'screenshots/afterReconnectMove.png' });
}) */

fourUsers("ReconnectTournament", async ({ users }) => {
    fourUsers.setTimeout(1000 * 1000);

    const host = users[0];
    const lobbySettings: LobbySettings = {
        name: "TestLobby",
        type: "tournament",
        matchSettings: {
            map: "2-players-small",
            mode: "classic",
            duration: "blitz"
        }
    }

    await fromHomeCreateLobby(host.page, lobbySettings);
    const hTourn = new TournamentPage(host.page);
    await hTourn.join("ndo-vala");
    await hTourn.toggleReady();

    const userFlows = users.slice(1).map(user => {
        return (async () => {
            const uPlay = new PlayPage(user.page);
            await uPlay.goto();
            await uPlay.enterLobby(lobbySettings.name, "Lobby");
            const uTourn = new TournamentPage(user.page);
            await uTourn.join(user.username);
            await uTourn.toggleReady();
        })();
    });

    await Promise.all(userFlows);

    hTourn.start();


    const reconnectingUser = users[1];
    await expect(reconnectingUser.page).toHaveTitle("Tournament", { timeout: 20000 });
    const infoLocator = reconnectingUser.page.locator("#info-on-display");
    await expect(infoLocator).toHaveText("Initial Standings", { timeout: 100000});
    console.log("Reached the first tournament page");

    const rPlay = new PlayPage(reconnectingUser.page);
    await rPlay.goto();
    await rPlay.enterLobby(lobbySettings.name, "Tournament");
    await expect(infoLocator).toHaveText("Initial Standings", { timeout: 100000});
    console.log("Reconnect during initial standings successful");

    await expect(infoLocator).toHaveText("Round 1 pairings", { timeout: 20000});
    console.log("Reached round 1 pairings");
    await rPlay.goto();
    await rPlay.enterLobby(lobbySettings.name, "Tournament");
    await expect(infoLocator).toHaveText("Round 1 pairings", { timeout: 20000});
    console.log("Reconnect during Round 1 pairings successful");

    await expect(reconnectingUser.page).toHaveTitle("Match", { timeout: 20000 });

    await rPlay.goto();
    await rPlay.enterLobby(lobbySettings.name, "Match");

    await expect(reconnectingUser.page).toHaveTitle("Tournament", { timeout: 90000 });

    await expect(infoLocator).toHaveText("Round 2 pairings", { timeout: 100000});
})