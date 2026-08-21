window.NotificationsView = {
    render: async (container) => {

        const getTypeInfo = (module) => {
            if (!module) return { icon: 'fa-info-circle', color: '#3b82f6', bg: '#eff6ff', label: 'General' };
            const mod = module.toLowerCase();
            if (mod === 'staff')    return { icon: 'fa-user-tie',       color: '#ef4444', bg: '#fef2f2', label: 'Staff' };
            if (mod === 'customer') return { icon: 'fa-users',          color: '#3b82f6', bg: '#eff6ff', label: 'Customer' };
            if (mod === 'ac-unit' || mod === 'ac') return { icon: 'fa-snowflake', color: '#8b5cf6', bg: '#f5f3ff', label: 'AC Unit' };
            if (mod === 'service')  return { icon: 'fa-clipboard-list', color: '#10b981', bg: '#ecfdf5', label: 'Service' };
            return { icon: 'fa-info-circle', color: '#3b82f6', bg: '#eff6ff', label: module };
        };

        const getActionBadge = (action) => {
            if (!action) return '#64748b';
            const a = action.toUpperCase();
            if (a === 'CREATE' || a === 'ADD')    return '#10b981';
            if (a === 'UPDATE')                    return '#f59e0b';
            if (a === 'DELETE')                    return '#ef4444';
            return '#64748b';
        };

        let allLogs = [];
        let filter = 'all';

        const fetchLogs = async () => {
            const response = await window.api.get('/user-logs');
            return response.success ? (response.data || []) : [];
        };

        const renderLogs = (logs) => {
            if (!logs.length) {
                return `
                    <div style="padding: 60px 24px; text-align: center; color: var(--text-muted);">
                        <i class="fa-regular fa-bell-slash" style="font-size: 48px; margin-bottom: 16px; display: block; color: #94a3b8;"></i>
                        <div style="font-size: 16px; font-weight: 600; margin-bottom: 8px;">No notifications yet</div>
                        <div style="font-size: 14px;">Activity from Staff, Customers, AC Units & Services will appear here.</div>
                    </div>`;
            }

            const readIds = JSON.parse(localStorage.getItem('read_log_ids') || '[]');

            return logs.map(log => {
                const ti = getTypeInfo(log.module);
                const badgeColor = getActionBadge(log.action);
                const userName = log.user ? log.user.name : 'System';
                const isUnread = !readIds.includes(log.id);
                const created = new Date(log.created_at).toLocaleString('en-GB', {
                    day: '2-digit', month: 'short', year: 'numeric',
                    hour: '2-digit', minute: '2-digit', hour12: true
                });

                return `
                    <div class="notif-row ${isUnread ? 'notif-unread' : ''}" style="
                        display: flex; align-items: flex-start; gap: 16px;
                        padding: 16px 20px;
                        border-bottom: 1px solid var(--border-glass);
                        background: ${isUnread ? 'rgba(59,130,246,0.04)' : 'transparent'};
                        transition: background 0.2s;
                        position: relative;
                    ">
                        ${isUnread ? `<div style="position:absolute;left:0;top:0;bottom:0;width:3px;background:#3b82f6;border-radius:0 2px 2px 0;"></div>` : ''}
                        <div style="
                            width: 42px; height: 42px; border-radius: 50%;
                            background: ${ti.bg}; display: flex; align-items: center;
                            justify-content: center; flex-shrink: 0; margin-top: 2px;
                        ">
                            <i class="fa-solid ${ti.icon}" style="color: ${ti.color}; font-size: 16px;"></i>
                        </div>
                        <div style="flex: 1; min-width: 0;">
                            <div style="display: flex; align-items: center; gap: 8px; flex-wrap: wrap; margin-bottom: 4px;">
                                <span style="
                                    background: ${ti.bg}; color: ${ti.color};
                                    padding: 2px 10px; border-radius: 20px;
                                    font-size: 11px; font-weight: 700; text-transform: uppercase;
                                ">${ti.label}</span>
                                <span style="
                                    background: ${badgeColor}22; color: ${badgeColor};
                                    padding: 2px 10px; border-radius: 20px;
                                    font-size: 11px; font-weight: 700; text-transform: uppercase;
                                ">${log.action}</span>
                                ${isUnread ? `<span style="
                                    background: #3b82f6; color: white;
                                    padding: 2px 8px; border-radius: 20px;
                                    font-size: 10px; font-weight: 700;
                                ">NEW</span>` : ''}
                            </div>
                            <div style="font-size: 14px; color: var(--text-main); margin-bottom: 4px; font-weight: 500;">${log.message}</div>
                            <div style="font-size: 12px; color: var(--text-muted); display: flex; align-items: center; gap: 6px; flex-wrap: wrap;">
                                <i class="fa-regular fa-user" style="font-size: 11px;"></i>
                                <span>${userName}</span>
                                <span style="opacity:0.4;">•</span>
                                <i class="fa-regular fa-clock" style="font-size: 11px;"></i>
                                <span>${created}</span>
                                ${isUnread ? `
                                <span style="opacity:0.4; margin-left:4px;">•</span>
                                <button
                                    class="page-notif-read-btn"
                                    data-id="${log.id}"
                                    style="font-size: 11px; font-weight: 600; color: #3b82f6; background: transparent; border: 1px solid #3b82f6; border-radius: 20px; padding: 1px 10px; cursor: pointer; transition: all 0.15s; line-height: 1.6;"
                                    onmouseover="this.style.background='#3b82f6';this.style.color='white';"
                                    onmouseout="this.style.background='transparent';this.style.color='#3b82f6';"
                                >
                                    <i class="fa-solid fa-check" style="margin-right:3px;"></i> Mark read
                                </button>` : `<span style="opacity:0.4; margin-left:4px;">•</span><span style="font-size:11px;color:#10b981;font-weight:600;"><i class="fa-solid fa-check"></i> Read</span>`}
                            </div>
                        </div>
                    </div>`;
            }).join('');
        };

        const getFiltered = () => {
            if (filter === 'all') return allLogs;
            return allLogs.filter(l => {
                if (!l.module) return false;
                const mod = l.module.toLowerCase();
                if (filter === 'ac-unit') return mod === 'ac-unit' || mod === 'ac';
                return mod === filter;
            });
        };

        allLogs = await fetchLogs();

        const unreadCount = allLogs.filter(l => l.id > parseInt(localStorage.getItem('last_read_log_id') || '0')).length;

        const filterBtns = [
            { key: 'all',      label: 'All',       icon: 'fa-list' },
            { key: 'staff',    label: 'Staff',     icon: 'fa-user-tie' },
            { key: 'customer', label: 'Customer',  icon: 'fa-users' },
            { key: 'ac-unit',  label: 'AC Unit',   icon: 'fa-snowflake' },
            { key: 'service',  label: 'Service',   icon: 'fa-clipboard-list' },
        ];

        const content = `
            <div>
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; flex-wrap: wrap; gap: 12px;">
                    <div>
                        <h1 style="font-size: 24px; font-weight: 700; margin-bottom: 4px;">Notifications</h1>
                        <p style="color: var(--text-muted); font-size: 14px;">All activity across Staff, Customers, AC Units & Services.</p>
                    </div>
                    <div style="display: flex; gap: 10px; align-items: center;">
                        ${unreadCount > 0 ? `<span style="background: #3b82f6; color: white; padding: 4px 12px; border-radius: 20px; font-size: 13px; font-weight: 600;">${unreadCount} Unread</span>` : ''}
                        <button id="markAllReadPageBtn" style="
                            padding: 8px 18px; background: var(--bg-glass); color: var(--text-main);
                            border: 1px solid var(--border-glass); border-radius: 8px;
                            cursor: pointer; font-size: 14px; font-weight: 600;
                            display: flex; align-items: center; gap: 8px;
                            transition: background 0.2s;
                        ">
                            <i class="fa-solid fa-check-double"></i> Mark all as read
                        </button>
                    </div>
                </div>

                <!-- Filter Bar -->
                <div style="display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 20px;">
                    ${filterBtns.map(f => `
                        <button class="notif-filter-btn" data-filter="${f.key}" style="
                            padding: 7px 16px; border-radius: 8px; border: 1px solid var(--border-glass);
                            background: ${filter === f.key ? '#3b82f6' : 'var(--bg-glass)'};
                            color: ${filter === f.key ? 'white' : 'var(--text-main)'};
                            cursor: pointer; font-size: 13px; font-weight: 600;
                            display: flex; align-items: center; gap: 6px;
                            transition: all 0.2s;
                        ">
                            <i class="fa-solid ${f.icon}" style="font-size: 12px;"></i> ${f.label}
                        </button>
                    `).join('')}
                </div>

                <!-- Notifications List -->
                <div class="glass-panel" style="padding: 0; overflow: hidden;">
                    <div id="notifPageList">
                        ${renderLogs(getFiltered())}
                    </div>
                </div>
            </div>
        `;

        container.innerHTML = window.renderLayout(content);

        // Filter buttons
        const attachReadBtns = () => {
            document.querySelectorAll('.page-notif-read-btn').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    window.markOneNotificationRead(parseInt(btn.dataset.id));
                    // Re-render this page list too
                    document.getElementById('notifPageList').innerHTML = renderLogs(getFiltered());
                    attachReadBtns();
                });
            });
        };

        container.querySelectorAll('.notif-filter-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                filter = btn.dataset.filter;
                container.querySelectorAll('.notif-filter-btn').forEach(b => {
                    const isActive = b.dataset.filter === filter;
                    b.style.background = isActive ? '#3b82f6' : 'var(--bg-glass)';
                    b.style.color = isActive ? 'white' : 'var(--text-main)';
                    b.style.borderColor = isActive ? '#3b82f6' : 'var(--border-glass)';
                });
                document.getElementById('notifPageList').innerHTML = renderLogs(getFiltered());
                attachReadBtns();
            });
        });

        attachReadBtns();

        // Mark all as read
        const markBtn = document.getElementById('markAllReadPageBtn');
        if (markBtn) {
            markBtn.addEventListener('click', async () => {
                await window.markAllNotificationsRead();
                // Re-render with all read
                document.getElementById('notifPageList').innerHTML = renderLogs(getFiltered());
                attachReadBtns();
                window.showToast('All notifications marked as read', 'success');
            });
        }
    }
};
