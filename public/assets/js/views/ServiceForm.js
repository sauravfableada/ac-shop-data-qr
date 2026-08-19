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

        let customers = [];
        try {
            const custRes = await window.api.get('/customers?per_page=1000');
            if (custRes.success) {
                customers = custRes.data?.data || custRes.data || [];
            }
        } catch (e) {
            console.error("Failed to load customers", e);
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
                        <div style="display: flex; justify-content: space-between; align-items: center;">
                            <label style="font-weight: 500; font-size: 14px; color: var(--text-main);">AC Unit <span style="color: red;">*</span></label>
                            <button type="button" onclick="document.getElementById('addAcModal').style.display='flex'; window.ServiceForm.loadAcCode();" style="background: var(--primary); color: white; border: none; border-radius: 4px; padding: 4px 8px; font-size: 12px; cursor: pointer;"><i class="fa-solid fa-plus"></i> Add New</button>
                        </div>
                        <select id="acSelect" name="ac_unit_id" required style="width: 100%; padding: 12px; border-radius: 8px; border: 1px solid var(--border-glass); background: transparent; color: var(--text-main); outline: none; font-family: inherit; font-size: 14px;">
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

                    <div class="two-col-mobile" style="display: grid; grid-template-columns: 1fr 1fr; gap: 24px; grid-column: span 2;">
                        <div class="form-group" style="display: flex; flex-direction: column; gap: 8px;">
                            <label style="font-weight: 500; font-size: 14px; color: var(--text-main);">Customer Complaint / Issue</label>
                            <textarea name="complaint" rows="3" placeholder="What is the issue reported by the customer?" style="width: 100%; padding: 12px; border-radius: 8px; border: 1px solid var(--border-glass); background: transparent; color: var(--text-main); outline: none; font-family: inherit; resize: vertical;">${service.complaint || ''}</textarea>
                        </div>

                        <div class="form-group" style="display: flex; flex-direction: column; gap: 8px;">
                            <label style="font-weight: 500; font-size: 14px; color: var(--text-main);">Diagnosis & Work Done</label>
                            <textarea name="work_done" rows="3" placeholder="Describe the work performed..." style="width: 100%; padding: 12px; border-radius: 8px; border: 1px solid var(--border-glass); background: transparent; color: var(--text-main); outline: none; font-family: inherit; resize: vertical;">${service.work_done || ''}</textarea>
                        </div>
                    </div>

                    <div style="grid-column: span 2; margin-top: 16px;">
                        <h3 style="font-size: 16px; color: #0f172a; border-bottom: 1px solid var(--border-glass); padding-bottom: 8px; margin-bottom: 16px;">Billing Details</h3>
                    </div>

                    <div class="form-group" style="display: flex; flex-direction: column; gap: 8px;">
                        <label style="font-weight: 500; font-size: 14px; color: var(--text-main);">Labor / Service Charge (₹)</label>
                        <input type="number" step="0.01" name="labor_charge" id="labor_charge" value="${service.labor_charge || '0.00'}" oninput="window.ServiceForm.calculateTotal()" style="width: 100%; padding: 12px; border-radius: 8px; border: 1px solid var(--border-glass); background: transparent; color: var(--text-main); outline: none; font-family: inherit; font-size: 14px;">
                    </div>

                    <div class="form-group" style="display: flex; flex-direction: column; gap: 8px;">
                        <label style="font-weight: 500; font-size: 14px; color: var(--text-main);">Spare Parts Charge (₹)</label>
                        <input type="number" step="0.01" name="parts_charge" id="parts_charge" value="${service.parts_charge || '0.00'}" oninput="window.ServiceForm.calculateTotal()" style="width: 100%; padding: 12px; border-radius: 8px; border: 1px solid var(--border-glass); background: transparent; color: var(--text-main); outline: none; font-family: inherit; font-size: 14px;">
                    </div>

                    <div class="form-group" style="display: flex; flex-direction: column; gap: 8px;">
                        <label style="font-weight: 500; font-size: 14px; color: var(--text-main);">Discount (₹)</label>
                        <input type="number" step="0.01" name="discount" id="discount" value="${service.discount || '0.00'}" oninput="window.ServiceForm.calculateTotal()" style="width: 100%; padding: 12px; border-radius: 8px; border: 1px solid var(--border-glass); background: transparent; color: var(--text-main); outline: none; font-family: inherit; font-size: 14px;">
                    </div>

                    <div class="form-group" style="display: flex; flex-direction: column; gap: 8px;">
                        <label style="font-weight: 500; font-size: 14px; color: var(--text-main);">Total Amount (₹)</label>
                        <input type="number" step="0.01" name="total_amount" id="total_amount" value="${service.total_amount || '0.00'}" readonly style="width: 100%; padding: 12px; border-radius: 8px; border: 1px solid var(--border-glass); background: rgba(0,0,0,0.05); color: var(--text-muted); outline: none; font-family: inherit; font-size: 14px; cursor: not-allowed; font-weight: bold;">
                    </div>

                    <div class="form-group" style="display: flex; flex-direction: column; gap: 8px;">
                        <label style="font-weight: 500; font-size: 14px; color: var(--text-main);">Payment Status</label>
                        <select name="payment_status" required style="width: 100%; padding: 12px; border-radius: 8px; border: 1px solid var(--border-glass); background: transparent; color: var(--text-main); outline: none; font-family: inherit; font-size: 14px;">
                            <option value="unpaid" ${service.payment_status === 'unpaid' ? 'selected' : ''}>Unpaid</option>
                            <option value="paid" ${service.payment_status === 'paid' ? 'selected' : ''}>Paid</option>
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

            <!-- Add AC Modal -->
            <div id="addAcModal" style="display: none; position: fixed; inset: 0; background: rgba(15, 23, 42, 0.6); backdrop-filter: blur(4px); z-index: 1000; align-items: center; justify-content: center;">
                <div style="background: #ffffff; width: 100%; max-width: 700px; border-radius: 16px; padding: 32px; box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04); position: relative; max-height: 90vh; overflow-y: auto;">
                    <button type="button" onclick="document.getElementById('addAcModal').style.display='none'" style="position: absolute; top: 16px; right: 16px; background: transparent; border: none; font-size: 20px; color: #64748b; cursor: pointer;"><i class="fa-solid fa-xmark"></i></button>
                    <h3 style="font-size: 20px; color: #0f172a; margin-bottom: 24px;">Quick Add AC Unit</h3>
                    
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
                        <div class="form-group" style="display: flex; flex-direction: column; gap: 8px;">
                            <label style="font-weight: 500; font-size: 14px; color: #334155;">Customer <span style="color: red;">*</span></label>
                            <select id="qaCustomer" style="width: 100%; padding: 12px; border-radius: 8px; border: 1px solid var(--border-glass); background: transparent; color: var(--text-main); outline: none; font-family: inherit; font-size: 14px;">
                                <option value="">Select Customer</option>
                                ${customers.map(c => `<option value="${c.id}">${c.full_name} (${c.mobile})</option>`).join('')}
                            </select>
                            <div id="err_qaCustomer" style="color: #ef4444; font-size: 12px; margin-top: 4px; display: none;"></div>
                        </div>

                        <div class="form-group" style="display: flex; flex-direction: column; gap: 8px;">
                            <label style="font-weight: 500; font-size: 14px; color: #334155;">AC Code <span style="color: red;">*</span></label>
                            <input type="text" id="qaAcCode" readonly style="width: 100%; padding: 12px; border-radius: 8px; border: 1px solid var(--border-glass); background: rgba(0,0,0,0.05); color: var(--text-muted); outline: none; font-family: inherit; font-size: 14px; cursor: not-allowed;">
                            <div id="err_qaAcCode" style="color: #ef4444; font-size: 12px; margin-top: 4px; display: none;"></div>
                        </div>

                        <div class="form-group" style="display: flex; flex-direction: column; gap: 8px;">
                            <label style="font-weight: 500; font-size: 14px; color: #334155;">Brand</label>
                            <input type="text" id="qaBrand" placeholder="e.g. Daikin, LG" style="width: 100%; padding: 12px; border-radius: 8px; border: 1px solid var(--border-glass); background: transparent; color: var(--text-main); outline: none; font-family: inherit; font-size: 14px;">
                        </div>

                        <div class="form-group" style="display: flex; flex-direction: column; gap: 8px;">
                            <label style="font-weight: 500; font-size: 14px; color: #334155;">Model</label>
                            <input type="text" id="qaModel" style="width: 100%; padding: 12px; border-radius: 8px; border: 1px solid var(--border-glass); background: transparent; color: var(--text-main); outline: none; font-family: inherit; font-size: 14px;">
                        </div>

                        <div class="form-group" style="display: flex; flex-direction: column; gap: 8px;">
                            <label style="font-weight: 500; font-size: 14px; color: #334155;">Serial Number</label>
                            <input type="text" id="qaSerialNumber" style="width: 100%; padding: 12px; border-radius: 8px; border: 1px solid var(--border-glass); background: transparent; color: var(--text-main); outline: none; font-family: inherit; font-size: 14px;">
                        </div>

                        <div class="form-group" style="display: flex; flex-direction: column; gap: 8px;">
                            <label style="font-weight: 500; font-size: 14px; color: #334155;">Capacity</label>
                            <input type="text" id="qaCapacity" placeholder="e.g. 1.5 Ton" style="width: 100%; padding: 12px; border-radius: 8px; border: 1px solid var(--border-glass); background: transparent; color: var(--text-main); outline: none; font-family: inherit; font-size: 14px;">
                        </div>

                        <div class="form-group" style="display: flex; flex-direction: column; gap: 8px;">
                            <label style="font-weight: 500; font-size: 14px; color: #334155;">AC Type</label>
                            <select id="qaAcType" style="width: 100%; padding: 12px; border-radius: 8px; border: 1px solid var(--border-glass); background: transparent; color: var(--text-main); outline: none; font-family: inherit; font-size: 14px;">
                                <option value="">Select Type</option>
                                <option value="Split">Split</option>
                                <option value="Window">Window</option>
                                <option value="Cassette">Cassette</option>
                                <option value="Tower">Tower</option>
                            </select>
                        </div>

                        <div class="form-group" style="display: flex; flex-direction: column; gap: 8px;">
                            <label style="font-weight: 500; font-size: 14px; color: #334155;">Inverter Type</label>
                            <select id="qaInverterType" style="width: 100%; padding: 12px; border-radius: 8px; border: 1px solid var(--border-glass); background: transparent; color: var(--text-main); outline: none; font-family: inherit; font-size: 14px;">
                                <option value="">Select</option>
                                <option value="Inverter">Inverter</option>
                                <option value="Non-Inverter">Non-Inverter</option>
                            </select>
                        </div>

                        <div style="grid-column: span 2; display: flex; justify-content: flex-end; gap: 12px; margin-top: 8px;">
                            <button type="button" onclick="document.getElementById('addAcModal').style.display='none'" style="padding: 10px 20px; border-radius: 8px; border: 1px solid var(--border-glass); background: transparent; color: var(--text-main); cursor: pointer; font-weight: 600;">Cancel</button>
                            <button type="button" id="qaSaveAcBtn" onclick="window.ServiceForm.saveAcUnit(event)" style="padding: 10px 20px; border-radius: 8px; border: none; background: var(--primary); color: white; cursor: pointer; font-weight: 600;">Save AC Unit</button>
                        </div>
                    </div>
                </div>
            </div>
        `;

        container.innerHTML = window.renderLayout(content);

        setTimeout(() => {
            if (window.Choices) {
                window.acChoices = new Choices(document.getElementById('acSelect'), {
                    searchEnabled: true,
                    itemSelectText: '',
                    shouldSort: false
                });
                
                window.customerChoices = new Choices(document.getElementById('qaCustomer'), {
                    searchEnabled: true,
                    itemSelectText: '',
                    shouldSort: false
                });
            }
        }, 100);
    },

    loadAcCode: async () => {
        try {
            const res = await window.api.get('/ac-units/next-code');
            if (res.success) {
                document.getElementById('qaAcCode').value = res.code;
            }
        } catch (e) { }
    },

    saveAcUnit: async (e) => {
        e.preventDefault();
        const btn = document.getElementById('qaSaveAcBtn');
        btn.disabled = true;
        btn.innerText = 'Saving...';

        ['qaCustomer', 'qaAcCode'].forEach(id => {
            const el = document.getElementById(id);
            if(el) el.style.borderColor = 'var(--border-glass)';
            const errDiv = document.getElementById('err_' + id);
            if (errDiv) {
                errDiv.style.display = 'none';
                errDiv.innerText = '';
            }
        });

        const payload = {
            customer_id: document.getElementById('qaCustomer').value,
            ac_code: document.getElementById('qaAcCode').value,
            brand: document.getElementById('qaBrand').value,
            model: document.getElementById('qaModel').value,
            serial_number: document.getElementById('qaSerialNumber').value,
            capacity: document.getElementById('qaCapacity').value,
            ac_type: document.getElementById('qaAcType').value,
            inverter_type: document.getElementById('qaInverterType').value,
            status: 'active'
        };

        try {
            const res = await window.api.post('/ac-units', payload);
            if (res.success) {
                window.showToast('AC Unit created successfully!', 'success');
                document.getElementById('addAcModal').style.display = 'none';

                // Reload AC options
                const acRes = await window.api.get('/ac-units?per_page=1000');
                if (acRes.success) {
                    const acUnits = acRes.data?.data || acRes.data || [];
                    
                    if (window.acChoices) {
                        window.acChoices.destroy();
                    }
                    
                    const select = document.getElementById('acSelect');
                    select.innerHTML = '<option value="">Select AC Unit</option>' + acUnits.map(ac =>
                        `<option value="${ac.id}">${ac.ac_code} - ${ac.customer ? ac.customer.full_name : ''}</option>`
                    ).join('');

                    if (res.data?.id) {
                        select.value = res.data.id;
                    }
                    
                    if (window.Choices) {
                        window.acChoices = new Choices(select, {
                            searchEnabled: true,
                            itemSelectText: '',
                            shouldSort: false
                        });
                    }
                }
            } else {
                if (res.errors) {
                    const fieldMap = {
                        'customer_id': 'qaCustomer',
                        'ac_code': 'qaAcCode'
                    };
                    for (const [key, messages] of Object.entries(res.errors)) {
                        if (fieldMap[key]) {
                            document.getElementById(fieldMap[key]).style.borderColor = '#ef4444';
                            const errDiv = document.getElementById('err_' + fieldMap[key]);
                            if (errDiv) {
                                errDiv.innerText = messages[0];
                                errDiv.style.display = 'block';
                            }
                        }
                    }
                } else {
                    window.showToast(res.message || 'Error saving AC Unit', 'error');
                }
            }
        } catch (err) {
            window.showToast('Failed to save AC Unit', 'error');
        } finally {
            btn.disabled = false;
            btn.innerText = 'Save AC Unit';
        }
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
                } else {
                    window.showToast(res.message || 'Error saving maintenance record', 'error');
                }
            }
        } catch (err) {
            window.showToast('Failed to save maintenance record', 'error');
            console.error(err);
        }
    }
};
