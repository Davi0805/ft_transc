import { getSelfData } from "../api/getSelfDataAPI.js";
import { getUserAvatarById } from "../api/getUserAvatarAPI.js";
import { Chat } from "../components/sidebar.js";
export class AuthService {
  constructor() {
    this.protectedRoutes = ["/play", "/profile"];
    this.userID = null;
    this.init();
  }

  init() {
    this.authToken = localStorage.getItem("authToken");
    this.isAuthenticated = !!this.authToken;
  }

  async login(token) {
    this.authToken = token;
    this.isAuthenticated = true;
    localStorage.setItem("authToken", token);
    await this.updateHeaderVisibility();
    const sidebar = new Chat(this.userID);
  }

  async logout() {
    this.authToken = null;
    this.isAuthenticated = false;
    localStorage.removeItem("authToken");
    await this.updateHeaderVisibility();
  }

  getToken() {
    return this.authToken;
  }

  isUserAuthenticated() {
    return this.isAuthenticated;
  }

  async updateHeaderVisibility() {
    const loggedOut = document.getElementById("log-reg");
    const loggedIn = document.getElementById("user-in");
    const headerNick = document.getElementById("profile-link");
    const headerAvatar = document.querySelector('.profile-avatar');

    const showLoggedOutVersion = () => {
      loggedIn.style.display = "none";
      loggedOut.style.display = "flex";

    };

    const showLoggedInVersion = (nickname, avatarURL) => {
      loggedOut.style.display = "none";
      loggedIn.style.display = "flex";
      headerNick.textContent = nickname;
      headerAvatar.src = avatarURL;
    };

    if (!this.isAuthenticated) {
      showLoggedOutVersion();
      return;
    }

    try {
      const userData = await getSelfData();
      this.userID = userData.id;
      let userAvatar = await getUserAvatarById(this.userID);
      if (!userAvatar) userAvatar = "./Assets/default/bobzao.jpg";
      showLoggedInVersion(userData.nickname, userAvatar);
    } catch (error) {
      this.authToken = null;
      this.isAuthenticated = false;
      showLoggedOutVersion();
    }
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
