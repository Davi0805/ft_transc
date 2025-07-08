import { header } from "../components/header";
import { Chat } from "../components/sidebar";
import { SelfData, getSelfData } from "../api/getSelfDataAPI";
import { getUserAvatarById } from "../api/getUserAvatarAPI";
import { webSocketService } from "./webSocketService";
import { chatWindowControler } from "../components/chatWindow";

export class AuthService {
  private protectedRoutes: string[];
  private authToken: string | null;

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
    this.isAuthenticated = false;
    this.sidebar = null;
  }

  async init(): Promise<void> {
    this.authToken = localStorage.getItem("authToken");
    this.isAuthenticated = !!this.authToken;
    if (this.isAuthenticated)
      await this.getMyData();

    header.updateHeaderVisibility();

    if (this.isAuthenticated) {
      this.sidebar = new Chat();
      await this.sidebar.init();
    }

    return;
  }

    async  getMyData(): Promise<void> {
      try {
        const userData: SelfData = await getSelfData();
        this.userID = userData.id;
        this.userNick = userData.nickname;
        this.userEmail = userData.email;
        this.userUsername = userData.username;
        
        this.userAvatar = await getUserAvatarById(this.userID);
      } catch (error) {
        this.authToken = null;
        localStorage.removeItem("authToken");
        this.isAuthenticated = false;
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
    this.isAuthenticated = false;
    localStorage.removeItem("authToken");
    header.updateHeaderVisibility();
    chatWindowControler.close();
    webSocketService.disconnect();
    if (this.sidebar) {
      this.sidebar.deleteSideBar();
      this.sidebar = null;
    }
  }

  getToken(): string | null {
    return this.authToken;
  }

  isUserAuthenticated(): boolean {
    return this.isAuthenticated;
  }

  canAccessRoute(routePath: string): boolean {
    if (this.protectedRoutes.includes(routePath)) {
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
