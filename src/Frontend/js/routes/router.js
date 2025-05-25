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
            const link = e.target.closest('a[data-link]'); // Verifica se o clique foi em um <a> com data-link
            if (link) {
                e.preventDefault(); // Previne o comportamento padrão do navegador
                const href = link.getAttribute('href'); // Obtém o valor do href
                this.navigateTo(href); // Navega para a rota usando o router
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