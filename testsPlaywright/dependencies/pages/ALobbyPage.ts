import { Page } from "@playwright/test";
import { BASE_URL } from "../typesAndConsts";
import APage from "./APage";

export default abstract class ALobbyPage extends APage {
    constructor(page: Page) {
        super(page, BASE_URL + "/lobby");
    }

    async toggleReady() {
        await this._page.getByRole('button', { name: "Ready"}).click();
    }

    async start() {
        await this._page.getByRole('button', { name: "Start"}).click();
        
    }
}