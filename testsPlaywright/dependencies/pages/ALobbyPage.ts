import { expect, Page } from "@playwright/test";
import { BASE_URL } from "../typesAndConsts";
import APage from "./APage";

export default abstract class ALobbyPage extends APage {
    constructor(page: Page) {
        super(page, BASE_URL + "/lobby");
    }

    async toggleReady() {
        const button = this._page.getByRole('button', { name: "Ready"});
        await button.click();
        await expect(button).toHaveText("I'm ready! (cancel...)")
    }

    async start() {
        await this._page.getByRole('button', { name: "Start"}).click();
        
    }
}