import { expect, type Page } from "@playwright/test";

import APage from "./APage";
import { BASE_URL } from "../typesAndConsts";

export default class HomePage extends APage {
    constructor(page: Page) {
        super(page, BASE_URL);
    }

    async goToPlayPage() {
        await this._page.getByRole("link", { name: "Play Now"}).click();
        await expect(this._page).toHaveTitle("Play");
    }
}