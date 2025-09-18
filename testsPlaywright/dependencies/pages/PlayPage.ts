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

    async enterFirstLobby() {
        /* const buttons = await this._page.getByRole("button").all();
        for (const button of buttons) {
            console.log("NEW BUTTON:")
            const text = await button.textContent();
            console.log(text)
            console.log("-----------------")
        } */
        await this._page.locator('#btn-refresh').click();
        await this._page.waitForSelector('table tbody tr');
        const firstRow = this._page.locator('table tbody tr:first-child');
        if (firstRow) {
            await firstRow.click();
            await expect(this._page).toHaveTitle("Lobby");
        } else {
            console.log("There are no lobbies to be entered!");
            await expect(this._page).toHaveTitle("Play");
        }
    }
}