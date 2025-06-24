import { Router } from "./routes/router.js";
import { routes } from "./routes/routes.js";
import { authService } from "./services/authService.js";
import { header } from "./components/header.js"

document.addEventListener('DOMContentLoaded', async () => {
    
    header.init();
    window.authService = authService;
    await window.authService.init();

    
    window.router = new Router(routes);

});
