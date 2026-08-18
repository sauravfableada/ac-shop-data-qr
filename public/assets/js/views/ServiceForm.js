window.ServiceForm = {
    render: async (container) => {
        const urlParams = new URLSearchParams(window.location.search);
        const acIdQuery = urlParams.get('ac_id');

        const urlSegments = window.location.pathname.split('/');
        const isEdit = urlSegments.includes('edit');
        const serviceId = isEdit ? urlSegments[urlSegments.length - 1] : null;

        let service = {};
        let acUnits = [];

        // Load AC Units for dropdown
        try {
            const acRes = await window.api.get('/ac-units?per_page=1000');
            if (acRes.success) {
                acUnits = acRes.data?.data || acRes.data || [];
            }
        } catch (e) {
            console.error("Failed to load AC units", e);
        }

        if (isEdit) {
            try {
                const res = await window.api.get(`/services/${serviceId}`);
                if (res.success) {
                    service = res.data;
                }
            } catch (e) {
                window.showToast("Failed to load maintenance record", "error");
            }
        } else if (acIdQuery) {
            service.ac_unit_id = acIdQuery;
        }

        const acOptions = acUnits.map(ac =>
            `<option value="${ac.id}" ${service.ac_unit_id == ac.id ? 'selected' : ''}>${ac.ac_code} - ${ac.customer ? ac.customer.full_name : ''}</option>`
        ).join('');

        const content = `
            <div>
                <div class="table-header-row" style="display: flex; justify-content: space-between; align-items: center; margin: 0 auto 24px auto;">
                    <div>
                        <h1 style="font-size: 24px; color: #0f172a; margin-bottom: 4px;">${isEdit ? 'Edit Maintenance Record' : 'Add Maintenance'}</h1>
                        <p style="color: #64748b; font-size: 14px;">Log a new service, repair, or maintenance check.</p>
                    </div>
                    <div>
                        <button onclick="window.history.back()" style="display: flex; align-items: center; gap: 8px; padding: 8px 16px; background: transparent; color: #0f172a; border: 1px solid #e2e8f0; border-radius: 8px; cursor: pointer; font-weight: 600; font-size: 14px;">
                            <i class="fa-solid fa-arrow-left"></i> <span class="hide-on-mobile">Back</span>
                        </button>
                    </div>
                </div>

                <div class="glass-panel" style="background: #ffffff;  padding: 32px; border-radius: 12px; margin: 0 auto;">

                <form id="serviceForm" onsubmit="window.ServiceForm.save(event, ${isEdit}, ${serviceId})" style="display: grid; grid-template-columns: 1fr 1fr; gap: 24px;" novalidate>
                    
                    <div style="grid-column: span 2;">
                        <h3 style="font-size: 16px; color: #0f172a; border-bottom: 1px solid var(--border-glass); padding-bottom: 8px; margin-bottom: 16px;">Service Details</h3>
                    </div>

                    <div class="form-group" style="display: flex; flex-direction: column; gap: 8px;">
                        <label style="font-weight: 500; font-size: 14px; color: var(--text-main);">AC Unit <span style="color: red;">*</span></label>
                        <select name="ac_unit_id" required style="width: 100%; padding: 12px; border-radius: 8px; border: 1px solid var(--border-glass); background: transparent; color: var(--text-main); outline: none; font-family: inherit; font-size: 14px;">
                            <option value="">Select AC Unit</option>
                            ${acOptions}
                        </select>
                        <div id="err_ac_unit_id" style="color: #ef4444; font-size: 12px; margin-top: 4px; display: none;"></div>
                    </div>

                    <div class="form-group" style="display: flex; flex-direction: column; gap: 8px;">
                        <label style="font-weight: 500; font-size: 14px; color: var(--text-main);">Service Date <span style="color: red;">*</span></label>
                        <input type="date" name="service_date" value="${service.service_date ? service.service_date.split('T')[0] : new Date().toISOString().split('T')[0]}" required style="width: 100%; padding: 12px; border-radius: 8px; border: 1px solid var(--border-glass); background: transparent; color: var(--text-main); outline: none; font-family: inherit; font-size: 14px;">
                        <div id="err_service_date" style="color: #ef4444; font-size: 12px; margin-top: 4px; display: none;"></div>
                    </div>

                    <div class="form-group" style="display: flex; flex-direction: column; gap: 8px;">
                        <label style="font-weight: 500; font-size: 14px; color: var(--text-main);">Service Type <span style="color: red;">*</span></label>
                        <select name="service_type" required style="width: 100%; padding: 12px; border-radius: 8px; border: 1px solid var(--border-glass); background: transparent; color: var(--text-main); outline: none; font-family: inherit; font-size: 14px;">
                            <option value="Regular Maintenance" ${service.service_type === 'Regular Maintenance' ? 'selected' : ''}>Regular Maintenance</option>
                            <option value="Repair" ${service.service_type === 'Repair' ? 'selected' : ''}>Repair</option>
                            <option value="Installation" ${service.service_type === 'Installation' ? 'selected' : ''}>Installation</option>
                            <option value="Inspection" ${service.service_type === 'Inspection' ? 'selected' : ''}>Inspection</option>
                        </select>
                        <div id="err_service_type" style="color: #ef4444; font-size: 12px; margin-top: 4px; display: none;"></div>
                    </div>

                    <div class="form-group" style="display: flex; flex-direction: column; gap: 8px;">
                        <label style="font-weight: 500; font-size: 14px; color: var(--text-main);">Status</label>
                        <select name="status" style="width: 100%; padding: 12px; border-radius: 8px; border: 1px solid var(--border-glass); background: transparent; color: var(--text-main); outline: none; font-family: inherit; font-size: 14px;">
                            <option value="completed" ${service.status === 'completed' ? 'selected' : ''}>Completed</option>
                            <option value="pending" ${service.status === 'pending' ? 'selected' : ''}>Pending</option>
                            <option value="in-progress" ${service.status === 'in-progress' ? 'selected' : ''}>In Progress</option>
                        </select>
                    </div>

                    <div class="form-group" style="display: flex; flex-direction: column; gap: 8px; grid-column: span 2;">
                        <label style="font-weight: 500; font-size: 14px; color: var(--text-main);">Customer Complaint / Issue</label>
                        <textarea name="complaint" rows="2" placeholder="What is the issue reported by the customer?" style="width: 100%; padding: 12px; border-radius: 8px; border: 1px solid var(--border-glass); background: transparent; color: var(--text-main); outline: none; font-family: inherit; resize: vertical;">${service.complaint || ''}</textarea>
                    </div>

                    <div class="form-group" style="display: flex; flex-direction: column; gap: 8px; grid-column: span 2;">
                        <label style="font-weight: 500; font-size: 14px; color: var(--text-main);">Diagnosis & Work Done</label>
                        <textarea name="work_done" rows="3" placeholder="Describe the work performed..." style="width: 100%; padding: 12px; border-radius: 8px; border: 1px solid var(--border-glass); background: transparent; color: var(--text-main); outline: none; font-family: inherit; resize: vertical;">${service.work_done || ''}</textarea>
                    </div>

                    <div style="grid-column: span 2; margin-top: 16px;">
                        <h3 style="font-size: 16px; color: #0f172a; border-bottom: 1px solid var(--border-glass); padding-bottom: 8px; margin-bottom: 16px;">Billing Details</h3>
                    </div>

                    <div class="form-group" style="display: flex; flex-direction: column; gap: 8px;">
                        <label style="font-weight: 500; font-size: 14px; color: var(--text-main);">Labor / Service Charge ($)</label>
                        <input type="number" step="0.01" name="labor_charge" id="labor_charge" value="${service.labor_charge || '0.00'}" oninput="window.ServiceForm.calculateTotal()" style="width: 100%; padding: 12px; border-radius: 8px; border: 1px solid var(--border-glass); background: transparent; color: var(--text-main); outline: none; font-family: inherit; font-size: 14px;">
                    </div>

                    <div class="form-group" style="display: flex; flex-direction: column; gap: 8px;">
                        <label style="font-weight: 500; font-size: 14px; color: var(--text-main);">Spare Parts Charge ($)</label>
                        <input type="number" step="0.01" name="parts_charge" id="parts_charge" value="${service.parts_charge || '0.00'}" oninput="window.ServiceForm.calculateTotal()" style="width: 100%; padding: 12px; border-radius: 8px; border: 1px solid var(--border-glass); background: transparent; color: var(--text-main); outline: none; font-family: inherit; font-size: 14px;">
                    </div>

                    <div class="form-group" style="display: flex; flex-direction: column; gap: 8px;">
                        <label style="font-weight: 500; font-size: 14px; color: var(--text-main);">Discount ($)</label>
                        <input type="number" step="0.01" name="discount" id="discount" value="${service.discount || '0.00'}" oninput="window.ServiceForm.calculateTotal()" style="width: 100%; padding: 12px; border-radius: 8px; border: 1px solid var(--border-glass); background: transparent; color: var(--text-main); outline: none; font-family: inherit; font-size: 14px;">
                    </div>

                    <div class="form-group" style="display: flex; flex-direction: column; gap: 8px;">
                        <label style="font-weight: 500; font-size: 14px; color: var(--text-main);">Total Amount ($)</label>
                        <input type="number" step="0.01" name="total_amount" id="total_amount" value="${service.total_amount || '0.00'}" readonly style="width: 100%; padding: 12px; border-radius: 8px; border: 1px solid var(--border-glass); background: rgba(0,0,0,0.05); color: var(--text-muted); outline: none; font-family: inherit; font-size: 14px; cursor: not-allowed; font-weight: bold;">
                    </div>

                    <div class="form-group" style="display: flex; flex-direction: column; gap: 8px;">
                        <label style="font-weight: 500; font-size: 14px; color: var(--text-main);">Payment Status</label>
                        <select name="payment_status" style="width: 100%; padding: 12px; border-radius: 8px; border: 1px solid var(--border-glass); background: transparent; color: var(--text-main); outline: none; font-family: inherit; font-size: 14px;">
                            <option value="unpaid" ${service.payment_status === 'unpaid' ? 'selected' : ''}>Unpaid</option>
                            <option value="paid" ${service.payment_status === 'paid' ? 'selected' : ''}>Paid</option>
                            <option value="partial" ${service.payment_status === 'partial' ? 'selected' : ''}>Partial</option>
                        </select>
                    </div>

                    <div class="form-group" style="display: flex; flex-direction: column; gap: 8px;">
                        <label style="font-weight: 500; font-size: 14px; color: var(--text-main);">Next Maintenance Date</label>
                        <input type="date" name="next_maintenance_date" value="${service.next_maintenance_date ? service.next_maintenance_date.split('T')[0] : ''}" style="width: 100%; padding: 12px; border-radius: 8px; border: 1px solid var(--border-glass); background: transparent; color: var(--text-main); outline: none; font-family: inherit; font-size: 14px;">
                    </div>

                    <div style="grid-column: span 2; display: flex; justify-content: flex-end; gap: 16px; margin-top: 24px; border-top: 1px solid var(--border-glass); padding-top: 24px;">
                        <button type="button" onclick="window.history.back()" style="padding: 12px 24px; border-radius: 8px; border: 1px solid var(--border-glass); background: transparent; color: var(--text-main); cursor: pointer; font-weight: 600;">Cancel</button>
                        <button type="submit" style="padding: 12px 24px; border-radius: 8px; border: none; background: var(--primary); color: white; cursor: pointer; font-weight: 600; box-shadow: 0 4px 12px var(--primary-glow);">
                            ${isEdit ? 'Save Changes' : 'Save Maintenance'}
                        </button>
                    </div>
                </form>
            </div>
        `;

        container.innerHTML = window.renderLayout(content);
    },

    calculateTotal: () => {
        const labor = parseFloat(document.getElementById('labor_charge').value) || 0;
        const parts = parseFloat(document.getElementById('parts_charge').value) || 0;
        const discount = parseFloat(document.getElementById('discount').value) || 0;

        const total = (labor + parts) - discount;
        document.getElementById('total_amount').value = Math.max(0, total).toFixed(2);
    },

    save: async (e, isEdit, id) => {
        e.preventDefault();
        const form = e.target;
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());

        // Clear previous error styles
        form.querySelectorAll('input, select, textarea').forEach(input => {
            input.style.borderColor = 'var(--border-glass)';
        });
        form.querySelectorAll('[id^="err_"]').forEach(el => {
            el.style.display = 'none';
            el.innerText = '';
        });

        try {
            const res = isEdit
                ? await window.api.put(`/services/${id}`, data)
                : await window.api.post('/services', data);

            if (res.success) {
                window.showToast(`Maintenance record ${isEdit ? 'updated' : 'added'} successfully!`, 'success');
                if (data.ac_unit_id) {
                    window.router.navigate(`/ac-units/view/${data.ac_unit_id}`);
                } else {
                    window.router.navigate('/services');
                }
            } else {
                let errorMessage = res.message || 'Error saving maintenance record';
                if (res.errors) {
                    for (const [key, messages] of Object.entries(res.errors)) {
                        let input = form.querySelector(`[name="${key}"]`);
                        if (input) input.style.borderColor = '#ef4444';
                        
                        let errDiv = document.getElementById('err_' + key);
                        if (errDiv) {
                            errDiv.innerText = messages[0];
                            errDiv.style.display = 'block';
                        }
                    }
                    const firstErrorKey = Object.keys(res.errors)[0];
                    if (res.errors[firstErrorKey] && res.errors[firstErrorKey].length > 0) {
                        errorMessage = res.errors[firstErrorKey][0];
                    }
                }
                window.showToast(errorMessage, 'error');
            }
        } catch (err) {
            window.showToast('Failed to save maintenance record', 'error');
            console.error(err);
        }
    }
};
