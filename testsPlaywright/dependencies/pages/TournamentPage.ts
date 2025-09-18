import { expect, type Page } from "@playwright/test";

import ALobbyPage from "./ALobbyPage";

export default class TournamentPage extends ALobbyPage {
    constructor(page: Page) {
        super(page)
    }

    async join(player: string) {
        await this._page.getByRole('button', { name: "Join"}).click();
        const playerInList = this._page.locator(`#participants-table tr td:nth-child(2):text("${player}")`);
        await expect(playerInList).toBeVisible();
    }

}