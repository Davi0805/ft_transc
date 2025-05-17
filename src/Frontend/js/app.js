import { Router } from "./routes/router.js";
import { routes } from "./routes/routes.js";

document.addEventListener('DOMContentLoaded', () => {
    console.log("SPA init");

    new Router(routes);
});