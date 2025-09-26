import { header } from "../components/header";
import { Chat } from "../components/sidebar";
import {getSelfData } from "../api/userData/getSelfDataAPI";
import { getUserAvatarById } from "../api/userData/getUserAvatarAPI";
import { webSocketService } from "../services/webSocketService";
import { chatWindowControler } from "../components/chatWindow";
import { router } from "../routes/router";
import { UserData } from "../api/userData/types/UserDataType";

export class AuthService {
  private protectedRoutes: string[];
  private authToken: string | null;
  private has2FA: boolean;

  public userID: number | null;
  public userNick: string | null;
  public userAvatar: string | null;
  public userUsername: string | null;
  public userEmail: string | null;
  public isAuthenticated: boolean;
  public sidebar: Chat | null;

  constructor() {
    this.protectedRoutes = ["/play", "/profile"];
    this.userID = null;
    this.userNick = null;
    this.userAvatar = null;
    this.userUsername = null;
    this.userEmail = null;
    this.authToken = null;
    this.has2FA = false;
    this.isAuthenticated = false;
    this.sidebar = null;
  }

  async init(): Promise<void> {
    this.authToken = localStorage.getItem("authToken");
    this.isAuthenticated = !!this.authToken;
    if (this.isAuthenticated) await this.getMyData();

    header.updateHeaderVisibility();

    if (this.isAuthenticated) {
      this.sidebar = new Chat();
      document.body.querySelector("main")?.classList.remove("mr-0");
      document.body.querySelector("main")?.classList.add("mr-[200px]");
      await this.sidebar.init();
    }

    return;
  }

  async getMyData(): Promise<void> {
    try {
      const userData: UserData = await getSelfData();
      this.userID = userData.id;
      this.userNick = userData.nickname;
      this.userEmail = userData.email || null;
      this.userUsername = userData.username;

      this.userAvatar = await getUserAvatarById(this.userID);
    } catch (error) {
      this.logout();
      console.log("DEBUG: Did not get self data", error);
    }

    return;
  }

  async login(token: string): Promise<void> {
    this.authToken = token;
    this.isAuthenticated = true;
    localStorage.setItem("authToken", token);
    await this.getMyData();
    header.updateHeaderVisibility();
    if (!this.sidebar) {
      document.body.querySelector("main")?.classList.remove("mr-0");
      document.body.querySelector("main")?.classList.add("mr-[200px]");
      this.sidebar = new Chat();
      await this.sidebar.init();
    }

    return;
  }

  async logout(): Promise<void> {
    this.userID = null;
    this.userNick = null;
    this.userAvatar = null;
    this.userUsername = null;
    this.userEmail = null;

    this.authToken = null;
    this.has2FA = false;
    this.isAuthenticated = false;
    localStorage.removeItem("authToken");
    header.updateHeaderVisibility();
    chatWindowControler.close();
    webSocketService.disconnect();
    if (this.sidebar) {
      document.body.querySelector("main")?.classList.remove("mr-[200px]");
      document.body.querySelector("main")?.classList.add("mr-0");
      this.sidebar.deleteSideBar();
      this.sidebar = null;
    }
    router.navigateTo("/");
  }

  getToken(): string | null {
    return this.authToken;
  }

  isUserAuthenticated(): boolean {
    return this.isAuthenticated;
  }

  getHas2FA(): boolean {
    return this.has2FA;
  }

  setHas2FA(value: boolean): void {
    this.has2FA = value;
  }

  canAccessRoute(routePath: string): boolean {
    if (this.protectedRoutes.includes(routePath) || routePath.startsWith("/profile/")) {
      return this.isAuthenticated;
    }
    return true;
  }

  handleProtectedRoute(routePath: string): string {
    if (!this.canAccessRoute(routePath)) {
      sessionStorage.setItem("redirectAfterLogin", routePath);
      return "/login";
    }
    return routePath;
  }

  getRedirectAfterLogin(): string {
    const redirect = sessionStorage.getItem("redirectAfterLogin");

    if (redirect) {
      sessionStorage.removeItem("redirectAfterLogin");
      return redirect;
    }
    return "/";
  }
}

export const authService = new AuthService();
