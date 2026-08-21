// Global Toast Notification System
window.showToast = (message, type = 'success') => {
    let container = document.getElementById('toast-container');
    if (!container) {
        container = document.createElement('div');
        container.id = 'toast-container';
        container.className = 'toast-container';
        document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;

    const iconClass = type === 'success' ? 'fa-solid fa-circle-check' : 'fa-solid fa-circle-exclamation';

    toast.innerHTML = `
        <i class="${iconClass} toast-icon"></i>
        <div class="toast-message">${message}</div>
    `;

    container.appendChild(toast);

    // Trigger animation
    setTimeout(() => toast.classList.add('show'), 10);

    // Remove after 3 seconds
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
    }, 3000);
};

// Bootstrap the application

document.addEventListener('DOMContentLoaded', async () => {
    // Apply saved theme
    if (localStorage.getItem('theme') === 'light') {
        document.body.classList.add('light-mode');
    }

    // Define Routes
    window.router.addRoute('/login', window.LoginView.render, false);
    
    // Fetch user if authenticated
    const token = localStorage.getItem('auth_token');
    if (token) {
        try {
            const response = await window.api.get('/auth/me');
            if (response.success) {
                window.appUser = response.data;
            } else {
                localStorage.removeItem('auth_token');
            }
        } catch (e) {
            console.error('Failed to fetch user:', e);
        }
    }

    window.router.addRoute('/', window.CustomerList.render, true);
    window.router.addRoute('/customers', window.CustomerList.render, true);
    window.router.addRoute('/customers/add', window.CustomerForm.render, true);
    window.router.addRoute('/customers/edit/:id', window.CustomerForm.render, true);
    window.router.addRoute('/customers/view/:id', window.CustomerView.render, true);
    window.router.addRoute('/ac-units', window.AcUnitList.render, true);
    window.router.addRoute('/ac-units/add', window.AcUnitForm.render, true);
    window.router.addRoute('/ac-units/edit/:id', window.AcUnitForm.render, true);
    window.router.addRoute('/ac-units/view/:id', window.AcUnitView.render, true);
    window.router.addRoute('/services', window.ServiceList.render, true);
    window.router.addRoute('/services/add', window.ServiceForm.render, true);
    window.router.addRoute('/services/edit/:id', window.ServiceForm.render, true);
    window.router.addRoute('/services/view/:id', window.ServiceView.render, true);
    window.router.addRoute('/scanner', window.QrScanner.render, true);
    window.router.addRoute('/staff', window.StaffList.render, true);
    window.router.addRoute('/staff/add', window.StaffForm.render, true);
    window.router.addRoute('/staff/view/:id', window.StaffView.render, true);
    window.router.addRoute('/staff/edit/:id', window.StaffForm.render, true);
    window.router.addRoute('/profile', window.ProfileView.render, true);
    window.router.addRoute('/user-logs', window.UserLogs.render, true);

    // Initial Route Handling
    await window.router.handleRoute();
});

