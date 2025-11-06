import { authService } from "../services/authService";
import { header } from "../components/header";
import { translator } from "../services/translationService";
import { Route, routes } from "./routes";
import { getUserDataByUsername } from "../api/userData/getUserDataByUsernameAPI";
import { UserData } from "../api/userData/types/UserDataType";
import { getProfileUserData } from "../api/userData/getProfileUserDataAPI";
import { ProfileDataType } from "../api/userData/types/ProfileDataType";
import { isUserBlockedByUsername } from "../api/block/isUserBlockedByUsername";

class Router {
  private routes: Array<Route>;

  constructor(routes: Array<Route>) {
    this.routes = routes; // store route configurations
  }

  init(): void {
    // Handle manual URL changes (on back/forward buttons)
    window.addEventListener("popstate", () => {
      this.loadRoute();
    });

    // Intercept < data-link> clicks and handle manually the navigation
    document.addEventListener("click", (e: Event) => {
      const target = e.target as Element;
      const link = target?.closest("a[data-link]"); // Verifica se o clique foi em um <a> com data-link
      if (link) {
        e.preventDefault(); // Previne o comportamento padrão do navegador
        const href = link.getAttribute("href"); // Obtém o valor do href
        //TODO ver se o socket do jogo esta open, se tiver close
        this.navigateTo(href!); // Navega para a rota usando o router
      }
    });

    this.loadRoute();
  }

  async navigateTo(url: string): Promise<void> {
    const finalUrl: string = authService.handleProtectedRoute(url);
    //  Dont update anything if we are on the correct page
    if (window.location.pathname === finalUrl) {
      return; 
    }
    
    // Update our browser history without reload
    //                state, title, url
    history.pushState(null, "", finalUrl);
    // Load the new route
    await this.loadRoute();
  }

  async loadRoute(): Promise<void> {
    // Get current path
    let path: string = window.location.pathname;

    if (!authService.canAccessRoute(path)) {
      path = "/login";
      history.replaceState(null, "", path);
    }

    // Handle dynamic profile route
    if (path.startsWith("/profile/")) {
      await this.handleProfileRoute(path);
      return;
    }

    // Find matching route or fallback to 404 not found
    // find returns undified (evaluates as false) if cant find anything
    const route: Route | null =
      this.routes.find((r: Route) => r.path === path) ||
      this.routes.find((r: Route) => r.path === "/404") ||
      null;

    if (!route || route?.path === "/404") {
      history.replaceState(null, "", "/404");
    }

    if (route) {
      header.updateActiveUnderline(path);

      // Load HTML template
      document.getElementById("main")!.innerHTML = await route.template();
      // Update page title
      document.title = route.title;
      // Initialize page-specific js (if any)
      route.script?.init();
      // Translate page content
      translator.apply();
    }
  }

  // Profile page has a dynamic url
  // /profile/${id}
  async handleProfileRoute(path: string): Promise<void> {
    if (path.startsWith("/profile/")) {
      try {
        // Extract id from the path
        const id: string = path.split("/")[2];

        // regex validation for id
        if (!id || !/^\d+$/.test(id)) {
          throw new Error("Invalid id format");
        }
        const userData: ProfileDataType | null = await getProfileUserData(parseInt(id));
        let route: Route | null =
          this.routes.find((r: Route) => r.path.startsWith("/profile")) ||
          this.routes.find((r: Route) => r.path === "/404") ||
          null;


        document.title = `${userData.nickname}'s profile`;
        // Load HTML template
        document.getElementById("main")!.innerHTML = await route?.template();

        // Update page title
        header.updateActiveUnderline("Profile"); // this could be wte. just to remove the underline

        // Initialize page-specific js (if any)
        route?.script?.init(userData);
        // Translate page content
        translator.apply();

      } catch (error: any) {
        console.error("Failed to fetch user data:", error);
        path = "/404"; // User not found, redirect to 404
        history.replaceState(null, "", path);
        await this.loadRoute();
      }
    }
  }
}

export const router = new Router(routes);
