import { test as setup } from '@playwright/test'
import LoginPage from '../dependencies/pages/LoginPage'

const USERS_INFO = [
    {
        username: "ndo-vala",
        password: "Qwer123$"
    },
    {
        username: "ndo-vale",
        password: "Qwer123$"
    },
    {
        username: "ndo-vali",
        password: "Qwer123$"
    },
    {
        username: "ndo-valo",
        password: "Qwer123$"
    },
]

setup('authenticate', async ({ browser }) => {
    const promises = USERS_INFO.map(async userInfo => {
        const context = await browser.newContext();
        const page = await context.newPage();
        const loginPage = new LoginPage(page);
        await loginPage.goto();
        await loginPage.login(userInfo.username, userInfo.password);
        await page.context().storageState({ path: `.auth/${userInfo.username}-auth.json` });
        await page.context().close();
    })
    await Promise.all(promises);
})