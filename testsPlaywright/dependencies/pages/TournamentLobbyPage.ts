import { expect, Page } from "@playwright/test";
import LobbyPage from "./LobbyPage"

export default class TournamentLobbyPage extends LobbyPage {
    constructor(page: Page) {
        super(page);
    }

    async join() {
        await this._page.getByRole('button', { name: "Join"}).click();
    }

    async withdraw() {
        await this._page.getByRole('button', { name: "Withdraw"}).click();
    }
}

