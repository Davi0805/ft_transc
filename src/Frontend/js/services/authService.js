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

    updateHeaderVisibility() {
        const loginRegister = document.getElementById('log-reg');
        const userLoggedIn = document.getElementById('user-in');

        console.log(`UHV called and the user token is = ${localStorage.getItem('authToken')} and the user is authenticated? ${this.isAuthenticated}`)

        if (this.isAuthenticated) {
            loginRegister.style.display = 'none';
            userLoggedIn.style.display = 'flex';
        }
        else {
            loginRegister.style.display = 'flex';
            userLoggedIn.style.display = 'none';
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