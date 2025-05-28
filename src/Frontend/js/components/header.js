import { authService } from "../services/authService.js";

export const header = {
    logOutEventListener() {
        const logout = document.getElementById("logout");
        logout.addEventListener('click', (e) => {
            e.preventDefault();
            authService.logout();
            console.log("DEBUG: LOGOUT!");
            window.router.navigateTo('/');
        });
    },

    updateActiveUnderline(path) {
        const curActive = document.querySelector('a.nav-link.active');
        const newActive = document.querySelector(`a.nav-link[href='${path}']`);

        if (curActive && newActive && curActive !== newActive) {
            curActive.classList.remove('active');
            newActive.classList.add('active');
        }
    }
}