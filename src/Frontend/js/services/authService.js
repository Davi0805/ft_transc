import { header } from "../components/header.js";
import { Chat } from "../components/sidebar.js";
import { getSelfData } from "../api/getSelfDataAPI.js";
import { getUserAvatarById } from "../api/getUserAvatarAPI.js";
import { webSocketService } from "./webSocketService.js";
import { chatWindowControler } from "../components/chatWindow.js";
export class AuthService {
  constructor() {
    this.protectedRoutes = ["/play", "/profile"];
    this.userID = null;
    this.userNick = null;
    this.userAvatar = null;
    this.authToken = null;
    this.isAuthenticated = false;
    this.sidebar = null;
  }

  async init() {
    this.authToken = localStorage.getItem("authToken");
    this.isAuthenticated = !!this.authToken;
    if (this.isAuthenticated) await this.getMyData();
    header.updateHeaderVisibility();
    if (this.isAuthenticated) this.sidebar = new Chat(this.userID);
  }

  async getMyData() {
    try {
      const userData = await getSelfData();
      this.userID = userData.id;
      this.userNick = userData.nickname;

      this.userAvatar = await getUserAvatarById(this.userID);
      if (!this.userAvatar) this.userAvatar = "./Assets/default/bobzao.jpg";
    } catch (error) {
      this.authToken = null;
      this.authToken = localStorage.removeItem("authToken");
      this.isAuthenticated = false;
    }
  }

  async login(token) {
    this.authToken = token;
    this.isAuthenticated = true;
    localStorage.setItem("authToken", token);
    await this.getMyData();
    await header.updateHeaderVisibility();
    if (!this.sidebar) this.sidebar = new Chat(this.userID);
  }

  async logout() {
    this.authToken = null;
    this.isAuthenticated = false;
    localStorage.removeItem("authToken");
    await header.updateHeaderVisibility();
    this.sidebar.deleteSideBar();
    webSocketService.disconnect();
    chatWindowControler.close();
    
    this.sidebar = null;
  }

  getToken() {
    return this.authToken;
  }

  isUserAuthenticated() {
    return this.isAuthenticated;
  }

  canAccessRoute(routePath) {
    if (this.protectedRoutes.includes(routePath)) {
      return this.isAuthenticated;
    }
    return true;
  }

  handleProtectedRoute(routePath) {
    if (!this.canAccessRoute(routePath)) {
      sessionStorage.setItem("redirectAfterLogin", routePath);
      return "/login";
    }
    return routePath;
  }

  getRedirectAfterLogin() {
    const redirect = sessionStorage.getItem("redirectAfterLogin");

    if (redirect) {
      sessionStorage.removeItem("redirectAfterLogin");
      return redirect;
    }
    return "/";
  }
}

export const authService = new AuthService();
