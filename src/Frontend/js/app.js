import { Router } from "./routes/router.js";
import { routes } from "./routes/routes.js";
import { authService } from "./services/authService.js";


document.addEventListener('DOMContentLoaded', () => {
    console.log("SPA init");

    
    window.router = new Router(routes);

    window.authService = authService;
    /*const logout = document.getElementById("logout");
    logout.addEventListener('click', (e) => {
        e.preventDefault();
        authService.logout();
        window.router.navigateTo('/');
    }); */
});
