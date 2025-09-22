import { fromHomeCreateLobby } from "../dependencies/helpers";
import { LobbySettings } from "../dependencies/pages/CreateLobbyPage";
import MatchPage from "../dependencies/pages/MatchPage";
import PlayPage from "../dependencies/pages/PlayPage";
import { twoUsers } from "../LobbyFixtures";

twoUsers("ReconnectRanked", async ({ users }) => {
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
    await hMatch.chooseSlot();
    await hMatch.toggleReady();

    const uPlay = new PlayPage(user.page);
    await uPlay.goto();
    await uPlay.enterFirstLobby();
    const uMatch = new MatchPage(user.page);
    await uMatch.chooseSlot();
    await uMatch.toggleReady();
    
    await hMatch.start();

    await user.page.waitForTimeout(4 * 1000);
    await user.page.keyboard.down("ArrowDown");
    await user.page.waitForTimeout(0.3 * 1000);
    await user.page.keyboard.up("ArrowDown");
    await user.page.screenshot({ path: 'screenshots/beforeReconnectMove.png'})

    await uPlay.goto();
    await uPlay.enterFirstLobby();

    await user.page.waitForTimeout(1 * 1000);
    await user.page.keyboard.down("ArrowUp");
    await user.page.waitForTimeout(0.3 * 1000);
    await user.page.keyboard.up("ArrowUp");

    await user.page.waitForTimeout(1 * 1000);
    await user.page.screenshot({ path: 'screenshots/afterReconnectMove.png' });
})

twoUsers("ReconnectRanked", async ({ users }) => {
    const host = users[0];
    const user = users[1];
    const lobbySettings: LobbySettings = {
        name: "TestLobby",
        type: "friendly",
        matchSettings: {
            map: "2-players-small",
            mode: "classic",
            duration: "blitz"
        }
    }

    await fromHomeCreateLobby(host.page, lobbySettings);
    const hMatch = new MatchPage(host.page);
    await hMatch.chooseSlot();
    await hMatch.toggleReady();

    const uPlay = new PlayPage(user.page);
    await uPlay.goto();
    await uPlay.enterFirstLobby();
    const uMatch = new MatchPage(user.page);
    await uMatch.chooseSlot();
    await uMatch.toggleReady();
    
    await hMatch.start();

    await user.page.waitForTimeout(4 * 1000);
    await user.page.keyboard.down("ArrowDown");
    await user.page.waitForTimeout(0.3 * 1000);
    await user.page.keyboard.up("ArrowDown");
    await user.page.screenshot({ path: 'screenshots/beforeReconnectMove.png'})

    await uPlay.goto();
    await uPlay.enterFirstLobby();

    await user.page.waitForTimeout(1 * 1000);
    await user.page.keyboard.down("ArrowUp");
    await user.page.waitForTimeout(0.3 * 1000);
    await user.page.keyboard.up("ArrowUp");

    await user.page.waitForTimeout(1 * 1000);
    await user.page.screenshot({ path: 'screenshots/afterReconnectMove.png' });
})