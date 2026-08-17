window.AcUnitList = {
    render: async (container) => {
        const response = await window.api.get('/ac-units');
        
        if (!response.success) {
            container.innerHTML = window.renderLayout(`<div class="glass-panel" style="padding: 20px;">Failed to load AC Units.</div>`);
            return;
        }

        const acUnits = response.data?.data || response.data || [];

        let tableRows = acUnits.length ? acUnits.map(ac => `
            <tr style="border-bottom: 1px solid var(--border-glass);">
                <td style="padding: 16px;">${ac.ac_code}</td>
                <td style="padding: 16px;">${ac.brand || '-'} ${ac.model || ''}</td>
                <td style="padding: 16px;">${ac.customer ? ac.customer.full_name : 'N/A'}</td>
                <td style="padding: 16px;">
                    <a href="/scanner?token=${ac.qr_token}" data-link style="color: var(--primary); text-decoration: none;">View QR</a>
                </td>
                <td style="padding: 16px;">
                    <span style="padding: 4px 8px; border-radius: 4px; font-size: 12px; background: ${ac.status === 'active' ? 'rgba(16,185,129,0.2)' : 'rgba(244,63,94,0.2)'}; color: ${ac.status === 'active' ? '#10B981' : '#F43F5E'};">${ac.status}</span>
                </td>
            </tr>
        `).join('') : `<tr><td colspan="5" style="padding: 16px; text-align: center; color: var(--text-muted);">No AC Units found</td></tr>`;

        const content = `
            <div>
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 32px;">
                    <h1 style="font-size: 32px;">AC Units</h1>
                    <div style="display: flex; gap: 12px;">
                        <a href="/scanner" data-link class="btn" style="background: rgba(255,255,255,0.1); color: white;">Scan QR</a>
                        <button class="btn btn-primary">+ Add AC Unit</button>
                    </div>
                </div>
                
                <div class="glass-panel" style="overflow: hidden;">
                    <table style="width: 100%; border-collapse: collapse; text-align: left;">
                        <thead style="background: rgba(0,0,0,0.2);">
                            <tr>
                                <th style="padding: 16px; font-weight: 500; color: var(--text-muted);">Code</th>
                                <th style="padding: 16px; font-weight: 500; color: var(--text-muted);">Brand/Model</th>
                                <th style="padding: 16px; font-weight: 500; color: var(--text-muted);">Customer</th>
                                <th style="padding: 16px; font-weight: 500; color: var(--text-muted);">QR Data</th>
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
