import { expect, type Page } from "@playwright/test";

import APage from "./APage";
import { BASE_URL } from "../typesAndConsts";

export type LobbySettings = {
  name: string, 
  type: string,
  matchSettings: {
    map: string,
    mode: string,
    duration: string
  }
}

export default class CreateLobbyPage extends APage {
    constructor(page: Page) {
        super(page, BASE_URL + "/create-lobby")
    }

    async createLobby(lobbySettings: LobbySettings) {
        await this._page.getByLabel("Name").fill(lobbySettings.name);
        await this._page.getByLabel("Type").selectOption(lobbySettings.type);
        await this._page.getByLabel("Map").selectOption(lobbySettings.matchSettings.map);
        await this._page.getByLabel("Mode").selectOption(lobbySettings.matchSettings.mode);
        await this._page.getByLabel("Duration").selectOption(lobbySettings.matchSettings.duration);

        await this._page.getByRole("button", { name: "Create Lobby"}).click();
        await expect(this._page).toHaveTitle("Lobby");
        await expect(this._page.getByRole("heading", { name: lobbySettings.name })).toBeVisible();
        
        await expect(this._page.locator("#match-map")).toHaveText(lobbySettings.matchSettings.map);
    }
}