import { BrowserContext, Page } from "@playwright/test";

export type UserSession = {
  context: BrowserContext;
  page: Page;
};

export const GAME_SERVICE_URL = '127.0.0.1:8084'
export const BASE_URL = '127.0.0.1:8888';