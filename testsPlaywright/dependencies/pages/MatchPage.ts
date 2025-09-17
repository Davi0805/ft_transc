import type { Page } from "@playwright/test";

import ALobbyPage from "./ALobbyPage";

export default class MatchPage extends ALobbyPage {
    constructor(page: Page) {
        super(page)
    }

    async chooseSlot() {
        await this._page.getByRole('button', { name: "Join"}).first().click(); //TODO allow to choose specific
    }

}