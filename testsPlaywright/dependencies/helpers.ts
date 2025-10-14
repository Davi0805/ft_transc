import { Page } from "@playwright/test";
import HomePage from "./pages/HomePage";
import PlayPage from "./pages/PlayPage";
import CreateLobbyPage, { LobbySettings } from "./pages/CreateLobbyPage";



export async function hostLobby(page: Page, lobbySettings: LobbySettings) {
  const homePage = new HomePage(page);
  await homePage.goto();
  await homePage.goToPlayPage();
  const playPage = new PlayPage(page);
  await playPage.goToCreateLobbyPage();
  const createPage = new CreateLobbyPage(page);
  await createPage.createLobby(lobbySettings);
}