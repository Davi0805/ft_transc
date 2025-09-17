import type { Browser } from "@playwright/test";

import { BASE_URL, UserSession } from "./typesAndConsts";
import LoginPage from "./pages/LoginPage";

export async function loginAsUser(
  browser: Browser,
  username: string,
  password: string = "PasswordExample",
  URL: string = BASE_URL + "/login",
): Promise<UserSession> {
  const context = await browser.newContext({
    viewport: { width: 1280, height: 800 }
  });
  const page = await context.newPage();
  const loginPage = new LoginPage(page);

  await loginPage.goto();
  await loginPage.login(username, password);

  return { context, page};
}