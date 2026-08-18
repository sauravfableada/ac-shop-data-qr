window.AdminDashboard = {
    render: async (container) => {
        // Fetch dashboard data
        const response = await window.api.get('/admin/dashboard');
        
        if (!response.success) {
            container.innerHTML = window.renderLayout(`<div class="glass-panel" style="padding: 20px;">Failed to load dashboard.</div>`);
            return;
        }

        const stats = response.data;

        const content = `
            <div>
                <h1 style="font-size: 32px; margin-bottom: 8px;">Overview</h1>
                <p style="color: var(--text-muted); margin-bottom: 32px;">Welcome back to your dashboard.</p>
                
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 24px; margin-bottom: 40px;">
                    <div class="glass-card" style="padding: 24px;">
                        <h3 style="color: var(--text-muted); font-size: 14px; font-weight: 500; margin-bottom: 8px;">Total Customers</h3>
                        <div style="font-size: 36px; font-weight: 700; color: var(--text-main);">${stats.total_customers}</div>
                    </div>
                    <div class="glass-card" style="padding: 24px;">
                        <h3 style="color: var(--text-muted); font-size: 14px; font-weight: 500; margin-bottom: 8px;">Total AC Units</h3>
                        <div style="font-size: 36px; font-weight: 700; color: var(--text-main);">${stats.total_acs}</div>
                    </div>
                    <div class="glass-card" style="padding: 24px;">
                        <h3 style="color: var(--text-muted); font-size: 14px; font-weight: 500; margin-bottom: 8px;">Today's Services</h3>
                        <div style="font-size: 36px; font-weight: 700; color: var(--primary);">${stats.today_services}</div>
                    </div>
                    <div class="glass-card" style="padding: 24px;">
                        <h3 style="color: var(--text-muted); font-size: 14px; font-weight: 500; margin-bottom: 8px;">Total Revenue</h3>
                        <div style="font-size: 36px; font-weight: 700; color: var(--secondary);">₹${stats.total_revenue}</div>
                    </div>
                </div>

                <div class="glass-panel" style="padding: 32px;">
                    <h2 style="margin-bottom: 24px;">Recent Services</h2>
                    <!-- Placeholder for actual services table -->
                    <div style="text-align: center; color: var(--text-muted); padding: 40px 0;">
                        No recent services to display right now.
                    </div>
                </div>
            </div>
        `;

        container.innerHTML = window.renderLayout(content);
    }
};
