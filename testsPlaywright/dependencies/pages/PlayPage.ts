import { expect, type Page } from "@playwright/test";

import APage from "./APage";
import { BASE_URL } from "../typesAndConsts";

export default class PlayPage extends APage {
    constructor(page: Page) {
        super(page, BASE_URL + "/play")
    }

    async goToCreateLobbyPage() {
        await this._page.getByRole("button", { name: "New Lobby"}).click();
        await expect(this._page).toHaveTitle("Create Lobby")
    }

    async enterLobby(lobbyName: string, pageExpected: string) {
        await this._page.locator('#btn-refresh').click();
        const row = this._page.locator(`//table/tbody/tr[td[1][contains(text(), ${lobbyName})]]`);
        if (row) {
            await row.click();
            await expect(this._page).toHaveTitle(pageExpected); //Depends whether there is an event active in the lobby or not
        } else {
            console.log("There is no lobby with this name");
            await expect(this._page).toHaveTitle("Play");
        }
    }
}