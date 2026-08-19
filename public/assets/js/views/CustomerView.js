window.CustomerView = {
    render: async (container, params = {}) => {
        if (!params.id) {
            container.innerHTML = window.renderLayout(`<div class="glass-panel" style="padding: 24px;">Invalid customer ID</div>`);
            return;
        }

        const response = await window.api.get('/customers/' + params.id);
        if (!response.success) {
            container.innerHTML = window.renderLayout(`<div class="glass-panel" style="padding: 24px;">Customer not found</div>`);
            return;
        }

        const c = response.data;

        // Fetch Service History
        let historyHtml = `<tr><td colspan="7" style="padding: 16px; text-align: center; color: #64748b;">No maintenance history found for this customer.</td></tr>`;
        try {
            const histRes = await window.api.get(`/customers/${params.id}/service-history`);
            if (histRes.success && histRes.data.length > 0) {
                historyHtml = histRes.data.map(record => `
                    <tr style="border-bottom: 1px solid #e2e8f0;">
                        <td style="padding: 16px; font-weight: 500;">${new Date(record.service_date).toLocaleDateString()}</td>
                        <td style="padding: 16px; color: #3b82f6; font-weight: 600;">${record.ac_unit ? record.ac_unit.ac_code : '-'}</td>
                        <td class="hide-on-mobile" style="padding: 16px;">${record.service_type || 'Regular Maintenance'}</td>
                        <td class="hide-on-mobile" style="padding: 16px;">${record.complaint || '-'}</td>
                        <td class="hide-on-mobile" style="padding: 16px; font-weight: 600; color: #0f172a;">₹${record.total_amount || '0.00'}</td>
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
                        <h1 style="font-size: 24px; margin-bottom: 4px; color: #0f172a;">Customer Profile</h1>
                        
                    </div>
                    <div style="display: flex; gap: 12px;">
                        <button onclick="window.router.navigate('/customers')" style="display: flex; align-items: center; gap: 8px; padding: 8px 16px; background: #ffffff; color: #0f172a; border: 1px solid #e2e8f0; border-radius: 8px; cursor: pointer; font-weight: 600; font-size: 14px;">
                            <i class="fa-solid fa-arrow-left"></i> <span class="hide-on-mobile">Back</span>
                        </button>
                        <button onclick="window.router.navigate('/customers/edit/${c.id}')" style="display: flex; align-items: center; gap: 8px; padding: 8px 16px; background: #f59e0b; color: white; border: none; border-radius: 8px; cursor: pointer; font-weight: 600; font-size: 14px;">
                            <i class="fa-solid fa-pencil"></i> Edit Profile
                        </button>
                    </div>
                </div>

                <div class="glass-panel" style="background: #ffffff; padding: 32px; border-radius: 12px;">
                    
                    <div style="display: flex; align-items: center; gap: 24px; margin-bottom: 40px; padding-bottom: 32px; border-bottom: 1px solid var(--border-glass);">
                        ${c.image ?
                `<img src="${c.image}" alt="${c.full_name}" style="width: 100px; height: 100px; border-radius: 50%; object-fit: cover; border: 2px solid var(--border-glass);">` :
                `<div style="width: 100px; height: 100px; border-radius: 50%; background: linear-gradient(135deg, var(--primary), #8b5cf6); display: flex; align-items: center; justify-content: center; font-size: 32px; font-weight: 700; color: white;">
                                ${c.full_name.charAt(0).toUpperCase()}
                            </div>`
            }
                        <div>
                            <h2 style="font-size: 28px; margin-bottom: 8px;">${c.full_name}</h2>
                            <span style="background-color: rgba(16, 185, 129, 0.1); color: #10b981; padding: 6px 12px; border-radius: 20px; font-size: 12px; font-weight: 600;">Code: ${c.customer_code}</span>
                        </div>
                    </div>

                    <div class="responsive-grid" style="display: grid; grid-template-columns: 1fr 1fr; gap: 32px;">
                        
                        <div>
                            <h3 style="font-size: 16px; margin-bottom: 16px; color: var(--text-muted); border-bottom: 1px solid var(--border-glass); padding-bottom: 8px;">Contact Information</h3>
                            
                            <div style="margin-bottom: 16px;">
                                <label style="display: block; font-size: 12px; color: var(--text-muted); margin-bottom: 4px;">Mobile Phone</label>
                                <div style="font-size: 15px; font-weight: 500;">${c.mobile}</div>
                            </div>
                            
                            <div style="margin-bottom: 16px;">
                                <label style="display: block; font-size: 12px; color: var(--text-muted); margin-bottom: 4px;">WhatsApp Number</label>
                                <div style="font-size: 15px; font-weight: 500;">${c.whatsapp_no || '<span style="color:var(--text-muted);">--</span>'}</div>
                            </div>
                            

                            

                        </div>

                        <div>
                            <h3 style="font-size: 16px; margin-bottom: 16px; color: var(--text-muted); border-bottom: 1px solid var(--border-glass); padding-bottom: 8px;">Address Information</h3>
                            
                            <div style="margin-bottom: 16px;">
                                <label style="display: block; font-size: 12px; color: var(--text-muted); margin-bottom: 4px;">Full Address</label>
                                <div style="font-size: 15px; font-weight: 500; line-height: 1.5;">${c.address || '<span style="color:var(--text-muted);">--</span>'}</div>
                            </div>
                            


                            <div style="margin-bottom: 16px;">
                                <label style="display: block; font-size: 12px; color: var(--text-muted); margin-bottom: 4px;">Registered On</label>
                                <div style="font-size: 15px; font-weight: 500;">${new Date(c.created_at).toLocaleString()}</div>
                            </div>
                        </div>

                    </div>
                </div>

                <!-- Maintenance History Table -->
                <div class="glass-panel" style="padding: 24px; background: #ffffff; margin-top: 24px;">
                    <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 24px;">
                        <h2 style="font-size: 18px; color: #0f172a; font-weight: 600;">Maintenance History</h2>
                        <button onclick="window.router.navigate('/services/add?customer_id=${c.id}')" style="background: #16b981; color: white; border: none; border-radius: 6px; padding: 6px 12px; font-size: 13px; font-weight: 600; cursor: pointer; display: flex; align-items: center; gap: 6px;">
                            <i class="fa-solid fa-plus"></i> <span class="hide-on-mobile">Add Maintenance</span>
                        </button>
                    </div>
                    <div style="overflow-x: auto;">
                        <table style="width: 100%; border-collapse: collapse; text-align: left;">
                            <thead style="background: #f8fafc; border-bottom: 1px solid #e2e8f0; border-radius: 8px;">
                                <tr>
                                    <th style="padding: 12px 16px; font-weight: 600; font-size: 13px; color: #64748b; text-transform: uppercase;">Date</th>
                                    <th style="padding: 12px 16px; font-weight: 600; font-size: 13px; color: #64748b; text-transform: uppercase;">AC Unit</th>
                                    <th class="hide-on-mobile" style="padding: 12px 16px; font-weight: 600; font-size: 13px; color: #64748b; text-transform: uppercase;">Type</th>
                                    <th class="hide-on-mobile" style="padding: 12px 16px; font-weight: 600; font-size: 13px; color: #64748b; text-transform: uppercase;">Complaint</th>
                                    <th class="hide-on-mobile" style="padding: 12px 16px; font-weight: 600; font-size: 13px; color: #64748b; text-transform: uppercase;">Amount</th>
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
