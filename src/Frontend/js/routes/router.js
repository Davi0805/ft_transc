export class Router {
    constructor(routes) {
        this.routes = routes; // store route configurations
        this.initRouter(); // Initialize router logic
    }

    initRouter() {
        // Handle manual URL changes (on back/forward buttons)
        window.addEventListener('popstate', () => {
            this.loadRoute();
        });
        
        // Intercept < data-link> clicks and handle manually the navigation
        document.addEventListener('click', (e) => {
            if (e.target.matches('[data-link]')) {
                e.preventDefault(); // dont let browser do anything
                this.navigateTo(e.target.href); // Using our own navigation
            }
        });
    
        this.loadRoute();
    }

    navigateTo(url) {
        // Update our browser history without reload
        // state, title, url
        history.pushState(null, null, url);
        // Load the new route
        this.loadRoute();
    }

    async loadRoute() {
        // Get current path
        const path =  window.location.pathname;

        // Find matching route or fallback to 404 not found
        // find returns undified (evaluates as false) if cant find anything 
        const route = this.routes.find(r => r.path === path) || this.routes.find(r => r.path === '/404');

        if (route) {
            // Load HTML template
            document.getElementById('main').innerHTML = await route.template();
            // Update page title
            document.title = route.title;
            // Initialize page-specific js (if any)
            if (route.script) 
                route.script.init();
        }
    }
}