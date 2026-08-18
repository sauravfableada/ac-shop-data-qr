window.ServiceView = {
    render: async (container) => {
        const urlSegments = window.location.pathname.split('/');
        const serviceId = urlSegments[urlSegments.length - 1];

        let service = null;

        try {
            const res = await window.api.get(`/services/${serviceId}`);
            if (res.success) {
                service = res.data;
            } else {
                container.innerHTML = window.renderLayout(`<div class="glass-panel" style="padding: 24px;">Failed to load Service details.</div>`);
                return;
            }
        } catch (e) {
            container.innerHTML = window.renderLayout(`<div class="glass-panel" style="padding: 24px;">Error loading data.</div>`);
            return;
        }

        const getStatusBadge = (status) => {
            const colors = {
                'pending': { bg: 'rgba(245,158,11,0.1)', color: '#F59E0B' },
                'assigned': { bg: 'rgba(59,130,246,0.1)', color: '#3B82F6' },
                'in_progress': { bg: 'rgba(139,92,246,0.1)', color: '#8B5CF6' },
                'completed': { bg: 'rgba(16,185,129,0.1)', color: '#10B981' },
                'cancelled': { bg: 'rgba(244,63,94,0.1)', color: '#F43F5E' }
            };
            const theme = colors[status] || { bg: 'rgba(100,116,139,0.1)', color: '#64748B' };
            return `<span style="padding: 4px 10px; border-radius: 6px; font-size: 12px; font-weight: 700; text-transform: uppercase; background: ${theme.bg}; color: ${theme.color};">${status}</span>`;
        };

        const getPaymentBadge = (status) => {
            const colors = {
                'unpaid': { bg: 'rgba(244,63,94,0.1)', color: '#F43F5E' },
                'partial': { bg: 'rgba(245,158,11,0.1)', color: '#F59E0B' },
                'paid': { bg: 'rgba(16,185,129,0.1)', color: '#10B981' }
            };
            const theme = colors[status] || { bg: 'rgba(100,116,139,0.1)', color: '#64748B' };
            return `<span style="padding: 4px 10px; border-radius: 6px; font-size: 12px; font-weight: 700; text-transform: uppercase; background: ${theme.bg}; color: ${theme.color};">${status}</span>`;
        };

        const content = `
            <div>
                <!-- Header -->
                <div class="table-header-row" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px;">
                    <div>
                        <h1 style="font-size: 24px; margin-bottom: 4px; color: #0f172a;">Service Details: ${service.service_number}</h1>
                        <p style="color: #64748b; font-size: 14px;">Date: ${new Date(service.service_date).toLocaleDateString()}</p>
                    </div>
                    <div style="display: flex; gap: 12px;">
                        <button onclick="window.history.back()" style="display: flex; align-items: center; gap: 8px; padding: 8px 16px; background: #ffffff; color: #0f172a; border: 1px solid #e2e8f0; border-radius: 8px; cursor: pointer; font-weight: 600; font-size: 14px;">
                            <i class="fa-solid fa-arrow-left"></i> <span class="hide-on-mobile">Back</span>
                        </button>
                        <button onclick="window.router.navigate('/services/edit/${service.id}')" style="display: flex; align-items: center; gap: 8px; padding: 8px 16px; background: #f59e0b; color: white; border: none; border-radius: 8px; cursor: pointer; font-weight: 600; font-size: 14px;">
                            <i class="fa-solid fa-pen-to-square"></i> <span class="hide-on-mobile">Edit Service</span>
                        </button>
                        <button onclick="window.ServiceView.delete(${service.id})" style="display: flex; align-items: center; gap: 8px; padding: 8px 16px; background: #ef4444; color: white; border: none; border-radius: 8px; cursor: pointer; font-weight: 600; font-size: 14px;">
                            <i class="fa-solid fa-trash-can"></i> <span class="hide-on-mobile">Delete</span>
                        </button>
                    </div>
                </div>

                <!-- Info Cards -->
                <div class="responsive-grid glass-panel" style="padding: 24px; border-radius: 12px; margin-bottom: 24px; display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px;">
                    <div>
                        <div style="font-size: 12px; color: #64748b; font-weight: 600; text-transform: uppercase; margin-bottom: 8px;">Customer Details</div>
                        <div style="font-size: 15px; color: #0f172a; font-weight: 500;">${service.customer ? service.customer.full_name : '-'}</div>
                        <div style="font-size: 14px; color: #64748b;">${service.customer ? service.customer.mobile : ''}</div>
                    </div>
                    <div>
                        <div style="font-size: 12px; color: #64748b; font-weight: 600; text-transform: uppercase; margin-bottom: 8px;">AC Unit Code</div>
                        <div style="font-size: 15px; color: #0f172a; font-weight: 500; cursor: pointer;" onclick="window.router.navigate('/ac-units/view/${service.ac_unit_id}')">
                            <span style="color: #3b82f6; text-decoration: underline;">${service.ac_unit ? service.ac_unit.ac_code : '-'}</span>
                        </div>
                        <div style="font-size: 14px; color: #64748b;">${service.ac_unit ? service.ac_unit.brand + ' ' + service.ac_unit.model : ''}</div>
                    </div>
                    <div>
                        <div style="font-size: 12px; color: #64748b; font-weight: 600; text-transform: uppercase; margin-bottom: 8px;">Technician</div>
                        <div style="font-size: 15px; color: #0f172a; font-weight: 500;">${service.technician ? service.technician.name : '<span style="color:#94a3b8;font-style:italic;">Unassigned</span>'}</div>
                    </div>
                </div>

                <div class="responsive-grid" style="display: grid; grid-template-columns: 2fr 1fr; gap: 24px;">
                    <!-- Left Column -->
                    <div style="display: flex; flex-direction: column; gap: 24px;">
                        <div class="glass-panel" style="padding: 24px; border-radius: 12px;">
                            <h3 style="font-size: 16px; color: #0f172a; border-bottom: 1px solid var(--border-glass); padding-bottom: 12px; margin-bottom: 16px; display: flex; justify-content: space-between;">
                                <span>Service Information</span>
                                ${getStatusBadge(service.status || 'pending')}
                            </h3>
                            
                            <div style="display: grid; grid-template-columns: 1fr; gap: 16px;">
                                <div>
                                    <div style="font-size: 12px; color: #64748b; font-weight: 600; text-transform: uppercase; margin-bottom: 4px;">Service Type</div>
                                    <div style="font-size: 14px; color: #0f172a;">${service.service_type || '-'}</div>
                                </div>
                                
                                <div>
                                    <div style="font-size: 12px; color: #64748b; font-weight: 600; text-transform: uppercase; margin-bottom: 4px;">Customer Complaint</div>
                                    <div style="font-size: 14px; color: #0f172a; background: rgba(0,0,0,0.02); padding: 12px; border-radius: 8px; min-height: 40px;">${service.complaint || '-'}</div>
                                </div>

                                <div>
                                    <div style="font-size: 12px; color: #64748b; font-weight: 600; text-transform: uppercase; margin-bottom: 4px;">Work Performed</div>
                                    <div style="font-size: 14px; color: #0f172a; background: rgba(0,0,0,0.02); padding: 12px; border-radius: 8px; min-height: 40px;">${service.work_performed || '-'}</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Right Column (Billing) -->
                    <div class="glass-panel" style="padding: 24px; border-radius: 12px; height: fit-content;">
                        <h3 style="font-size: 16px; color: #0f172a; border-bottom: 1px solid var(--border-glass); padding-bottom: 12px; margin-bottom: 16px; display: flex; justify-content: space-between;">
                            <span>Billing</span>
                            ${getPaymentBadge(service.payment_status || 'unpaid')}
                        </h3>

                        <div style="display: flex; flex-direction: column; gap: 12px;">
                            <div style="display: flex; justify-content: space-between; font-size: 14px; color: #475569;">
                                <span>Labor Charge</span>
                                <span>$${service.labor_charge || '0.00'}</span>
                            </div>
                            <div style="display: flex; justify-content: space-between; font-size: 14px; color: #475569;">
                                <span>Parts Charge</span>
                                <span>$${service.parts_charge || '0.00'}</span>
                            </div>
                            <div style="display: flex; justify-content: space-between; font-size: 14px; color: #475569;">
                                <span>Discount</span>
                                <span style="color: #10b981;">-$${service.discount || '0.00'}</span>
                            </div>
                            
                            <div style="border-top: 1px dashed var(--border-glass); margin: 8px 0;"></div>
                            
                            <div style="display: flex; justify-content: space-between; font-size: 16px; font-weight: 700; color: #0f172a;">
                                <span>Total Amount</span>
                                <span>$${service.total_amount || '0.00'}</span>
                            </div>
                        </div>

                        <div style="margin-top: 24px; border-top: 1px solid var(--border-glass); padding-top: 16px;">
                            <div style="font-size: 12px; color: #64748b; font-weight: 600; text-transform: uppercase; margin-bottom: 8px;">Next Service Due</div>
                            <div style="font-size: 15px; color: #0f172a; font-weight: 500;">
                                <i class="fa-regular fa-calendar" style="color: #3b82f6; margin-right: 6px;"></i> 
                                ${service.next_service_date ? new Date(service.next_service_date).toLocaleDateString() : 'Not scheduled'}
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        `;

        container.innerHTML = window.renderLayout(content);
    },

    delete: async (id) => {
        if (!confirm('Are you sure you want to delete this maintenance record?')) return;
        
        try {
            const res = await window.api.request(`/services/${id}`, { method: 'DELETE' });
            if (res.success) {
                window.showToast('Maintenance record deleted successfully', 'success');
                window.history.back(); // Go back to history
            } else {
                window.showToast(res.message || 'Error deleting record', 'error');
            }
        } catch (e) {
            window.showToast('Failed to delete maintenance record', 'error');
        }
    }
};
