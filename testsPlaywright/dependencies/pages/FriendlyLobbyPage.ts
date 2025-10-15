import { Page } from "@playwright/test";
import ALobbyPage from "./LobbyPage";

export type PlayerSettings = {
    alias: string,
    upButton: string,
    downButton: string,
    paddleSpriteIndex: number
}

export default class FriendlyLobbyPage extends ALobbyPage {
    constructor(page: Page) {
        super(page);
    }

    async chooseSlot(team: string, role: string, playerSettings: PlayerSettings): Promise<void> {

        console.log("chooseSlot was called")
        
        await this._page.click(`#join-${team}-${role}`);
        await this._page.waitForSelector('dialog[open]');
        
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
}