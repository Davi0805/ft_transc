import type { Page } from "@playwright/test";

import APage from "./APage";
import { BASE_URL } from "../typesAndConsts";

export default class PlayPage extends APage {
    constructor(page: Page) {
        super(page, BASE_URL + "/play")
    }

    async goToCreateLobbyPage() {
        await this._page.getByRole("button", { name: "New Lobby"}).click();
    }

    async enterFirstLobby() {
        await this._page.waitForSelector('table tbody tr');
        const firstRow = await this._page.locator('table tbody tr:first-child');
        if (firstRow) {
                await firstRow.click();
        }
    }
}