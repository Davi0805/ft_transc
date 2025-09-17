import { test, expect } from '@playwright/test'
import { loginAsUser } from '../dependencies/helpers';
import HomePage from '../dependencies/pages/HomePage';
import PlayPage from '../dependencies/pages/PlayPage';
import CreateLobbyPage from '../dependencies/pages/CreateLobbyPage';
import TournamentPage from '../dependencies/pages/TournamentPage';


test('simply enter', async ({ browser }) => {
    const players = [
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

    const { context: aContext, page: aPage } = await loginAsUser(
        browser,
        players[0].username,
        players[0].password
    )
    const aHomePage = new HomePage(aPage);
    aHomePage.goToPlayPage();
    const aPlayPage = new PlayPage(aPage);
    await aPlayPage.goToCreateLobbyPage();
    await expect(aPage).toHaveTitle("Create Lobby");
    const aCreatePage = new CreateLobbyPage(aPage);
    await aCreatePage.createLobby("tournamentTest", "Tournament");
    await expect(aPage).toHaveTitle("Lobby");
    const aLobby = new TournamentPage(aPage);
    await aLobby.join(players[0].username);
    await aLobby.setReady();
    await expect(aPage.getByRole('button', { name: "I'm ready! (cancel...)"})).toHaveText("I'm ready! (cancel...)")




    for (let i = 1; i < players.length; i++) {
        const { context: pContext, page: pPage } = await loginAsUser(
            browser, players[i].username, players[i].password
        )
        const eHomePage = new HomePage(pPage);
        await eHomePage.goToPlayPage();
        const ePlayPage = new PlayPage(pPage);
        await ePlayPage.enterFirstLobby();
        await expect(pPage).toHaveTitle("Lobby");
        const pLobby = new TournamentPage(pPage);
        await pLobby.join(players[i].username);
        await pLobby.setReady();
        await expect(pPage.getByRole('button', { name: "I'm ready! (cancel...)"})).toHaveText("I'm ready! (cancel...)")



    }

    await aLobby.start();
    await expect(aPage).toHaveTitle("Tournament");
    await aPage.waitForTimeout(10000);
    await expect(aPage).toHaveTitle("Match")
    
    //aContext.close();
    //eContext.close();
})