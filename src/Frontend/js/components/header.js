import { authService } from "../services/authService.js";

export function logOutEventListener() {
    const logout = document.getElementById("logout");
    logout.addEventListener('click', (e) => {
        e.preventDefault();
        authService.logout();
        console.log("DEBUG: LOGOUT!");
        window.router.navigateTo('/');
    });
}