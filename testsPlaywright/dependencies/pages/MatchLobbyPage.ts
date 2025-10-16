import { expect, Page } from "@playwright/test";
import LobbyPage from "./LobbyPage";

export type PlayerSettings = {
    alias: string,
    upButton: string,
    downButton: string,
    paddleSpriteIndex: number
}

export type SlotSettings = {
    team: string,
    role: string,
    playerSettings: PlayerSettings
}

export default class MatchLobbyPage extends LobbyPage {
    constructor(page: Page) {
        super(page);
    }

    async selectSlot(team: string, role: string) {
        await this._page.click(`#join-${team}-${role}`);        
    }

    async fillAndSubmitSlotDialog(playerSettings: PlayerSettings) {
        await expect(this._page.locator('dialog[open]')).toBeVisible();
        await this._page.getByLabel('Alias').fill(playerSettings.alias);
        
        for (let i = 0; i < playerSettings.paddleSpriteIndex; i++) {
            await this._page.click('#paddle-next');
        }

        await this._page.getByLabel('Up Button').click();
        await this._page.keyboard.press(playerSettings.upButton);
        await this._page.getByLabel('Down Button').click();
        await this._page.keyboard.press(playerSettings.downButton);

        await this._page.click('#btn-close-dialog');
    }

    async chooseFriendlySlot(slotSettings: SlotSettings): Promise<void> {
        this.selectSlot(slotSettings.team, slotSettings.role);
        this.fillAndSubmitSlotDialog(slotSettings.playerSettings);
    }

    async chooseRankedSlot(team: string, role: string) {
        this.selectSlot(team, role);
    }
}