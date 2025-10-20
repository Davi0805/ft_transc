import { Browser, BrowserContext, expect, Page } from "@playwright/test";
import CreateLobbyPage, { LobbySettings } from "./pages/CreateLobbyPage";
import PlayPage from "./pages/PlayPage";
import LobbyPage, { StartBehavior } from "./pages/LobbyPage";
import MatchLobbyPage, { PlayerSettings, SlotSettings } from "./pages/MatchLobbyPage"
import TournamentLobbyPage from "./pages/TournamentLobbyPage";

export default class UserSession {
    get page() { return this._page; }

    static async create(browser: Browser, sessionStorageFile: string) {
        const ctx = await browser.newContext({
            viewport: { width: 1280, height: 800 },
            storageState: sessionStorageFile
        });
        const page = await ctx.newPage();

        page.on('console', async msg => {
            const args = msg.args();
            for (const arg of args) {
                try {
                const val = await arg.jsonValue();
                console.log(`[${msg.type()}]`, val);
                } catch {
                console.log(`[${msg.type()}]`, arg.toString());
                }
            }
        });

        return new UserSession(ctx, page);
    }

    async hostLobby(lobbySettings: LobbySettings) {
      const playPage = new PlayPage(this._page);
      await playPage.goto();
      await playPage.goToCreateLobbyPage();
      const createPage = new CreateLobbyPage(this._page);
      await createPage.createLobby(lobbySettings);
    }

    async enterLobby(lobbyName: string) {
        const playPage = new PlayPage(this._page);
        await playPage.goto();
        await playPage.enterLobby(lobbyName);
    }

    async leaveLobby(shouldLobbyExistAfterLeaving: boolean) {
        await expect(this._page).toHaveTitle("Lobby");
        const lobbyPage = new LobbyPage(this._page);
        const lobbyName = await lobbyPage.getLobbyName();
        if (!lobbyName) { throw Error("a name must exist!!")}
        await lobbyPage.leave();
        const playPage = new PlayPage(this._page);
        await playPage.checkIfLobbyExists(lobbyName, shouldLobbyExistAfterLeaving);
    }

    async setReady(shouldSucceed: boolean) {
        await expect(this._page).toHaveTitle("Lobby");
        const lobbyPage = new LobbyPage(this._page);
        await lobbyPage.toggleReady(shouldSucceed ? "ready succeded" : "ready failed");
    }

    async unsetReady() {
        await expect(this._page).toHaveTitle("Lobby");
        const lobbyPage = new LobbyPage(this._page);
        await lobbyPage.toggleReady("un-ready succeded");
    }

    async joinFriendlySlot(slotSettings: SlotSettings) {
        await expect(this._page).toHaveTitle("Lobby");
        await expect(this._page.locator("#lobby-subtitle")).toHaveText("Friendly Match Lobby");
        const page = new MatchLobbyPage(this._page);
        page.chooseFriendlySlot(slotSettings);
        await expect(this._page.locator(`#slot-${slotSettings.team}-${slotSettings.role} p`))
            .toHaveText(slotSettings.playerSettings.alias);
    }

    async openJoinFriendlySlot(team: string, role: string) {
        await expect(this._page).toHaveTitle("Lobby");
        await expect(this._page.locator("#lobby-subtitle")).toHaveText("Friendly Match Lobby");
        const page = new MatchLobbyPage(this._page);
        page.selectSlot(team, role);
        await expect(this._page.locator('dialog[open]')).toBeVisible();
    }

    async fillAndSubmitFriendlySlot(slotSettings: SlotSettings, successful: boolean) {
        await expect(this._page).toHaveTitle("Lobby");
        await expect(this._page.locator("#lobby-subtitle")).toHaveText("Friendly Match Lobby");
        await expect(this._page.locator('dialog[open]')).toBeVisible();
        const page = new MatchLobbyPage(this._page);
        await page.fillAndSubmitSlotDialog(slotSettings.playerSettings);
        if (successful) {
            await expect(this._page.locator(`#slot-${slotSettings.team}-${slotSettings.role} p`))
                .toHaveText(slotSettings.playerSettings.alias);
        }
    }
    
    async joinRankedSlot(team: string, role: string, username: string) {
        await expect(this._page).toHaveTitle("Lobby");
        await expect(this._page.locator("#lobby-subtitle")).toHaveText("Ranked Match Lobby");
        const page = new MatchLobbyPage(this._page);
        page.chooseRankedSlot(team, role);
        await expect(this._page.locator(`#slot-${team}-${role} p`))
            .toHaveText(username);
    }

    async withdrawFromSlot(team: string, role: string) {
        await expect(this._page).toHaveTitle("Lobby");
        const page = new MatchLobbyPage(this._page);
        await page.withdrawFromSlot(team, role);
        await expect(this._page.locator(`#slot-${team}-${role} button`))
            .toHaveText("Join");
        await expect(this._page.locator("#btn-ready")).toHaveText("Ready"); //Make sure that the readiness is updated if it was set before
    }

    async joinTournament(username: string) {
        await expect(this._page).toHaveTitle("Lobby");
        await expect(this._page.locator("#lobby-subtitle")).toHaveText("Tournament Lobby");
        const page = new TournamentLobbyPage(this._page);
        await page.join();
        const playerInList = this._page.locator(`#participants-table tr td:nth-child(2):text("${username}")`);
        await expect(playerInList).toBeVisible();
    }

    async withdrawFromTournament(username: string) {
        await expect(this._page).toHaveTitle("Lobby");
        await expect(this._page.locator("#lobby-subtitle")).toHaveText("Tournament Lobby");
        const page = new TournamentLobbyPage(this._page);
        page.withdraw();
        const playerInList = this._page.locator(`#participants-table tr td:nth-child(2):text("${username}")`);
        await expect(playerInList).toHaveCount(0);
    }

    async startLobbyEvent(behavior: StartBehavior) {
        await expect(this._page).toHaveTitle("Lobby");
        const page = new LobbyPage(this._page);
        await page.start(behavior);
    }

    async close() {
        await this._ctx.close();
    }

    private _ctx: BrowserContext;
    private _page: Page;

    private constructor(ctx: BrowserContext, page: Page) {
        this._ctx = ctx;
        this._page = page;
    }
}