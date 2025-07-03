import { authService } from "../services/authService";
import { header } from "../components/header";
import { translator } from "../services/translationService";
import { Route, routes } from "./routes";

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
        this.navigateTo(href!); // Navega para a rota usando o router
      }
    });

    this.loadRoute();
  }

  navigateTo(url: string): void {
    const finalUrl = authService.handleProtectedRoute(url);

    // Update our browser history without reload
    //                state, title, url
    history.pushState(null, "", finalUrl);
    // Load the new route
    this.loadRoute();
  }

  async loadRoute(): Promise<void> {
    // Get current path
    let path: string = window.location.pathname;

    if (!authService.canAccessRoute(path)) {
      path = "/login";
      history.replaceState(null, "", path);
    }

    // Find matching route or fallback to 404 not found
    // find returns undified (evaluates as false) if cant find anything
    const route: Route | null =
      this.routes.find((r: Route) => r.path === path) ||
      this.routes.find((r: Route) => r.path === "/404") ||
      null;

    if (route) {
      header.updateActiveUnderline(path);

      // Load HTML template
      document.getElementById("main")!.innerHTML = await route.template();
      // Update page title
      document.title = route.title;
      // Initialize page-specific js (if any)
      route.script?.init();
      translator.apply();
    }
  }
}

export const router = new Router(routes);
