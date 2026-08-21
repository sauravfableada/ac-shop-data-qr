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
    window.router.addRoute('/notifications', window.NotificationList.render, true);

    // Initial Route Handling
    await window.router.handleRoute();
});

// --- Notification Read State Helpers ---
// No longer using localStorage, relying on backend.

window.addNotification = () => {
    window.loadNotifications();
};

window.markOneNotificationRead = async (id) => {
    try {
        await window.api.post(`/notifications/${id}/read`);
        window.loadNotifications();
    } catch (e) {}
};

window.markAllNotificationsRead = async () => {
    try {
        await window.api.post('/notifications/read-all');
        window.loadNotifications();
    } catch (e) {}
};

window.loadNotifications = async () => {
    try {
        const response = await window.api.get('/notifications');
        if (!response.success) return;

        const notifs = response.data.notifications || [];
        const unreadCount = response.data.unread_count || 0;

        const notifications = notifs.map(n => {
            const data = n.data || {};
            return {
                id: n.id,
                title: 'New Notification',
                message: data.message || 'You have a new notification',
                time: new Date(n.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                type: data.type || 'general',
                unread: n.read_at === null,
                url: data.url || '#'
            };
        });

        const badge = document.getElementById('notificationBadge');
        if (badge) {
            if (unreadCount > 0) {
                badge.innerText = unreadCount;
                badge.style.display = 'flex';
            } else {
                badge.style.display = 'none';
            }
        }

        // Only show UNREAD in the dropdown
        const unreadNotifications = notifications.filter(n => n.unread);

        const listContainer = document.getElementById('notificationList');
        if (listContainer) {
            if (unreadNotifications.length === 0) {
                listContainer.innerHTML = `
                    <div style="padding: 24px; text-align: center; color: var(--text-muted); font-size: 13px;">
                        <i class="fa-solid fa-circle-check" style="font-size: 28px; margin-bottom: 8px; display: block; color: #10b981;"></i>
                        <div style="font-weight: 600; margin-bottom: 4px;">All caught up!</div>
                        No new unread notifications
                    </div>
                `;
            } else {
                listContainer.innerHTML = unreadNotifications.map(n => {
                    let icon = 'fa-info-circle', iconColor = '#3b82f6', bgLight = '#eff6ff';
                    if (n.type === 'staff')        { icon = 'fa-user-tie';       iconColor = '#ef4444'; bgLight = '#fef2f2'; }
                    else if (n.type === 'customer') { icon = 'fa-users';          iconColor = '#3b82f6'; bgLight = '#eff6ff'; }
                    else if (n.type === 'ac_unit' || n.type === 'ac-unit')  { icon = 'fa-snowflake';      iconColor = '#8b5cf6'; bgLight = '#f5f3ff'; }
                    else if (n.type === 'service_record' || n.type === 'service')  { icon = 'fa-clipboard-list'; iconColor = '#10b981'; bgLight = '#ecfdf5'; }

                    return `
                        <div style="padding: 12px 16px; border-bottom: 1px solid var(--border-glass); display: flex; gap: 10px; background: #f0f9ff; position: relative; align-items: flex-start;">
                            <div style="position: absolute; left: 0; top: 0; bottom: 0; width: 3px; background: #3b82f6; border-radius: 0 2px 2px 0;"></div>
                            <div style="width: 32px; height: 32px; border-radius: 50%; background: ${bgLight}; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
                                <i class="fa-solid ${icon}" style="color: ${iconColor}; font-size: 14px;"></i>
                            </div>
                            <div style="flex-grow: 1; min-width: 0;">
                                <div style="display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 2px;">
                                    <span style="font-weight: 600; font-size: 13px; color: #0f172a; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; padding-right: 8px;">${n.title}</span>
                                    <span style="font-size: 10px; color: var(--text-muted); flex-shrink: 0;">${n.time}</span>
                                </div>
                                <div style="font-size: 12px; color: var(--text-muted); line-height: 1.4; word-break: break-word; margin-bottom: 6px;">${n.message}</div>
                                <button type="button" class="notif-read-btn"
                                    data-id="${n.id}"
                                    style="font-size: 11px; font-weight: 600; color: #3b82f6; background: transparent; border: 1px solid #3b82f6; border-radius: 20px; padding: 2px 10px; cursor: pointer; transition: all 0.15s;"
                                    onmouseover="this.style.background='#3b82f6';this.style.color='white';"
                                    onmouseout="this.style.background='transparent';this.style.color='#3b82f6';"
                                >
                                    <i class="fa-solid fa-check" style="margin-right:3px;"></i> Mark read
                                </button>
                            </div>
                        </div>
                    `;
                }).join('');

                // Attach click handlers to per-item read buttons
                listContainer.querySelectorAll('.notif-read-btn').forEach(btn => {
                    btn.addEventListener('click', (e) => {
                        e.stopPropagation();
                        window.markOneNotificationRead(btn.dataset.id);
                    });
                });
            }
        }
    } catch (e) {
        console.error('Failed to load notifications', e);
    }
};

// Shared Layout Template
window.renderLayout = (content) => {
    setTimeout(() => {
        if (typeof window.loadNotifications === 'function') {
            window.loadNotifications();
        }
    }, 50);
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
                        <!-- Notification Bell with Dropdown -->
                        <div style="position: relative;">
                            <div id="notificationBellBtn" style="position: relative; cursor: pointer; display: flex; align-items: center; justify-content: center; width: 36px; height: 36px; border-radius: 50%; background: #f1f5f9; transition: background 0.2s;" onmouseover="this.style.background='#e2e8f0'" onmouseout="this.style.background='#f1f5f9'">
                                <i class="fa-regular fa-bell" style="font-size: 18px; color: #475569;"></i>
                                <span id="notificationBadge" style="position: absolute; top: -2px; right: -2px; background: #ef4444; color: white; font-size: 9px; font-weight: bold; width: 16px; height: 16px; border-radius: 50%; display: none; align-items: center; justify-content: center; border: 2px solid #fff;">0</span>
                            </div>
                            
                            <!-- Notification Dropdown Menu -->
                            <div id="notificationDropdown" class="profile-dropdown" style="width: 320px; right: 0; top: 45px; padding: 0; overflow: hidden; border-radius: 12px; box-shadow: 0 10px 25px rgba(0,0,0,0.1);">
                                <div style="padding: 12px 16px; border-bottom: 1px solid var(--border-glass); display: flex; justify-content: space-between; align-items: center; background: #f8fafc;">
                                    <span style="font-weight: 700; font-size: 14px; color: #0f172a;">Notifications</span>
                                    <span id="markAllReadBtn" style="font-size: 12px; color: #3b82f6; cursor: pointer; font-weight: 600;">Mark all as read</span>
                                </div>
                                <div id="notificationList" style="max-height: 280px; overflow-y: auto;">
                                    <div style="padding: 24px; text-align: center; color: var(--text-muted); font-size: 13px;">
                                        <i class="fa-regular fa-bell-slash" style="font-size: 24px; margin-bottom: 8px; display: block; color: #94a3b8;"></i> No notifications yet
                                    </div>
                                </div>
                                <div style="padding: 10px 16px; border-top: 1px solid var(--border-glass); background: #f8fafc; text-align: center;">
                                    <a href="/notifications" data-link style="font-size: 13px; font-weight: 600; color: #3b82f6; text-decoration: none;">
                                        <i class="fa-solid fa-arrow-right" style="margin-right: 4px;"></i> View all notifications
                                    </a>
                                </div>
                            </div>
                        </div>

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
                    <a href="/notifications" data-link class="bottom-nav-item ${window.location.pathname === '/notifications' ? 'active' : ''}">
                        <i class="fa-regular fa-bell"></i>
                        <span>Alerts</span>
                    </a>

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
        const notifDropdown = document.getElementById('notificationDropdown');
        if (notifDropdown) notifDropdown.classList.remove('show');
    } else if (dropdown && !e.target.closest('#profileDropdown')) {
        dropdown.classList.remove('show');
    }

    // Handle Notification Dropdown Toggle
    const notifBtn = e.target.closest('#notificationBellBtn');
    const notifDropdown = document.getElementById('notificationDropdown');

    if (notifBtn && notifDropdown) {
        notifDropdown.classList.toggle('show');
        const profileDropdown = document.getElementById('profileDropdown');
        if (profileDropdown) profileDropdown.classList.remove('show');
    } else if (notifDropdown && !e.target.closest('#notificationDropdown')) {
        notifDropdown.classList.remove('show');
    }

    // Handle Mark All as Read (stop propagation so dropdown stays open)
    const markReadBtn = e.target.closest('#markAllReadBtn');
    if (markReadBtn) {
        e.stopPropagation();
        await window.markAllNotificationsRead();
        window.showToast('All notifications marked as read', 'success');
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
