import { expect, type Page } from "@playwright/test";

import APage from "./APage";
import { BASE_URL } from "../typesAndConsts";

export default class PlayPage extends APage {
    constructor(page: Page) {
        super(page, BASE_URL + "/play")
    }

    async refreshLobbies() {
        await this._page.locator('#btn-refresh').click();
    }

    async goToCreateLobbyPage() {
        await this._page.getByRole("button", { name: "New Lobby"}).click();
        await expect(this._page).toHaveTitle("Create Lobby")
    }

    async enterLobby(lobbyName: string) {
        await this.refreshLobbies();
        const row = this._page.locator(`//table/tbody/tr[td[1][contains(text(), "${lobbyName}")]]`);
        if (row) {
            await row.click();
            await expect(this._page).toHaveTitle("Lobby");
        } else {
            console.log("There is no lobby with this name");
            await expect(this._page).toHaveTitle("Play");
        }
    }

    async checkIfLobbyExists(lobbyName: string, shouldExist: boolean = true) {
        await this.refreshLobbies();
        const lobby = this._page.locator(`//table/tbody/tr[td[1][contains(text(), "${lobbyName}")]]`);
        await expect(lobby).toHaveCount(shouldExist ? 1 : 0);
    }
}