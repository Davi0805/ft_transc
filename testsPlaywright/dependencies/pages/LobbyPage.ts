import { expect, Page } from "@playwright/test";
import { BASE_URL } from "../typesAndConsts";
import APage from "./APage";

export type StartBehavior = "start succeded"
        | "Not everyone is ready!"
        | "Not all slots are filled!"
        | "Host is not present";


export default class LobbyPage extends APage {
    constructor(page: Page) {
        super(page, BASE_URL + "/lobby");
    }

    async getLobbyName() {
        const locator = this._page.locator("#lobby-title");
        return await locator.textContent();
    }

    async leave() {
        const button = this._page.locator("#btn-leave");
        await button.click();
        await expect(this._page).toHaveTitle("Play");
    }

    async toggleReady(behavior: "ready succeded" | "un-ready succeded" | "ready failed") {
        const button = this._page.locator('#btn-ready');
        await button.click();
        switch (behavior) {
            case "ready succeded":
                await expect(button).toHaveText("I'm ready! (cancel...)");
                break;
            case "un-ready succeded":
                await expect(button).toHaveText("Ready");
                break;
            case "ready failed":
                await expect(button).toHaveText("You must join first!");
                break;
            default:
                console.log("behavior not recognized!");
        } 
    }

    async start(behavior: StartBehavior) {
        const button = this._page.locator('#btn-start');
        await button.click();

        switch (behavior) {
            case "start succeded":
                await expect(this._page).toHaveTitle("Match");
                break;
            case "Not everyone is ready!":
                await expect(button).toHaveText("Not everyone is ready!");
                break;
            case "Not all slots are filled!":
                await expect(button).toHaveText("Not all slots are filled!");
                break;
            case "Host is not present":
                await expect(this._page).toHaveTitle("Play");
                break;
            default:
                console.log("behavior not recognized!");
        }
    }
}