import type { Page } from "@playwright/test";

import APage from "./APage";
import { BASE_URL } from "../typesAndConsts";

export default class CreateLobbyPage extends APage {
    constructor(page: Page) {
        super(page, BASE_URL + "/create-lobby")
    }

    async createLobby(lobbyName: string, type: string) {
        await this._page.getByLabel("Name").fill(lobbyName);
        await this._page.getByLabel("Type").selectOption(type);
        await this._page.getByRole("button", { name: "Create Lobby"}).click();
    }
}