window.NotificationList = {
    render: async (container) => {
        container.innerHTML = window.renderLayout(`
            <div class="glass-panel" style="padding: 24px; min-height: 80vh;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px;">
                    <h2 style="font-size: 24px; font-weight: 700; color: var(--text-main);">Notifications</h2>
                    <button id="nlMarkAllReadBtn" style="padding: 8px 16px; border-radius: 8px; border: 1px solid #3b82f6; background: transparent; color: #3b82f6; font-weight: 600; cursor: pointer; display: flex; align-items: center; gap: 8px;">
                        <i class="fa-solid fa-check-double"></i> Mark all as read
                    </button>
                </div>
                
                <div id="nlLoader" style="display: flex; justify-content: center; padding: 40px;">
                    <div class="spinner"></div>
                </div>
                
                <div id="nlContent" style="display: none; flex-direction: column; gap: 12px;">
                    <!-- Notifications will be loaded here -->
                </div>
                
                <div id="nlPagination" style="margin-top: 24px; display: flex; justify-content: space-between; align-items: center;"></div>
            </div>
        `);

        let currentPage = 1;

        const loadPage = async (page) => {
            const loader = document.getElementById('nlLoader');
            const content = document.getElementById('nlContent');
            const pagination = document.getElementById('nlPagination');
            
            if (loader) loader.style.display = 'flex';
            if (content) content.style.display = 'none';

            try {
                const response = await window.api.get('/notifications?page=' + page);
                if (response.success) {
                    const data = response.data;
                    const notifs = data.notifications || [];
                    const meta = data.meta;
                    
                    if (notifs.length === 0) {
                        content.innerHTML = `
                            <div style="padding: 40px; text-align: center; color: var(--text-muted); background: var(--bg-glass); border-radius: 12px;">
                                <i class="fa-regular fa-bell-slash" style="font-size: 48px; margin-bottom: 16px; display: block; color: #94a3b8;"></i>
                                <div style="font-size: 16px; font-weight: 600;">No notifications found</div>
                            </div>
                        `;
                    } else {
                        content.innerHTML = notifs.map(n => {
                            const d = n.data || {};
                            const isUnread = n.read_at === null;
                            const time = new Date(n.created_at).toLocaleString();
                            let icon = 'fa-info-circle', iconColor = '#3b82f6', bgLight = '#eff6ff';
                            if (d.type === 'staff') { icon = 'fa-user-tie'; iconColor = '#ef4444'; bgLight = '#fef2f2'; }
                            else if (d.type === 'customer') { icon = 'fa-users'; iconColor = '#3b82f6'; bgLight = '#eff6ff'; }
                            else if (d.type === 'ac_unit' || d.type === 'ac-unit') { icon = 'fa-snowflake'; iconColor = '#8b5cf6'; bgLight = '#f5f3ff'; }
                            else if (d.type === 'service_record' || d.type === 'service') { icon = 'fa-clipboard-list'; iconColor = '#10b981'; bgLight = '#ecfdf5'; }

                            return `
                                <div style="padding: 16px; border-radius: 12px; border: 1px solid var(--border-glass); background: ${isUnread ? '#f0f9ff' : 'var(--bg-glass)'}; display: flex; gap: 16px; position: relative;">
                                    ${isUnread ? `<div style="position: absolute; left: 0; top: 12px; bottom: 12px; width: 4px; background: #3b82f6; border-radius: 0 4px 4px 0;"></div>` : ''}
                                    <div style="width: 48px; height: 48px; border-radius: 50%; background: ${bgLight}; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
                                        <i class="fa-solid ${icon}" style="color: ${iconColor}; font-size: 20px;"></i>
                                    </div>
                                    <div style="flex-grow: 1;">
                                        <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                                            <div style="font-weight: 600; color: var(--text-main); font-size: 15px;">New Notification</div>
                                            <div style="font-size: 12px; color: var(--text-muted);">${time}</div>
                                        </div>
                                        <div style="color: var(--text-muted); font-size: 14px; margin-bottom: 12px;">${d.message || 'You have a new notification.'}</div>
                                        <div style="display: flex; gap: 12px;">
                                            ${d.url && d.url !== '#' ? `<a href="${d.url}" data-link style="padding: 6px 16px; border-radius: 6px; background: #3b82f6; color: white; text-decoration: none; font-size: 13px; font-weight: 600;">View Details</a>` : ''}
                                            ${isUnread ? `<button type="button" class="nl-read-btn" data-id="${n.id}" style="padding: 6px 16px; border-radius: 6px; background: transparent; border: 1px solid #3b82f6; color: #3b82f6; cursor: pointer; font-size: 13px; font-weight: 600;"><i class="fa-solid fa-check" style="margin-right: 6px;"></i> Mark as read</button>` : ''}
                                        </div>
                                    </div>
                                </div>
                            `;
                        }).join('');

                        // Attach handlers for individual read buttons
                        content.querySelectorAll('.nl-read-btn').forEach(btn => {
                            btn.addEventListener('click', async (e) => {
                                e.stopPropagation();
                                const id = btn.dataset.id;
                                try {
                                    await window.api.post('/notifications/' + id + '/read');
                                    window.loadNotifications(); // Update bell
                                    loadPage(currentPage); // Refresh list
                                } catch (err) {}
                            });
                        });
                    }

                    // Pagination
                    if (meta.total > meta.per_page) {
                        pagination.innerHTML = `
                            <div style="color: var(--text-muted); font-size: 14px;">Showing ${meta.current_page} of ${Math.ceil(meta.total/meta.per_page)}</div>
                            <div style="display: flex; gap: 8px;">
                                <button type="button" id="nlPrevBtn" ${meta.current_page === 1 ? 'disabled' : ''} style="padding: 8px 16px; border-radius: 8px; border: 1px solid var(--border-glass); background: ${meta.current_page === 1 ? 'transparent' : 'var(--bg-glass)'}; color: var(--text-main); cursor: ${meta.current_page === 1 ? 'not-allowed' : 'pointer'}; opacity: ${meta.current_page === 1 ? '0.5' : '1'};">Previous</button>
                                <button type="button" id="nlNextBtn" ${meta.current_page === Math.ceil(meta.total/meta.per_page) ? 'disabled' : ''} style="padding: 8px 16px; border-radius: 8px; border: 1px solid var(--border-glass); background: ${meta.current_page === Math.ceil(meta.total/meta.per_page) ? 'transparent' : 'var(--bg-glass)'}; color: var(--text-main); cursor: ${meta.current_page === Math.ceil(meta.total/meta.per_page) ? 'not-allowed' : 'pointer'}; opacity: ${meta.current_page === Math.ceil(meta.total/meta.per_page) ? '0.5' : '1'};">Next</button>
                            </div>
                        `;
                        const pBtn = document.getElementById('nlPrevBtn');
                        const nBtn = document.getElementById('nlNextBtn');
                        if (pBtn) pBtn.addEventListener('click', () => { currentPage--; loadPage(currentPage); });
                        if (nBtn) nBtn.addEventListener('click', () => { currentPage++; loadPage(currentPage); });
                    } else {
                        pagination.innerHTML = '';
                    }
                }
            } catch (err) {
                console.error(err);
            } finally {
                if (loader) loader.style.display = 'none';
                if (content) content.style.display = 'flex';
            }
        };

        const markAllBtn = document.getElementById('nlMarkAllReadBtn');
        if (markAllBtn) {
            markAllBtn.addEventListener('click', async () => {
                try {
                    await window.api.post('/notifications/read-all');
                    window.loadNotifications();
                    loadPage(currentPage);
                } catch (err) {}
            });
        }

        loadPage(currentPage);
    }
};
