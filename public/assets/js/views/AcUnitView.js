window.AcUnitView = {
    render: async (container) => {
        const urlSegments = window.location.pathname.split('/');
        const acId = urlSegments[urlSegments.length - 1];

        // Fetch AC details
        let ac = null;
        try {
            const res = await window.api.get(`/ac-units/${acId}`);
            if (res.success) {
                ac = res.data;
            } else {
                container.innerHTML = window.renderLayout(`<div class="glass-panel" style="padding: 24px;">Failed to load AC Unit details.</div>`);
                return;
            }
        } catch (e) {
            container.innerHTML = window.renderLayout(`<div class="glass-panel" style="padding: 24px;">Error loading data.</div>`);
            return;
        }

        // Fetch Service History (Maintenance)
        let historyHtml = `<tr><td colspan="5" style="padding: 16px; text-align: center; color: #64748b;">No maintenance history found for this AC.</td></tr>`;
        try {
            const histRes = await window.api.get(`/ac-units/${acId}/service-history`);
            if (histRes.success && histRes.data.length > 0) {
                historyHtml = histRes.data.map(record => `
                    <tr style="border-bottom: 1px solid #e2e8f0;">
                        <td style="padding: 16px; font-weight: 500;">${new Date(record.service_date).toLocaleDateString()}</td>
                        <td style="padding: 16px;">${record.service_type || 'Regular Maintenance'}</td>
                        <td style="padding: 16px;">${record.complaint || '-'}</td>
                        <td style="padding: 16px; font-weight: 600; color: #0f172a;">₹${record.total_amount || '0.00'}</td>
                        <td style="padding: 16px;">
                            <span style="padding: 4px 8px; border-radius: 4px; font-size: 12px; font-weight: 600; background: ${record.status === 'completed' ? 'rgba(16,185,129,0.1)' : 'rgba(244,63,94,0.1)'}; color: ${record.status === 'completed' ? '#10B981' : '#F43F5E'};">${(record.status || 'pending').toUpperCase()}</span>
                        </td>
                        <td style="padding: 16px; text-align: right;">
                            <button onclick="window.router.navigate('/services/view/${record.id}')" style="background: #3b82f6; border: none; color: white; border-radius: 4px; padding: 6px 10px; cursor: pointer; transition: 0.2s;" title="View Details"><i class="fa-solid fa-eye"></i> View</button>
                        </td>
                    </tr>
                `).join('');
            }
        } catch (e) {
            console.error(e);
        }

        const content = `
            <div>
                <div class="table-header-row" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px;">
                    <div>
                        <h1 style="font-size: 24px; margin-bottom: 4px; color: #0f172a;">AC Unit Profile: ${ac.ac_code}</h1>
                        <p style="color: #64748b; font-size: 14px;">Customer: ${ac.customer ? ac.customer.full_name : 'Unknown'}</p>
                    </div>
                    <div style="display: flex; gap: 12px;">
                        <button onclick="window.history.back()" style="display: flex; align-items: center; gap: 8px; padding: 8px 16px; background: #ffffff; color: #0f172a; border: 1px solid #e2e8f0; border-radius: 8px; cursor: pointer; font-weight: 600; font-size: 14px;">
                            <i class="fa-solid fa-arrow-left"></i> <span class="hide-on-mobile">Back</span>
                        </button>
                        <button onclick="window.router.navigate('/ac-units/edit/${ac.id}')" style="display: flex; align-items: center; gap: 8px; padding: 8px 16px; background: #f59e0b; color: white; border: none; border-radius: 8px; cursor: pointer; font-weight: 600; font-size: 14px;">
                            <i class="fa-solid fa-pencil"></i> <span class="hide-on-mobile">Edit Unit</span>
                        </button>
                        <button onclick="window.router.navigate('/services/add?ac_id=${ac.id}')" class="btn" style="padding: 8px 16px; background: #16b981; color: white; border: none; border-radius: 8px; cursor: pointer; font-weight: 600; font-size: 14px;">
                            <i class="fa-solid fa-plus"></i> <span class="hide-on-mobile">Add Maintenance</span>
                        </button>
                    </div>
                </div>

                <!-- Specs Card -->
                <div class="responsive-grid glass-panel" style="background: #ffffff; padding: 32px; border-radius: 12px; margin-bottom: 24px; display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px;">
                    <div>
                        <p style="font-size: 12px; color: #64748b; text-transform: uppercase; font-weight: 600;">Brand & Model</p>
                        <p style="font-size: 16px; color: #0f172a; font-weight: 500; margin-top: 4px;">${ac.brand || '-'} ${ac.model || ''}</p>
                    </div>
                    <div>
                        <p style="font-size: 12px; color: #64748b; text-transform: uppercase; font-weight: 600;">AC Type & Capacity</p>
                        <p style="font-size: 16px; color: #0f172a; font-weight: 500; margin-top: 4px;">${ac.ac_type || '-'} - ${ac.capacity || '-'}</p>
                    </div>
                    <div>
                        <p style="font-size: 12px; color: #64748b; text-transform: uppercase; font-weight: 600;">Serial Number</p>
                        <p style="font-size: 16px; color: #0f172a; font-weight: 500; margin-top: 4px;">${ac.serial_number || 'N/A'}</p>
                    </div>
                    <div>
                        <p style="font-size: 12px; color: #64748b; text-transform: uppercase; font-weight: 600;">Installation Date</p>
                        <p style="font-size: 16px; color: #0f172a; font-weight: 500; margin-top: 4px;">${ac.installation_date ? new Date(ac.installation_date).toLocaleDateString() : 'N/A'}</p>
                    </div>
                    <div>
                        <p style="font-size: 12px; color: #64748b; text-transform: uppercase; font-weight: 600;">Location/Room</p>
                        <p style="font-size: 16px; color: #0f172a; font-weight: 500; margin-top: 4px;">${ac.room || 'N/A'}</p>
                    </div>
                    <div>
                        <div style="font-size: 12px; color: #64748b; font-weight: 600; text-transform: uppercase; margin-bottom: 8px;">QR Code</div>
                        ${ac.qr_code
                ? `<img src="https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=${ac.qr_code.token}" alt="QR Code" style="border-radius: 8px; border: 1px solid var(--border-glass); padding: 4px; background: white; margin-bottom: 8px;">
                               <div style="font-size: 11px; color: #64748b; word-break: break-all;">${ac.qr_code.token}</div>`
                : `<div style="font-size: 14px; color: #64748b;">None generated</div>`}
                    </div>
                </div>

                <!-- Maintenance History Table -->
                <div class="glass-panel" style="padding: 24px; background: #ffffff;">
                    <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 24px;">
                        <h2 style="font-size: 18px; color: #0f172a; font-weight: 600;">Maintenance History</h2>
                    </div>
                    <div style="overflow-x: auto;">
                        <table style="width: 100%; border-collapse: collapse; text-align: left;">
                            <thead style="background: #f8fafc; border-bottom: 1px solid #e2e8f0; border-radius: 8px;">
                                <tr>
                                    <th style="padding: 12px 16px; font-weight: 600; font-size: 13px; color: #64748b; text-transform: uppercase;">Date</th>
                                    <th style="padding: 12px 16px; font-weight: 600; font-size: 13px; color: #64748b; text-transform: uppercase;">Type</th>
                                    <th style="padding: 12px 16px; font-weight: 600; font-size: 13px; color: #64748b; text-transform: uppercase;">Complaint</th>
                                    <th style="padding: 12px 16px; font-weight: 600; font-size: 13px; color: #64748b; text-transform: uppercase;">Amount</th>
                                    <th style="padding: 12px 16px; font-weight: 600; font-size: 13px; color: #64748b; text-transform: uppercase;">Status</th>
                                    <th style="padding: 12px 16px; font-weight: 600; font-size: 13px; color: #64748b; text-transform: uppercase; text-align: right;">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${historyHtml}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        `;

        container.innerHTML = window.renderLayout(content);
    }
};
