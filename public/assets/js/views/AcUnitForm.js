window.AcUnitForm = {
    render: async (container) => {
        const urlSegments = window.location.pathname.split('/');
        const isEdit = urlSegments.includes('edit');
        const acId = isEdit ? urlSegments[urlSegments.length - 1] : null;

        let ac = {};
        let customers = [];

        // Load customers for dropdown
        try {
            const custRes = await window.api.get('/customers?per_page=100');
            if (custRes.success) {
                customers = custRes.data?.data || custRes.data || [];
            }
        } catch (e) {
            console.error("Failed to load customers", e);
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
        }

        const customerOptions = customers.map(c =>
            `<option value="${c.id}" ${ac.customer_id == c.id ? 'selected' : ''}>${c.full_name} (${c.mobile})</option>`
        ).join('');

        const content = `
            <div>
                <div class="table-header-row" style="display: flex; justify-content: space-between; align-items: center; margin: 0 auto 24px auto;">
                    <div>
                        <h1 style="font-size: 24px; color: #0f172a; margin-bottom: 4px;">${isEdit ? 'Edit AC Unit' : 'Add New AC Unit'}</h1>
                        <p style="color: #64748b; font-size: 14px;">Fill in the details below to ${isEdit ? 'update the' : 'register a new'} air conditioning unit.</p>
                    </div>
                    <div>
                        <button onclick="window.history.back()" style="display: flex; align-items: center; gap: 8px; padding: 8px 16px; background: transparent; color: #0f172a; border: 1px solid #e2e8f0; border-radius: 8px; cursor: pointer; font-weight: 600; font-size: 14px;">
                            <i class="fa-solid fa-arrow-left"></i> <span class="hide-on-mobile">Back</span>
                        </button>
                    </div>
                </div>

                <div class="glass-panel" style="background: #ffffff; padding: 32px; border-radius: 12px; margin: 0 auto;">

                <form id="acForm" onsubmit="window.AcUnitForm.save(event, ${isEdit}, ${acId})" style="display: grid; grid-template-columns: 1fr 1fr; gap: 24px;">
                    
                    <!-- Basic Details -->
                    <div style="grid-column: span 2;">
                        <h3 style="font-size: 16px; color: #0f172a; border-bottom: 1px solid #e2e8f0; padding-bottom: 8px; margin-bottom: 16px;">Basic Details</h3>
                    </div>

                    <div class="form-group" style="display: flex; flex-direction: column; gap: 8px;">
                        <label style="font-weight: 500; font-size: 14px; color: #334155;">Customer <span style="color: red;">*</span></label>
                        <select name="customer_id" required style="width: 100%; padding: 12px; border-radius: 8px; border: 1px solid var(--border-glass); background: transparent; color: var(--text-main); outline: none; font-family: inherit; font-size: 14px;">
                            <option value="">Select Customer</option>
                            ${customerOptions}
                        </select>
                    </div>

                    <div class="form-group" style="display: flex; flex-direction: column; gap: 8px;">
                        <label style="font-weight: 500; font-size: 14px; color: #334155;">AC Code <span style="color: red;">*</span></label>
                        <input type="text" id="acCode" name="ac_code" value="${ac.ac_code || dynamicCode}" required readonly style="width: 100%; padding: 12px; border-radius: 8px; border: 1px solid var(--border-glass); background: rgba(0,0,0,0.05); color: var(--text-muted); outline: none; font-family: inherit; font-size: 14px; cursor: not-allowed;">
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
                        <label style="font-weight: 500; font-size: 14px; color: #334155;">AC Type</label>
                        <select name="ac_type" style="width: 100%; padding: 12px; border-radius: 8px; border: 1px solid var(--border-glass); background: transparent; color: var(--text-main); outline: none; font-family: inherit; font-size: 14px;">
                            <option value="">Select Type</option>
                            <option value="Split" ${ac.ac_type === 'Split' ? 'selected' : ''}>Split</option>
                            <option value="Window" ${ac.ac_type === 'Window' ? 'selected' : ''}>Window</option>
                            <option value="Cassette" ${ac.ac_type === 'Cassette' ? 'selected' : ''}>Cassette</option>
                            <option value="Tower" ${ac.ac_type === 'Tower' ? 'selected' : ''}>Tower</option>
                        </select>
                    </div>

                    <div class="form-group" style="display: flex; flex-direction: column; gap: 8px;">
                        <label style="font-weight: 500; font-size: 14px; color: #334155;">Inverter Type</label>
                        <select name="inverter_type" style="width: 100%; padding: 12px; border-radius: 8px; border: 1px solid var(--border-glass); background: transparent; color: var(--text-main); outline: none; font-family: inherit; font-size: 14px;">
                            <option value="">Select</option>
                            <option value="Inverter" ${ac.inverter_type === 'Inverter' ? 'selected' : ''}>Inverter</option>
                            <option value="Non-Inverter" ${ac.inverter_type === 'Non-Inverter' ? 'selected' : ''}>Non-Inverter</option>
                        </select>
                    </div>

                    <!-- Installation & Warranty -->
                    <div style="grid-column: span 2; margin-top: 16px;">
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

                    <div class="form-group" style="display: flex; flex-direction: column; gap: 8px; grid-column: span 2;">
                        <label style="font-weight: 500; font-size: 14px; color: #334155;">Notes</label>
                        <textarea name="notes" rows="3" style="width: 100%; padding: 12px; border-radius: 8px; border: 1px solid var(--border-glass); background: transparent; color: var(--text-main); outline: none; font-family: inherit; resize: vertical;">${ac.notes || ''}</textarea>
                    </div>

                    <div style="grid-column: span 2; display: flex; justify-content: flex-end; gap: 16px; margin-top: 24px; border-top: 1px solid var(--border-glass); padding-top: 24px;">
                        <button type="button" onclick="window.history.back()" style="padding: 12px 24px; border-radius: 8px; border: 1px solid var(--border-glass); background: transparent; color: var(--text-main); cursor: pointer; font-weight: 600;">Cancel</button>
                        <button type="submit" style="padding: 12px 24px; border-radius: 8px; border: none; background: var(--primary); color: white; cursor: pointer; font-weight: 600; box-shadow: 0 4px 12px var(--primary-glow);">
                            ${isEdit ? 'Save Changes' : 'Add AC Unit'}
                        </button>
                    </div>
                </form>
            </div>
        `;

        container.innerHTML = window.renderLayout(content);
    },

    save: async (e, isEdit, id) => {
        e.preventDefault();
        const form = e.target;
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());

        try {
            const res = isEdit
                ? await window.api.put(`/ac-units/${id}`, data)
                : await window.api.post('/ac-units', data);

            if (res.success) {
                window.showToast(`AC Unit ${isEdit ? 'updated' : 'added'} successfully!`, 'success');
                window.router.navigate('/ac-units');
            } else {
                window.showToast(res.message || 'Error saving AC Unit', 'error');
            }
        } catch (err) {
            window.showToast('Failed to save AC Unit', 'error');
            console.error(err);
        }
    }
};
