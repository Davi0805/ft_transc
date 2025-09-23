import { Page } from "@playwright/test";

export default abstract class APage {
    constructor(page: Page, url: string | null = null) {
        this._page = page;
        this._url = url;
    }

    async goto() {
        await this._page.goto(this.url);
    }

    protected _page: Page;

    private _url: string | null;
    get url() {
        if (!this._url) {throw Error("There is no url for this page")}
        return this._url
    }
}