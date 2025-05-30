import { getSelfData } from "../api/getSelfDataAPI.js";

export class AuthService {
    constructor() {
        this.protectedRoutes = ['/play', '/profile']
        this.init();
    }

    init() {
        this.authToken = localStorage.getItem('authToken');
        this.isAuthenticated = !!this.authToken;
    }

    login(token) {
        this.authToken = token;
        this.isAuthenticated = true;
        localStorage.setItem('authToken', token);
        this.updateHeaderVisibility(); // todo 
    }

    logout() {
        this.authToken = null;
        this.isAuthenticated = false;
        localStorage.removeItem('authToken');
        this.updateHeaderVisibility(); // todo
    }

    getToken() {
        return this.authToken;
    }

    isUserAuthenticated() {
        return this.isAuthenticated;
    }

    async updateHeaderVisibility() {
        const loggedOut = document.getElementById('log-reg');
        const loggedIn = document.getElementById('user-in');
        const headerNick = document.getElementById('profile-link');


        const showLoggedOutVersion = () => {
            loggedIn.style.display = 'none';
            loggedOut.style.display = 'flex';
        };

        const showLoggedInVersion = (nickname) => {
            loggedOut.style.display = 'none';
            loggedIn.style.display = 'flex';
            headerNick.textContent = nickname;
        };

        if (!this.isAuthenticated) {
            showLoggedOutVersion();
            return;
        }

        try {
            const userData = await getSelfData();
            showLoggedInVersion(userData.nickname);           

    
            } catch (error) {
                this.authToken = null;
                this.isAuthenticated = false;

            }
    }

    canAccessRoute(routePath) {
        if (this.protectedRoutes.includes(routePath)) {
            return this.isAuthenticated;
        }
        return true;
    }

    handleProtectedRoute(routePath) {
        if (!this.canAccessRoute(routePath)) {
            sessionStorage.setItem('redirectAfterLogin', routePath);
            return '/login';
        }
        return routePath;
    }

    getRedirectAfterLogin() {
        const redirect = sessionStorage.getItem('redirectAfterLogin');

        if (redirect) {
            sessionStorage.removeItem('redirectAfterLogin');
            return redirect;
        }
        return '/';
    }
}

export const authService = new AuthService();