// Shared Layout Template
window.renderLayout = (content) => {
    return `
        <div class="dashboard-wrapper">
            <!-- Main Content -->
            <div class="main-content" style="width: 100%; display: flex; flex-direction: column;">
                <!-- Top Header -->
                <div class="top-header" style="background-color: var(--bg-glass); border-bottom: 1px solid var(--border-glass);">
                    <a href="/customers" data-link class="header-left" style="display: flex; align-items: center; gap: 15px; text-decoration: none; cursor: pointer;">
                        <img src="/public/assets/logos/crmfavicon.png" alt="Logo" style="width: 32px; height: 32px; object-fit: contain; margin-left: 20px;">
                        <span style="font-weight: 700; font-size: 18px; color: var(--text-main); margin-right: 20px;">Maimoon Sales</span>
                    </a>
                    
                    <div class="header-nav desktop-only" style="display: flex; gap: 10px; flex-grow: 1; margin-left: 20px;">
                        <a href="/customers" data-link style="text-decoration: none; color: white; background: #2B7FFF; font-weight: 600; font-size: 14px; padding: 8px 16px; border-radius: 8px; display: flex; align-items: center; gap: 8px; transition: opacity 0.2s;" onmouseover="this.style.opacity='0.8'" onmouseout="this.style.opacity='1'">
                            <i class="fa-solid fa-users" style="color: white;"></i> Customers
                        </a>
                        <a href="/ac-units" data-link style="text-decoration: none; color: white; background: #7C5CFC; font-weight: 600; font-size: 14px; padding: 8px 16px; border-radius: 8px; display: flex; align-items: center; gap: 8px; transition: opacity 0.2s;" onmouseover="this.style.opacity='0.8'" onmouseout="this.style.opacity='1'">
                            <i class="fa-solid fa-fan" style="color: white;"></i> AC Units
                        </a>
                        <a href="/services" data-link style="text-decoration: none; color: white; background: #16B981; font-weight: 600; font-size: 14px; padding: 8px 16px; border-radius: 8px; display: flex; align-items: center; gap: 8px; transition: opacity 0.2s;" onmouseover="this.style.opacity='0.8'" onmouseout="this.style.opacity='1'">
                            <i class="fa-solid fa-clipboard-list" style="color: white;"></i> Services
                        </a>
                        <a href="/scanner" data-link style="text-decoration: none; color: white; background: #F59E0B; font-weight: 600; font-size: 14px; padding: 8px 16px; border-radius: 8px; display: flex; align-items: center; gap: 8px; transition: opacity 0.2s;" onmouseover="this.style.opacity='0.8'" onmouseout="this.style.opacity='1'">
                            <i class="fa-solid fa-qrcode" style="color: white;"></i> Scanner
                        </a>
                        ${window.appUser && window.appUser.roles && window.appUser.roles[0].name === 'admin' ? `
                        <a href="/staff" data-link style="text-decoration: none; color: white; background: #EF4444; font-weight: 600; font-size: 14px; padding: 8px 16px; border-radius: 8px; display: flex; align-items: center; gap: 8px; transition: opacity 0.2s;" onmouseover="this.style.opacity='0.8'" onmouseout="this.style.opacity='1'">
                            <i class="fa-solid fa-user-tie" style="color: white;"></i> Staff
                        </a>
                        ` : ''}
                    </div>
                    
                    <div class="header-right" style="display: flex; align-items: center; gap: 15px;">
                        <div class="profile-sec" style="display: flex; align-items: center; gap: 15px; border-left: 1px solid var(--border-glass); padding-left: 15px; height: 40px;">
                            
                            <!-- Profile Info with Dropdown -->
                            <div style="position: relative;">
                                <div id="profileDropdownBtn" style="display: flex; align-items: center; gap: 10px; cursor: pointer; margin-left: 10px; padding: 5px; border-radius: 8px;">
                                    <img src="${window.appUser && window.appUser.profile_image ? window.appUser.profile_image : `https://ui-avatars.com/api/?name=${encodeURIComponent(window.appUser ? window.appUser.name : 'Admin User')}&background=10B981&color=fff`}" alt="Profile" style="width: 36px; height: 36px; border-radius: 50%; object-fit: cover;">
                                    <div class="desktop-only">
                                        <div style="font-weight: 600; color: #0f172a; font-size: 14px;">${window.appUser ? window.appUser.name : 'Admin User'}</div>
                                    <div style="font-size: 11px; color: var(--text-muted); text-transform: capitalize;">${window.appUser && window.appUser.roles && window.appUser.roles.length > 0 ? window.appUser.roles[0].name : 'Administrator'}</div>
                                    </div>
                                    <i class="fa-solid fa-chevron-down" style="font-size: 12px; color: var(--text-muted);"></i>
                                </div>
                                
                                <!-- Dropdown Menu -->
                                <div id="profileDropdown" class="profile-dropdown">
                                    <a href="/profile" class="dropdown-item" data-link><i class="fa-regular fa-user"></i> Profile</a>
                                    <a href="/customers" class="dropdown-item desktop-only" data-link>
                                    <i class="fa-solid fa-users"></i> Customers
                                </a>
                                <a href="/ac-units" class="dropdown-item desktop-only" data-link>
                                    <i class="fa-solid fa-fan"></i> AC Units
                                </a>
                                <a href="/services" class="dropdown-item desktop-only" data-link>
                                    <i class="fa-solid fa-clipboard-list"></i> Services
                                </a>
                                <div class="dropdown-divider"></div>
                                <a href="#" id="topLogoutBtn" class="dropdown-item" style="color: #ef4444;">
                                    <i class="fa-solid fa-right-from-bracket"></i> Logout
                                </a>
                                </div> <!-- closes profileDropdown -->
                            </div> <!-- closes position: relative -->
                        </div> <!-- closes profile-sec -->
                    </div> <!-- closes header-right -->
                </div> <!-- closes top-header -->

                <!-- Dynamic Page Content -->
                <div class="content-area" style="padding: 24px;">
                    <div style="margin: 0 auto; width: 100%;">
                        ${content}
                    </div>
                </div>
                
                <!-- Footer -->
                <footer class="app-footer" style="text-align: center; padding: 16px 24px; border-top: 1px solid var(--border-glass); background: var(--bg-glass); font-size: 13px; color: var(--text-muted);">
                    &copy; ${new Date().getFullYear()} Copyright &mdash; Powered by 
                    <a href="https://www.fableadtechnolabs.com/" target="_blank" rel="noopener noreferrer" style="color: #3b82f6; font-weight: 600; text-decoration: none; transition: color 0.2s;" onmouseover="this.style.color='#2563eb'" onmouseout="this.style.color='#3b82f6'">
                       Fablead Developers Technolab
                    </a>
                </footer>

                <!-- Mobile Bottom Navigation -->
                <div class="bottom-nav">
                    <a href="/customers" data-link class="bottom-nav-item ${(window.location.pathname === '/customers' || window.location.pathname === '/') ? 'active' : ''}">
                        <i class="fa-solid fa-users"></i>
                        <span>Customers</span>
                    </a>
                    <a href="/ac-units" data-link class="bottom-nav-item ${window.location.pathname === '/ac-units' ? 'active' : ''}">
                        <i class="fa-solid fa-fan"></i>
                        <span>AC Units</span>
                    </a>
                    <a href="/scanner" data-link class="bottom-nav-item ${window.location.pathname === '/scanner' ? 'active' : ''}">
                        <i class="fa-solid fa-qrcode"></i>
                        <span>Scanner</span>
                    </a>
                    <a href="/services" data-link class="bottom-nav-item ${window.location.pathname === '/services' ? 'active' : ''}">
                        <i class="fa-solid fa-clipboard-list"></i>
                        <span>Services</span>
                    </a>
                    ${window.appUser && window.appUser.roles && window.appUser.roles[0].name === 'admin' ? `
                    <a href="/staff" data-link class="bottom-nav-item ${window.location.pathname === '/staff' ? 'active' : ''}">
                        <i class="fa-solid fa-user-tie"></i>
                        <span>Staff</span>
                    </a>
                    ` : ''}

                </div>
            </div>
        </div>
    `;
};

// Global // Global Click Interceptor for SPA navigation
document.addEventListener('click', async (e) => {
    // Handle Profile Dropdown Toggle
    const profileBtn = e.target.closest('#profileDropdownBtn');
    const dropdown = document.getElementById('profileDropdown');

    if (profileBtn && dropdown) {
        dropdown.classList.toggle('show');
    } else if (dropdown && !e.target.closest('#profileDropdown')) {
        dropdown.classList.remove('show');
    }

    // Handle Theme Toggle
    const themeToggleBtn = e.target.closest('#themeToggle');
    if (themeToggleBtn) {
        const body = document.body;
        body.classList.toggle('light-mode');
        const isLight = body.classList.contains('light-mode');
        localStorage.setItem('theme', isLight ? 'light' : 'dark');

        const icon = document.getElementById('themeIcon');
        if (icon) {
            icon.className = isLight ? 'fa-solid fa-sun' : 'fa-regular fa-moon';
        }
        return;
    }

    // Intercept clicks on links with data-link attribute
    if (e.target.matches('[data-link]') || e.target.closest('a[data-link]')) {
        e.preventDefault();
        const link = e.target.matches('[data-link]') ? e.target : e.target.closest('a[data-link]');
        window.router.navigate(link.getAttribute('href'));
        return;
    }

    // Handle Logout
    if (e.target && (e.target.id === 'topLogoutBtn' || e.target.closest('#topLogoutBtn') || e.target.id === 'logoutBtn' || e.target.closest('#logoutBtn'))) {
        e.preventDefault();
        try {
            await window.api.post('/auth/logout', {});
        } catch (err) { } // ignore if auth controller is missing
        localStorage.removeItem('auth_token');
        window.router.navigate('/login');
    }
});
