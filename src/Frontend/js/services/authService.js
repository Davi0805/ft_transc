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
        const loginElement = document.getElementById('login');
        const registerElement = document.getElementById('sign-up');
        const accountElement = document.getElementById('account');

        console.log(`UHV called and the user token is = ${localStorage.getItem('authToken')} and the user is authenticated? ${this.isAuthenticated}`)

        if (this.isAuthenticated) {
            if (loginElement) loginElement.style.display = 'none';
            if (registerElement) registerElement.style.display = 'none';
            if (accountElement) accountElement.style.display = 'block';
        }
        else {
            if (loginElement) loginElement.style.display = 'block';
            if (registerElement) registerElement.style.display = 'block';
            if (accountElement) accountElement.style.display = 'none';           
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