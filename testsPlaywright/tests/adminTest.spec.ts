import test, { expect } from "@playwright/test";
import { loginAsUser } from "../dependencies/helpers";
import { BASE_URL, GAME_SERVICE_URL } from "../dependencies/typesAndConsts";
import HomePage from "../dependencies/pages/HomePage";
import PlayPage from "../dependencies/pages/PlayPage";
import CreateLobbyPage from "../dependencies/pages/CreateLobbyPage";
import MatchPage from "../dependencies/pages/MatchPage";

test('Delete repos', async ({ browser }) => {
    const { context: aContext, page: aPage } = await loginAsUser(
        browser, "admin", "Qwer123$"
    )
    await aPage.request.post("http://" + GAME_SERVICE_URL + "/removeRepos");

    const home = new HomePage(aPage);
    await home.goToPlayPage();
    const play = new PlayPage(aPage);
    await play.goToCreateLobbyPage();
    const create = new CreateLobbyPage(aPage);
    await create.createLobby("test", "friendly");
    const lobby = new MatchPage(aPage);
    await lobby.chooseSlot();
    const pLocator = aPage.locator('#players p');


    //PUT THIS IN FRIENDLYPAGE CLASS
    await expect(aPage.locator('dialog')).toBeVisible();
    await expect(aPage.getByLabel("Alias")).toBeVisible();
    await aPage.getByLabel("Alias").fill("alias1");
    await aPage.getByRole("button", { name: "Join Game"}).click();


    await expect(pLocator).toHaveText("alias1");
    await lobby.toggleReady();
    await lobby.start();
    await aPage.waitForTimeout(4000);
    await aPage.keyboard.down("ArrowDown");
    await aPage.waitForTimeout(200);
    await aPage.keyboard.up("ArrowDown");
    await aPage.keyboard.down("ArrowUp");
    await aPage.waitForTimeout(200);
    await aPage.keyboard.up("ArrowUp");
    await aPage.keyboard.down("ArrowDown");
    await aPage.waitForTimeout(200);
    await aPage.keyboard.up("ArrowDown");
    await aPage.keyboard.down("ArrowUp");
    await aPage.waitForTimeout(200);
    await aPage.keyboard.up("ArrowUp");
    await aPage.keyboard.down("ArrowDown");
    await aPage.waitForTimeout(200);
    await aPage.keyboard.up("ArrowDown");
    await aPage.keyboard.down("ArrowUp");
    await aPage.waitForTimeout(200);
    await aPage.keyboard.up("ArrowUp");
    await aPage.keyboard.down("ArrowDown");
    await aPage.waitForTimeout(200);
    await aPage.keyboard.up("ArrowDown");
    await aPage.keyboard.down("ArrowUp");
    await aPage.waitForTimeout(200);
    await aPage.keyboard.up("ArrowUp");
    await aPage.waitForTimeout(5000);


})