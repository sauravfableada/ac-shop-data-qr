window.AcUnitForm = {
    render: async (container) => {
        const urlSegments = window.location.pathname.split('/');
        const isEdit = urlSegments.includes('edit');
        const acId = isEdit ? urlSegments[urlSegments.length - 1] : null;

        let ac = {};
        let customers = [];

        let acTypes = [];
        let inverterTypes = [];

        try {
            const [custRes, acTypeRes, invTypeRes] = await Promise.all([
                window.api.get('/customers?per_page=100'),
                window.api.get('/masters?type=ac_type&status=active'),
                window.api.get('/masters?type=inverter_type&status=active')
            ]);
            
            if (custRes.success) customers = custRes.data?.data || custRes.data || [];
            if (acTypeRes.success) acTypes = acTypeRes.data || [];
            if (invTypeRes.success) inverterTypes = invTypeRes.data || [];
        } catch (e) {
            console.error("Failed to load dependencies", e);
        }

        let dynamicCode = '';

        if (isEdit) {
            try {
                const res = await window.api.get(`/ac-units/${acId}`);
                if (res.success) {
                    ac = res.data;
                }
            } catch (e) {
                window.showToast("Failed to load AC unit", "error");
            }
        } else {
            try {
                const codeRes = await window.api.get('/ac-units/next-code');
                if (codeRes.success) {
                    dynamicCode = codeRes.code;
                }
            } catch (e) { }
            
            // Check for customer_id in URL to auto-select
            const urlParams = new URLSearchParams(window.location.search);
            if (urlParams.has('customer_id')) {
                ac.customer_id = urlParams.get('customer_id');
            }
        }

        const customerOptions = customers.map(c =>
            `<option value="${c.id}" ${ac.customer_id == c.id ? 'selected' : ''}>${c.full_name} (${c.mobile})</option>`
        ).join('');

        const acTypeOptions = acTypes.map(m =>
            `<option value="${m.name}" ${ac.ac_type === m.name ? 'selected' : ''}>${m.name}</option>`
        ).join('');

        const invTypeOptions = inverterTypes.map(m =>
            `<option value="${m.name}" ${ac.inverter_type === m.name ? 'selected' : ''}>${m.name}</option>`
        ).join('');

        const content = `
            <div>
                <div class="table-header-row" style="display: flex; justify-content: space-between; align-items: center; margin: 0 auto 24px auto;">
                    <div>
                        <h1 style="font-size: 24px; color: #0f172a; margin-bottom: 4px;">${isEdit ? 'Edit AC Unit' : 'Add New AC Unit'}</h1>
                        
                    </div>
                    <div>
                        <button onclick="window.history.back()" style="display: flex; align-items: center; gap: 8px; padding: 8px 16px; background: transparent; color: #0f172a; border: 1px solid #e2e8f0; border-radius: 8px; cursor: pointer; font-weight: 600; font-size: 14px;">
                            <i class="fa-solid fa-arrow-left"></i> <span class="hide-on-mobile">Back</span>
                        </button>
                    </div>
                </div>

                <div class="glass-panel" style="background: #ffffff; padding: 32px; border-radius: 12px; margin: 0 auto;">

                <form id="acForm" onsubmit="window.AcUnitForm.save(event, ${isEdit}, ${acId})" novalidate>
                    
                    <!-- STEP 1: Basic Details -->
                    <div id="acMainStep1" class="grid-2-col">
                        <div style="grid-column: 1 / -1; width: 100%;">
                            <h3 style="font-size: 16px; color: #0f172a; border-bottom: 1px solid #e2e8f0; padding-bottom: 8px; margin-bottom: 16px;">Basic Details</h3>
                        </div>

                    <div class="form-group" style="display: flex; flex-direction: column; gap: 8px;">
                        <div style="display: flex; justify-content: space-between; align-items: center;">
                            <label style="font-weight: 500; font-size: 14px; color: #334155;">Customer <span style="color: red;">*</span></label>
                            <button type="button" onclick="document.getElementById('addCustomerModal').style.display='flex'; window.AcUnitForm.loadCustomerCode();" style="background: #0f172a; color: white; border: none; border-radius: 4px; padding: 4px 8px; font-size: 12px; cursor: pointer;"><i class="fa-solid fa-plus"></i> Add New</button>
                        </div>
                        <select id="customerSelect" name="customer_id" required style="width: 100%; padding: 12px; border-radius: 8px; border: 1px solid var(--border-glass); background: transparent; color: var(--text-main); outline: none; font-family: inherit; font-size: 14px;">
                            <option value="">Select Customer</option>
                            ${customerOptions}
                        </select>
                        <div id="err_customer_id" style="color: #ef4444; font-size: 12px; margin-top: 4px; display: none;"></div>
                    </div>

                    <div class="form-group" style="display: flex; flex-direction: column; gap: 8px;">
                        <label style="font-weight: 500; font-size: 14px; color: #334155;">AC Code <span style="color: red;">*</span></label>
                        <input type="text" id="acCode" name="ac_code" value="${ac.ac_code || dynamicCode}" required style="width: 100%; padding: 12px; border-radius: 8px; border: 1px solid var(--border-glass); background: transparent; color: var(--text-main); outline: none; font-family: inherit; font-size: 14px;">
                        <div id="err_ac_code" style="color: #ef4444; font-size: 12px; margin-top: 4px; display: none;"></div>
                    </div>

                    <div class="form-group" style="display: flex; flex-direction: column; gap: 8px;">
                        <label style="font-weight: 500; font-size: 14px; color: #334155;">Brand</label>
                        <input type="text" name="brand" value="${ac.brand || ''}" placeholder="e.g. Daikin, LG" style="width: 100%; padding: 12px; border-radius: 8px; border: 1px solid var(--border-glass); background: transparent; color: var(--text-main); outline: none; font-family: inherit; font-size: 14px;">
                    </div>

                    <div class="form-group" style="display: flex; flex-direction: column; gap: 8px;">
                        <label style="font-weight: 500; font-size: 14px; color: #334155;">Model</label>
                        <input type="text" name="model" value="${ac.model || ''}" style="width: 100%; padding: 12px; border-radius: 8px; border: 1px solid var(--border-glass); background: transparent; color: var(--text-main); outline: none; font-family: inherit; font-size: 14px;">
                    </div>

                    <div class="form-group" style="display: flex; flex-direction: column; gap: 8px;">
                        <label style="font-weight: 500; font-size: 14px; color: #334155;">Serial Number</label>
                        <input type="text" name="serial_number" value="${ac.serial_number || ''}" style="width: 100%; padding: 12px; border-radius: 8px; border: 1px solid var(--border-glass); background: transparent; color: var(--text-main); outline: none; font-family: inherit; font-size: 14px;">
                    </div>

                    <div class="form-group" style="display: flex; flex-direction: column; gap: 8px;">
                        <label style="font-weight: 500; font-size: 14px; color: #334155;">Capacity</label>
                        <input type="text" name="capacity" value="${ac.capacity || ''}" placeholder="e.g. 1.5 Ton" style="width: 100%; padding: 12px; border-radius: 8px; border: 1px solid var(--border-glass); background: transparent; color: var(--text-main); outline: none; font-family: inherit; font-size: 14px;">
                    </div>

                    <div class="form-group" style="display: flex; flex-direction: column; gap: 8px;">
                        <div style="display: flex; justify-content: space-between; align-items: center;">
                            <label style="font-weight: 500; font-size: 14px; color: #334155;">AC Type</label>
                            <button type="button" onclick="window.AcUnitForm.openMasterModal('ac_type')" style="background: #0f172a; color: white; border: none; border-radius: 4px; padding: 4px 8px; font-size: 12px; cursor: pointer;"><i class="fa-solid fa-plus"></i> Add New</button>
                        </div>
                        <select name="ac_type" style="width: 100%; padding: 12px; border-radius: 8px; border: 1px solid var(--border-glass); background: transparent; color: var(--text-main); outline: none; font-family: inherit; font-size: 14px;">
                            <option value="">Select Type</option>
                            ${acTypeOptions}
                        </select>
                    </div>

                    <div class="form-group" style="display: flex; flex-direction: column; gap: 8px;">
                        <div style="display: flex; justify-content: space-between; align-items: center;">
                            <label style="font-weight: 500; font-size: 14px; color: #334155;">Inverter Type</label>
                            <button type="button" onclick="window.AcUnitForm.openMasterModal('inverter_type')" style="background: #0f172a; color: white; border: none; border-radius: 4px; padding: 4px 8px; font-size: 12px; cursor: pointer;"><i class="fa-solid fa-plus"></i> Add New</button>
                        </div>
                        <select name="inverter_type" style="width: 100%; padding: 12px; border-radius: 8px; border: 1px solid var(--border-glass); background: transparent; color: var(--text-main); outline: none; font-family: inherit; font-size: 14px;">
                            <option value="">Select</option>
                            ${invTypeOptions}
                        </select>
                    </div>

                    <div class="hide-on-desktop" style="grid-column: 1 / -1; display: flex; justify-content: flex-end; gap: 16px; margin-top: 24px; border-top: 1px solid var(--border-glass); padding-top: 24px;">
                        <button type="button" onclick="window.history.back()" style="padding: 12px 24px; border-radius: 8px; border: 1px solid var(--border-glass); background: transparent; color: var(--text-main); cursor: pointer; font-weight: 600;">Cancel</button>
                        <button type="button" onclick="window.AcUnitForm.nextStep()" style="padding: 12px 24px; border-radius: 8px; border: none; background: #ff9f43; color: white; cursor: pointer; font-weight: 600; display: flex; align-items: center; gap: 8px;">Next Step <i class="fa-solid fa-arrow-right"></i></button>
                    </div>
                </div> <!-- End Step 1 -->

                <!-- STEP 2: Installation & Warranty -->
                <div id="acMainStep2" style="display: none;">
                    <div class="grid-2-col">
                        <div style="grid-column: 1 / -1; margin-top: 16px; width: 100%;">
                            <h3 style="font-size: 16px; color: #0f172a; border-bottom: 1px solid #e2e8f0; padding-bottom: 8px; margin-bottom: 16px;">Installation & Warranty</h3>
                        </div>
                        
                        <div class="form-group" style="display: flex; flex-direction: column; gap: 8px;">
                            <label style="font-weight: 500; font-size: 14px; color: #334155;">Installation Date</label>
                            <input type="date" name="installation_date" value="${ac.installation_date ? ac.installation_date.split('T')[0] : ''}" style="width: 100%; padding: 12px; border-radius: 8px; border: 1px solid var(--border-glass); background: transparent; color: var(--text-main); outline: none; font-family: inherit; font-size: 14px;">
                        </div>

                        <div class="form-group" style="display: flex; flex-direction: column; gap: 8px;">
                            <label style="font-weight: 500; font-size: 14px; color: #334155;">Installation Location / Room</label>
                            <input type="text" name="room" value="${ac.room || ''}" placeholder="e.g. Master Bedroom" style="width: 100%; padding: 12px; border-radius: 8px; border: 1px solid var(--border-glass); background: transparent; color: var(--text-main); outline: none; font-family: inherit; font-size: 14px;">
                        </div>

                        <div class="form-group" style="display: flex; flex-direction: column; gap: 8px;">
                            <label style="font-weight: 500; font-size: 14px; color: #334155;">Status</label>
                            <select name="status" style="width: 100%; padding: 12px; border-radius: 8px; border: 1px solid var(--border-glass); background: transparent; color: var(--text-main); outline: none; font-family: inherit; font-size: 14px;">
                                <option value="active" ${ac.status === 'active' ? 'selected' : ''}>Active</option>
                                <option value="inactive" ${ac.status === 'inactive' ? 'selected' : ''}>Inactive</option>
                            </select>
                        </div>

                        <div class="form-group" style="display: flex; flex-direction: column; gap: 8px; grid-column: 1 / -1;">
                            <label style="font-weight: 500; font-size: 14px; color: #334155;">Notes</label>
                            <textarea name="notes" rows="3" style="width: 100%; padding: 12px; border-radius: 8px; border: 1px solid var(--border-glass); background: transparent; color: var(--text-main); outline: none; font-family: inherit; resize: vertical;">${ac.notes || ''}</textarea>
                        </div>

                        <div style="grid-column: 1 / -1; display: flex; justify-content: flex-end; gap: 16px; margin-top: 24px; border-top: 1px solid var(--border-glass); padding-top: 24px;">
                            <button type="button" onclick="window.history.back()" class="hide-on-mobile" style="padding: 12px 24px; border-radius: 8px; border: 1px solid var(--border-glass); background: transparent; color: var(--text-main); cursor: pointer; font-weight: 600;">Cancel</button>
                            <button type="button" onclick="window.AcUnitForm.prevStep()" class="hide-on-desktop" style="padding: 12px 24px; border-radius: 8px; border: 1px solid var(--border-glass); background: transparent; color: var(--text-main); cursor: pointer; font-weight: 600;"><i class="fa-solid fa-arrow-left"></i> Previous</button>
                            <button type="submit" style="padding: 12px 24px; border-radius: 8px; border: none; background: #ff9f43; color: white; cursor: pointer; font-weight: 600; box-shadow: 0 4px 12px rgba(255,159,67,0.3);">
                                ${isEdit ? 'Save Changes' : 'Add AC Unit'}
                            </button>
                        </div>
                    </div>
                </div> <!-- End Step 2 -->
                </form>
            </div>

            <!-- Customer Modal -->
            <div id="addCustomerModal" style="display: none; position: fixed; inset: 0; background: rgba(0,0,0,0.5); z-index: 1000; align-items: center; justify-content: center; backdrop-filter: blur(4px);">
                <div style="background: #ffffff; padding: 24px; border-radius: 12px; width: 90%; max-width: 400px; box-shadow: 0 10px 25px rgba(0,0,0,0.1);">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
                        <h3 style="margin: 0; font-size: 18px; color: #0f172a;">Quick Add Customer</h3>
                        <button onclick="document.getElementById('addCustomerModal').style.display='none'" style="background: none; border: none; font-size: 20px; cursor: pointer; color: #64748b;">&times;</button>
                    </div>
                    <form id="quickCustomerForm" onsubmit="window.AcUnitForm.saveCustomer(event)" novalidate>
                        <div style="margin-bottom: 16px;">
                            <label style="display: block; margin-bottom: 8px; font-size: 14px; font-weight: 500;">Customer Code *</label>
                            <input type="text" id="qcCode" required style="width: 100%; padding: 10px; border-radius: 8px; border: 1px solid var(--border-glass); background: transparent; color: var(--text-main); outline: none;">
                            <div id="err_qcCode" style="color: #ef4444; font-size: 12px; margin-top: 4px; display: none;"></div>
                        </div>
                        <div style="margin-bottom: 16px;">
                            <label style="display: block; margin-bottom: 8px; font-size: 14px; font-weight: 500;">Full Name *</label>
                            <input type="text" id="qcName" required style="width: 100%; padding: 10px; border-radius: 8px; border: 1px solid var(--border-glass); background: transparent; color: var(--text-main); outline: none;">
                            <div id="err_qcName" style="color: #ef4444; font-size: 12px; margin-top: 4px; display: none;"></div>
                        </div>
                        <div style="margin-bottom: 24px;">
                            <label style="display: block; margin-bottom: 8px; font-size: 14px; font-weight: 500;">Mobile *</label>
                            <input type="text" id="qcMobile" required style="width: 100%; padding: 10px; border-radius: 8px; border: 1px solid var(--border-glass); background: transparent; color: var(--text-main); outline: none;">
                            <div id="err_qcMobile" style="color: #ef4444; font-size: 12px; margin-top: 4px; display: none;"></div>
                        </div>
                        <div style="display: flex; justify-content: flex-end; gap: 12px;">
                            <button type="button" onclick="document.getElementById('addCustomerModal').style.display='none'" style="padding: 10px 16px; border-radius: 8px; border: 1px solid var(--border-glass); background: transparent; cursor: pointer; color: var(--text-main); font-weight: 600;">Cancel</button>
                            <button type="submit" id="qcSaveBtn" style="padding: 10px 16px; border-radius: 8px; border: none; background: var(--primary); color: white; cursor: pointer; font-weight: 600;">Save</button>
                        </div>
                    </form>
                </div>
            </div> <!-- End Customer Modal -->

            <!-- Generic Master Quick Add Modal -->
            <div id="addMasterModal" style="display: none; position: fixed; inset: 0; background: rgba(0,0,0,0.5); z-index: 1001; align-items: center; justify-content: center; backdrop-filter: blur(4px);">
                    <div style="background: #ffffff; padding: 24px; border-radius: 12px; width: 90%; max-width: 400px; box-shadow: 0 10px 25px rgba(0,0,0,0.1);">
                        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
                            <h3 id="masterModalTitle" style="margin: 0; font-size: 18px; color: #0f172a;">Add New Option</h3>
                            <button type="button" onclick="document.getElementById('addMasterModal').style.display='none'" style="background: none; border: none; font-size: 20px; cursor: pointer; color: #64748b;">&times;</button>
                        </div>
                        <div class="form-group" style="margin-bottom: 16px;">
                            <label style="font-weight: 500; font-size: 14px; color: #334155;">Option Name <span style="color: red;">*</span></label>
                            <input type="text" id="masterNewName" style="width: 100%; padding: 12px; border-radius: 8px; border: 1px solid var(--border-glass); background: transparent; color: var(--text-main); outline: none; font-family: inherit; font-size: 14px;">
                            <div id="err_masterNewName" style="color: #ef4444; font-size: 12px; margin-top: 4px; display: none;"></div>
                        </div>
                        <input type="hidden" id="masterNewType">
                        <div style="display: flex; justify-content: flex-end; gap: 12px; margin-top: 24px;">
                            <button type="button" onclick="document.getElementById('addMasterModal').style.display='none'" style="padding: 10px 20px; border-radius: 8px; border: 1px solid var(--border-glass); background: transparent; color: var(--text-main); cursor: pointer; font-weight: 600;">Cancel</button>
                            <button type="button" id="qaSaveMasterBtn" onclick="window.AcUnitForm.saveMaster()" style="padding: 10px 20px; border-radius: 8px; border: none; background: var(--primary); color: white; cursor: pointer; font-weight: 600;">Save Option</button>
                        </div>
                    </div>
                </div>

            </div>
        `;

        container.innerHTML = window.renderLayout(content);

        setTimeout(() => {
            if (window.Choices) {
                window.customerChoices = new Choices(document.getElementById('customerSelect'), {
                    searchEnabled: true,
                    itemSelectText: '',
                    shouldSort: false
                });
            }
        }, 100);
    },

    nextStep: () => {
        let valid = true;
        const custEl = document.getElementById('customerSelect');
        const codeEl = document.getElementById('acCode');
        
        ['customerSelect', 'acCode'].forEach(id => {
            document.getElementById('err_' + (id === 'customerSelect' ? 'customer_id' : 'ac_code')).style.display = 'none';
        });
        
        if (custEl.parentElement.querySelector('.choices')) {
            custEl.parentElement.querySelector('.choices').style.border = '1px solid var(--border-glass)';
        } else {
            custEl.style.borderColor = 'var(--border-glass)';
        }
        codeEl.style.borderColor = 'var(--border-glass)';

        if (!custEl.value) {
            if (custEl.parentElement.querySelector('.choices')) {
                custEl.parentElement.querySelector('.choices').style.border = '1px solid #ef4444';
            } else {
                custEl.style.borderColor = '#ef4444';
            }
            document.getElementById('err_customer_id').innerText = 'Customer is required.';
            document.getElementById('err_customer_id').style.display = 'block';
            valid = false;
        }

        if (!codeEl.value.trim()) {
            codeEl.style.borderColor = '#ef4444';
            document.getElementById('err_ac_code').innerText = 'AC Code is required.';
            document.getElementById('err_ac_code').style.display = 'block';
            valid = false;
        }

        if (!valid) return;

        document.getElementById('acMainStep1').style.display = 'none';
        document.getElementById('acMainStep2').style.display = 'block';
    },

    prevStep: () => {
        document.getElementById('acMainStep2').style.display = 'none';
        document.getElementById('acMainStep1').style.display = 'block';
    },

    loadCustomerCode: async () => {
        try {
            const res = await window.api.get('/customers/next-code');
            if (res.success) {
                document.getElementById('qcCode').value = res.code;
            }
        } catch (e) { }
    },

    saveCustomer: async (e) => {
        e.preventDefault();
        const btn = document.getElementById('qcSaveBtn');
        btn.disabled = true;
        btn.innerText = 'Saving...';

        // Clear errors
        ['qcCode', 'qcName', 'qcMobile'].forEach(id => {
            document.getElementById(id).style.borderColor = 'var(--border-glass)';
            const errDiv = document.getElementById('err_' + id);
            if (errDiv) {
                errDiv.style.display = 'none';
                errDiv.innerText = '';
            }
        });

        const payload = {
            customer_code: document.getElementById('qcCode').value,
            full_name: document.getElementById('qcName').value,
            mobile: document.getElementById('qcMobile').value,
            status: 'active'
        };

        try {
            const res = await window.api.post('/customers', payload);
            if (res.success) {
                const customerName = document.getElementById('qcName').value || 'Customer';
                if (window.addNotification) {
                    window.addNotification('Customer Created', `Customer "${customerName}" was successfully created.`, 'customer');
                }
                window.showToast('Customer created successfully!', 'success');
                document.getElementById('addCustomerModal').style.display = 'none';

                // Add to dropdown
                const select = document.getElementById('customerSelect');
                const custRes = await window.api.get('/customers?per_page=100');
                if (custRes.success) {
                    const customers = custRes.data?.data || custRes.data || [];
                    
                    if (window.customerChoices) {
                        window.customerChoices.destroy();
                    }
                    
                    select.innerHTML = '<option value="">Select Customer</option>' + customers.map(c =>
                        `<option value="${c.id}">${c.full_name} (${c.mobile})</option>`
                    ).join('');

                    if (res.data?.id) {
                        select.value = res.data.id;
                    }
                    
                    if (window.Choices) {
                        window.customerChoices = new Choices(select, {
                            searchEnabled: true,
                            itemSelectText: '',
                            shouldSort: false
                        });
                    }
                }
            } else {
                if (res.errors) {
                    const fieldMap = {
                        'customer_code': 'qcCode',
                        'full_name': 'qcName',
                        'mobile': 'qcMobile'
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
                    window.showToast(res.message || 'Error saving customer', 'error');
                }
            }
        } catch (err) {
            window.showToast('Failed to save customer', 'error');
            console.error(err);
        }
        btn.disabled = false;
        btn.innerText = 'Save';
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
            if (!el.id.startsWith('err_qc')) {
                el.style.display = 'none';
                el.innerText = '';
            }
        });

        try {
            const res = isEdit
                ? await window.api.put(`/ac-units/${id}`, data)
                : await window.api.post('/ac-units', data);

            if (res.success) {
                const acCode = document.getElementById('acCode').value || '';
                if (window.addNotification) {
                    window.addNotification(
                        isEdit ? 'AC Unit Updated' : 'AC Unit Created',
                        `AC Unit "${acCode}" was successfully ${isEdit ? 'updated' : 'created'}.`,
                        'ac-unit'
                    );
                }
                window.showToast(`AC Unit ${isEdit ? 'updated' : 'added'} successfully!`, 'success');
                window.router.navigate('/ac-units');
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
                    window.showToast(res.message || 'Error saving AC Unit', 'error');
                }
            }
        } catch (err) {
            window.showToast('Failed to save AC Unit', 'error');
            console.error(err);
        }
        btn.disabled = false;
        btn.innerText = "Save";
    },

    saveMaster: async () => {
            const type = document.getElementById('masterNewType').value;
            const name = document.getElementById('masterNewName').value.trim();
            const errEl = document.getElementById('err_masterNewName');
            const btn = document.getElementById('qaSaveMasterBtn');

            if (!name) {
                errEl.innerText = "Name is required";
                errEl.style.display = 'block';
                return;
            }
            errEl.style.display = 'none';
            btn.disabled = true;
            btn.innerText = "Saving...";

            try {
                const res = await window.api.post('/masters', { type, name, status: 'active' });
                if (res.success) {
                    window.showToast("Option added successfully", "success");
                    document.getElementById('addMasterModal').style.display = 'none';
                    
                    // Add to dropdown and select it
                    const selectEl = document.querySelector(`select[name="${type}"]`);
                    if (selectEl) {
                        const newOption = new Option(name, name, true, true);
                        selectEl.add(newOption);
                    }
                } else {
                    if (res.errors && res.errors.name) {
                        errEl.innerText = res.errors.name[0];
                        errEl.style.display = 'block';
                    } else {
                        window.showToast(res.message || "Error saving option", "error");
                    }
                }
            } catch (e) {
                window.showToast("An error occurred", "error");
            }
            btn.disabled = false;
            btn.innerText = "Save Option";
        },

        openMasterModal: (type) => {
            try {
                document.getElementById('masterNewType').value = type;
                document.getElementById('masterNewName').value = '';
                document.getElementById('err_masterNewName').style.display = 'none';
                document.getElementById('masterModalTitle').innerText = type === 'ac_type' ? 'Add AC Type' : 'Add Inverter Type';
                document.getElementById('addMasterModal').style.display = 'flex';
            } catch (e) {
                alert("Error in openMasterModal: " + e.message);
                console.error(e);
            }
        }
};
