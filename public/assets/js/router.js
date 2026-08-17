class Router {
    constructor() {
        this.routes = {};
        this.appContainer = document.getElementById('app');
        
        // Listen to history changes
        window.addEventListener('popstate', () => this.handleRoute());
    }

    addRoute(path, renderFunction, requireAuth = true) {
        this.routes[path] = { renderFunction, requireAuth };
    }

    async handleRoute() {
        let path = window.location.pathname || '/';
        
        // Match route
        const route = this.routes[path];
        
        if (!route) {
            this.appContainer.innerHTML = `<div class="auth-layout"><div class="glass-card p-8"><h1>404 Not Found</h1></div></div>`;
            return;
        }

        // Auth check
        const isAuthenticated = !!localStorage.getItem('auth_token');
        
        if (route.requireAuth && !isAuthenticated) {
            this.navigate('/login');
            return;
        }

        if (path === '/login' && isAuthenticated) {
            this.navigate('/');
            return;
        }

        // Render loading state
        this.appContainer.innerHTML = `<div class="glass-loader"><div class="spinner"></div></div>`;

        // Render view
        try {
            await route.renderFunction(this.appContainer);
        } catch (error) {
            console.error('Render error:', error);
            this.appContainer.innerHTML = `<div class="auth-layout"><div class="glass-card p-8 text-red-500">Error loading view</div></div>`;
        }
    }

    navigate(path) {
        window.history.pushState(null, '', path);
        this.handleRoute();
    }
}

// Global instance
window.router = new Router();
