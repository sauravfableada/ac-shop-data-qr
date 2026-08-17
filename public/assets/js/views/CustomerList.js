window.CustomerList = {
    render: async (container) => {
        const response = await window.api.get('/customers');
        
        if (!response.success) {
            container.innerHTML = window.renderLayout(`<div class="glass-panel" style="padding: 20px;">Failed to load customers.</div>`);
            return;
        }

        const customers = response.data?.data || response.data || [];

        let tableRows = customers.length ? customers.map(c => `
            <tr style="border-bottom: 1px solid var(--border-glass);">
                <td style="padding: 16px;">${c.customer_code}</td>
                <td style="padding: 16px;">${c.full_name}</td>
                <td style="padding: 16px;">${c.mobile}</td>
                <td style="padding: 16px;">${c.city || '-'}</td>
                <td style="padding: 16px;">
                    <span style="padding: 4px 8px; border-radius: 4px; font-size: 12px; background: ${c.status === 'active' ? 'rgba(16,185,129,0.2)' : 'rgba(244,63,94,0.2)'}; color: ${c.status === 'active' ? '#10B981' : '#F43F5E'};">${c.status}</span>
                </td>
            </tr>
        `).join('') : `<tr><td colspan="5" style="padding: 16px; text-align: center; color: var(--text-muted);">No customers found</td></tr>`;

        const content = `
            <div>
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 32px;">
                    <h1 style="font-size: 32px;">Customers</h1>
                    <button class="btn btn-primary">+ Add Customer</button>
                </div>
                
                <div class="glass-panel" style="overflow: hidden;">
                    <table style="width: 100%; border-collapse: collapse; text-align: left;">
                        <thead style="background: rgba(0,0,0,0.2);">
                            <tr>
                                <th style="padding: 16px; font-weight: 500; color: var(--text-muted);">Code</th>
                                <th style="padding: 16px; font-weight: 500; color: var(--text-muted);">Name</th>
                                <th style="padding: 16px; font-weight: 500; color: var(--text-muted);">Mobile</th>
                                <th style="padding: 16px; font-weight: 500; color: var(--text-muted);">City</th>
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
