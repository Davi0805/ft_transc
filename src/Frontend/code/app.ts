import { Router } from "./routes/router.js";
import { Route, routes } from "./routes/routes";
import { authService } from "./services/authService.js";

document.addEventListener('DOMContentLoaded', async () => {

    await authService.init();
    const router: Router = new Router(routes);
});
