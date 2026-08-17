window.ServiceList = {
    render: async (container) => {
        const response = await window.api.get('/services');
        
        if (!response.success) {
            container.innerHTML = window.renderLayout(`<div class="glass-panel" style="padding: 20px;">Failed to load services.</div>`);
            return;
        }

        const services = response.data?.data || response.data || [];

        let tableRows = services.length ? services.map(s => `
            <tr style="border-bottom: 1px solid var(--border-glass);">
                <td style="padding: 16px;">${s.service_number}</td>
                <td style="padding: 16px;">${s.customer ? s.customer.full_name : 'N/A'}</td>
                <td style="padding: 16px;">${s.ac_unit ? s.ac_unit.ac_code : 'N/A'}</td>
                <td style="padding: 16px;">${s.service_date}</td>
                <td style="padding: 16px;">
                    <span style="padding: 4px 8px; border-radius: 4px; font-size: 12px; background: rgba(79,70,229,0.2); color: #818cf8;">${s.status}</span>
                </td>
            </tr>
        `).join('') : `<tr><td colspan="5" style="padding: 16px; text-align: center; color: var(--text-muted);">No services found</td></tr>`;

        const content = `
            <div>
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 32px;">
                    <h1 style="font-size: 32px;">Services</h1>
                    <button class="btn btn-primary">+ Create Service</button>
                </div>
                
                <div class="glass-panel" style="overflow: hidden;">
                    <table style="width: 100%; border-collapse: collapse; text-align: left;">
                        <thead style="background: rgba(0,0,0,0.2);">
                            <tr>
                                <th style="padding: 16px; font-weight: 500; color: var(--text-muted);">Service #</th>
                                <th style="padding: 16px; font-weight: 500; color: var(--text-muted);">Customer</th>
                                <th style="padding: 16px; font-weight: 500; color: var(--text-muted);">AC Code</th>
                                <th style="padding: 16px; font-weight: 500; color: var(--text-muted);">Date</th>
                                <th style="padding: 16px; font-weight: 500; color: var(--text-muted);">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${tableRows}
                        </tbody>
                    </table>
                </div>
            </div>
        `;

        container.innerHTML = window.renderLayout(content);
    }
};
