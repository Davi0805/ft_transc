import { test as base } from "@playwright/test";
import UserSession from "./dependencies/User";
import LoginPage from "./dependencies/pages/LoginPage";

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


export const oneUser = base.extend<{
    user: UserSession
}>({
    user: async ({ browser }, use) => {
        const userInfo = USERS_INFO[0];
        const user = await UserSession.create(browser, userInfo.username, userInfo.password, LoginPage);
        await use(user);
    }
})

export const twoUsers = base.extend<{
    users: UserSession[]
}>({
    users: async ({ browser }, use) => {
        const usersInfo = USERS_INFO.slice(0, 2);
        const users = await Promise.all(
            usersInfo.map(async userInfo => {
                return UserSession.create(browser, userInfo.username, userInfo.password, LoginPage);
            })
        );
        await use(users);
    }
})

export const fourUsers = base.extend<{
    users: UserSession[]
}>({
    users: async ({ browser }, use) => {
        const users = await Promise.all(
            USERS_INFO.map(async userInfo => {
                return UserSession.create(browser, userInfo.username, userInfo.password, LoginPage);
            })
        );
        await use(users);
    } 
})