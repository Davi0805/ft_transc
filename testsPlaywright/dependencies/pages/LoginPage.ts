import type { Page } from "@playwright/test";

import APage from "./APage";
import { BASE_URL } from "../typesAndConsts";

export default class LoginPage extends APage {
    constructor(page: Page) {
        super(page, BASE_URL + "/login");
    }

    async login(username: string, password: string) {
        await this._page.getByPlaceholder('Username').fill(username);
        await this._page.getByPlaceholder('Password').fill(password);
        await this._page.getByRole("button", { name: "Login"}).click();
    }
}