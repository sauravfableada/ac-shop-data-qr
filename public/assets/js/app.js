// Bootstrap the application

document.addEventListener('DOMContentLoaded', async () => {
    
    // Define Routes
    window.router.addRoute('/login', window.LoginView.render, false);
    window.router.addRoute('/', window.AdminDashboard.render, true);
    window.router.addRoute('/customers', window.CustomerList.render, true);
    window.router.addRoute('/ac-units', window.AcUnitList.render, true);
    window.router.addRoute('/services', window.ServiceList.render, true);
    window.router.addRoute('/scanner', window.QrScanner.render, true);

    // Initial Route Handling
    await window.router.handleRoute();
});

// Shared Layout Template
window.renderLayout = (content) => {
    return `
        <div class="dashboard-layout">
            <aside class="sidebar">
                <h2 class="gradient-text" style="margin-bottom: 40px; font-size: 24px;">AC Service Pro</h2>
                <nav>
                    <a href="#/" class="nav-link">Dashboard</a>
                    <a href="#/customers" class="nav-link">Customers</a>
                    <a href="#/ac-units" class="nav-link">AC Units</a>
                    <a href="#/services" class="nav-link">Services</a>
                </nav>
                <div style="margin-top: auto;">
                    <button id="logoutBtn" class="btn btn-primary" style="width: 100%; background: rgba(255,255,255,0.1); box-shadow: none;">Logout</button>
                </div>
            </aside>
            <main class="main-content">
                ${content}
            </main>
        </div>
    `;
};

// Global Logout Handler
document.addEventListener('click', async (e) => {
    if (e.target && e.target.id === 'logoutBtn') {
        await window.api.post('/auth/logout', {});
        localStorage.removeItem('auth_token');
        window.router.navigate('/login');
    }
});
