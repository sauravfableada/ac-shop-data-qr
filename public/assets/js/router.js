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
        
        let route = this.routes[path];
        let params = {};
        
        if (!route) {
            // Check dynamic routes
            for (const key in this.routes) {
                if (key.includes(':')) {
                    const regex = new RegExp('^' + key.replace(/:\w+/g, '([\\w-]+)') + '$');
                    const match = path.match(regex);
                    if (match) {
                        route = this.routes[key];
                        const paramNames = key.match(/:\w+/g).map(n => n.substring(1));
                        paramNames.forEach((name, i) => {
                            params[name] = match[i+1];
                        });
                        break;
                    }
                }
            }
        }
        
        if (!route) {
            this.appContainer.innerHTML = `<div class="auth-layout"><div class="glass-card" style="padding: 32px; text-align: center;"><h1>404 Not Found</h1></div></div>`;
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
            await route.renderFunction(this.appContainer, params);
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
