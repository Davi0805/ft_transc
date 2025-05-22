import { Router } from "./routes/router.js";
import { routes } from "./routes/routes.js";



document.addEventListener('DOMContentLoaded', () => {
    console.log("SPA init");

    
    window.router = new Router(routes);

    const logout = document.getElementById("logout");
    logout.addEventListener('click', (e) => {
        e.preventDefault();
        localStorage.removeItem('authToken');
        window.router.navigateTo('/');
    });
});
