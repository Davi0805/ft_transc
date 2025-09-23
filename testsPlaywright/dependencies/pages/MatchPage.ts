import type { Page } from "@playwright/test";

import ALobbyPage from "./ALobbyPage";

export default class MatchPage extends ALobbyPage {
    constructor(page: Page) {
        super(page)
    }

    async chooseSlot(team: string, role: string) {
        await this._page.click(`#join-${team}-${role}`);
    }

}