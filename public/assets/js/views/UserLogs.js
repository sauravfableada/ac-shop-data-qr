window.UserLogs = {
    render: async (container) => {
        
        const fetchLogs = async () => {
            const response = await window.api.get('/user-logs');
            return response.success ? response.data : [];
        };

        const renderTable = (logs) => {
            if (!logs.length) {
                return `<tr><td colspan="6" style="padding: 16px; text-align: center; color: var(--text-muted);">No logs found.</td></tr>`;
            }
            
            return logs.map(log => {
                let actionBadgeStyle = '';
                if (log.action === 'UPDATE') {
                    actionBadgeStyle = 'background-color: rgba(79, 70, 229, 0.1); color: #4f46e5;'; // Indigo
                } else if (log.action === 'ADD' || log.action === 'CREATE') {
                    actionBadgeStyle = 'background-color: rgba(16, 185, 129, 0.1); color: #10b981;'; // Green
                } else {
                    actionBadgeStyle = 'background-color: rgba(244, 63, 94, 0.1); color: #f43f5e;'; // Red/Delete
                }

                const userName = log.user ? log.user.name : 'System / Admin User';
                const created = new Date(log.created_at).toLocaleString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: true });

                return `
                    <tr style="border-bottom: 1px solid var(--border-glass);">
                        <td style="padding: 16px; font-weight: 500;">${userName}</td>
                        <td style="padding: 16px;">
                            <span style="background-color: rgba(59, 130, 246, 0.1); color: #3b82f6; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: 600;">${log.module}</span>
                        </td>
                        <td style="padding: 16px;">
                            <span style="${actionBadgeStyle} padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: 600;">${log.action}</span>
                        </td>
                        <td style="padding: 16px; font-size: 14px;">${log.message}</td>
                        <td style="padding: 16px; font-size: 13px; color: var(--text-muted);">${created}</td>
                        <td style="padding: 16px;">
                            <button class="clear-log-btn" data-id="${log.id}" style="background-color: #0f172a; color: white; border: none; padding: 6px 16px; border-radius: 20px; font-size: 12px; font-weight: 600; cursor: pointer; transition: background-color 0.2s;">Clear</button>
                        </td>
                    </tr>
                `;
            }).join('');
        };

        let logs = await fetchLogs();
        let tableRows = renderTable(logs);

        const content = `
            <div>
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px;">
                    <div>
                        <h1 style="font-size: 24px; margin-bottom: 4px;">User Logs</h1>
                        <p style="color: var(--text-muted); font-size: 14px;">Track user activity across CRM modules.</p>
                    </div>
                    <div style="display: flex; gap: 12px;">
                        <button id="refreshLogsBtn" style="display: flex; align-items: center; gap: 8px; padding: 8px 16px; background: transparent; color: var(--text-main); border: 1px solid var(--border-glass); border-radius: 8px; cursor: pointer; font-weight: 500; font-size: 14px;">
                            <i class="fa-solid fa-rotate-right"></i> Refresh
                        </button>
                        <button id="deleteAllLogsBtn" style="display: flex; align-items: center; gap: 8px; padding: 8px 16px; background: #0f172a; color: white; border: none; border-radius: 8px; cursor: pointer; font-weight: 600; font-size: 14px;">
                            <i class="fa-solid fa-trash"></i> Delete All
                        </button>
                    </div>
                </div>

                <div class="glass-panel" style="padding: 24px;">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
                        <div style="display: flex; align-items: center; gap: 8px; color: var(--text-muted); font-size: 14px;">
                            Show 
                            <select style="padding: 4px 8px; border-radius: 6px; border: 1px solid var(--border-glass); background: transparent; color: var(--text-main); outline: none;">
                                <option>10</option>
                                <option>25</option>
                                <option>50</option>
                            </select> 
                            entries
                        </div>
                        <div style="position: relative;">
                            <i class="fa-solid fa-search" style="position: absolute; left: 12px; top: 50%; transform: translateY(-50%); color: var(--text-muted); font-size: 14px;"></i>
                            <input type="text" placeholder="Search logs..." style="padding: 8px 12px 8px 32px; border-radius: 8px; border: 1px solid var(--border-glass); background: transparent; color: var(--text-main); outline: none; font-size: 14px; width: 200px;">
                        </div>
                    </div>

                    <div style="overflow-x: auto;">
                        <table style="width: 100%; border-collapse: collapse; text-align: left;">
                            <thead>
                                <tr style="border-bottom: 2px solid var(--border-glass); color: var(--text-muted); font-size: 11px; text-transform: uppercase; font-weight: 700;">
                                    <th style="padding: 12px 16px;">Actioned By</th>
                                    <th style="padding: 12px 16px;">Module</th>
                                    <th style="padding: 12px 16px;">Taken Action</th>
                                    <th style="padding: 12px 16px;">Message</th>
                                    <th style="padding: 12px 16px;">Created At</th>
                                    <th style="padding: 12px 16px;">Action</th>
                                </tr>
                            </thead>
                            <tbody id="logsTableBody">
                                ${tableRows}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        `;

        container.innerHTML = window.renderLayout(content);

        const attachLogEvents = () => {
            document.querySelectorAll('.clear-log-btn').forEach(btn => {
                btn.addEventListener('click', async (e) => {
                    if (confirm('Clear this log?')) {
                        const id = e.currentTarget.dataset.id;
                        const res = await window.api.delete('/user-logs/' + id);
                        if (res.success) {
                            document.getElementById('refreshLogsBtn').click();
                        }
                    }
                });
            });
        };

        attachLogEvents();

        document.getElementById('refreshLogsBtn').addEventListener('click', async () => {
            logs = await fetchLogs();
            document.getElementById('logsTableBody').innerHTML = renderTable(logs);
            attachLogEvents();
        });

        document.getElementById('deleteAllLogsBtn').addEventListener('click', async () => {
            if (confirm('Are you sure you want to delete ALL logs? This cannot be undone.')) {
                const res = await window.api.delete('/user-logs/clear');
                if (res.success) {
                    document.getElementById('refreshLogsBtn').click();
                }
            }
        });
    }
};
