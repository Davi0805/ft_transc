import { Router } from "./routes/router.js";
import { routes } from "./routes/routes.js";
import { authService } from "./services/authService.js";
import { header } from "./components/header.js"

document.addEventListener('DOMContentLoaded', () => {
    
    window.router = new Router(routes);
    window.authService = authService;

    header.init();
});
