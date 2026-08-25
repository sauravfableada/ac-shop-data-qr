window.ServiceForm = {
    render: async (container) => {
        const urlParams = new URLSearchParams(window.location.search);
        const acIdQuery = urlParams.get('ac_id');
        const customerIdQuery = urlParams.get('customer_id');

        const urlSegments = window.location.pathname.split('/');
        const isEdit = urlSegments.includes('edit');
        const serviceId = isEdit ? urlSegments[urlSegments.length - 1] : null;

        let service = {};
        let acUnits = [];

        let serviceTypes = [];
        let acTypes = [];
        let inverterTypes = [];

        try {
            const [acRes, stRes, atRes, itRes] = await Promise.all([
                window.api.get('/ac-units?per_page=1000'),
                window.api.get('/masters?type=service_type&status=active'),
                window.api.get('/masters?type=ac_type&status=active'),
                window.api.get('/masters?type=inverter_type&status=active')
            ]);
            
            if (acRes.success) {
                acUnits = acRes.data?.data || acRes.data || [];
                if (customerIdQuery) {
                    acUnits = acUnits.filter(ac => String(ac.customer_id) === String(customerIdQuery));
                }
            }
            
            if (stRes.success) serviceTypes = stRes.data || [];
            if (atRes.success) acTypes = atRes.data || [];
            if (itRes.success) inverterTypes = itRes.data || [];
        } catch (e) {
            console.error("Failed to load AC units or masters", e);
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
        } else if (customerIdQuery && acUnits.length === 1) {
            service.ac_unit_id = acUnits[0].id;
        }

        const acOptions = acUnits.map(ac =>
            `<option value="${ac.id}" ${service.ac_unit_id == ac.id ? 'selected' : ''}>${ac.ac_code} - ${ac.customer ? ac.customer.full_name : ''}</option>`
        ).join('');

        const serviceTypeOptions = serviceTypes.map(m =>
            `<option value="${m.name}" ${service.service_type === m.name ? 'selected' : ''}>${m.name}</option>`
        ).join('');

        const acTypeOptions = acTypes.map(m =>
            `<option value="${m.name}">${m.name}</option>`
        ).join('');

        const invTypeOptions = inverterTypes.map(m =>
            `<option value="${m.name}">${m.name}</option>`
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

                <form id="serviceForm" onsubmit="window.ServiceForm.save(event, ${isEdit}, ${serviceId})" novalidate>
                    
                    <!-- STEP 1: Service Details -->
                    <div id="serviceMainStep1" class="grid-2-col">
                        <div style="grid-column: 1 / -1; width: 100%;">
                            <h3 style="font-size: 16px; color: #0f172a; border-bottom: 1px solid var(--border-glass); padding-bottom: 8px; margin-bottom: 16px;">Service Details</h3>
                        </div>

                        <div class="form-group" style="display: flex; flex-direction: column; gap: 8px;">
                            <div style="display: flex; justify-content: space-between; align-items: center;">
                                <label style="font-weight: 500; font-size: 14px; color: var(--text-main);">AC Unit <span style="color: red;">*</span></label>
                                <button type="button" onclick="document.getElementById('addAcModal').style.display='flex'; window.ServiceForm.loadAcCode();" style="background: #0f172a; color: white; border: none; border-radius: 4px; padding: 4px 8px; font-size: 12px; cursor: pointer;"><i class="fa-solid fa-plus"></i> Add New</button>
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
                            <div style="display: flex; justify-content: space-between; align-items: center;">
                                <label style="font-weight: 500; font-size: 14px; color: var(--text-main);">Service Type <span style="color: red;">*</span></label>
                                <button type="button" onclick="window.ServiceForm.openMasterModal('service_type')" style="background: #0f172a; color: white; border: none; border-radius: 4px; padding: 4px 8px; font-size: 12px; cursor: pointer;"><i class="fa-solid fa-plus"></i> Add New</button>
                            </div>
                            <select name="service_type" required style="width: 100%; padding: 12px; border-radius: 8px; border: 1px solid var(--border-glass); background: transparent; color: var(--text-main); outline: none; font-family: inherit; font-size: 14px;">
                                <option value="">Select Service Type</option>
                                ${serviceTypeOptions}
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

                        <div class="grid-2-col" style="grid-column: 1 / -1;">
                            <div class="form-group" style="display: flex; flex-direction: column; gap: 8px;">
                                <label style="font-weight: 500; font-size: 14px; color: var(--text-main);">Customer Complaint / Issue</label>
                                <textarea name="complaint" rows="3" placeholder="What is the issue reported by the customer?" style="width: 100%; padding: 12px; border-radius: 8px; border: 1px solid var(--border-glass); background: transparent; color: var(--text-main); outline: none; font-family: inherit; resize: vertical;">${service.complaint || ''}</textarea>
                            </div>

                            <div class="form-group" style="display: flex; flex-direction: column; gap: 8px;">
                                <label style="font-weight: 500; font-size: 14px; color: var(--text-main);">Diagnosis & Work Done</label>
                                <textarea name="work_done" rows="3" placeholder="Describe the work performed..." style="width: 100%; padding: 12px; border-radius: 8px; border: 1px solid var(--border-glass); background: transparent; color: var(--text-main); outline: none; font-family: inherit; resize: vertical;">${service.work_done || ''}</textarea>
                            </div>
                        </div>

                        <div class="hide-on-desktop" style="grid-column: 1 / -1; display: flex; justify-content: flex-end; gap: 16px; margin-top: 24px; border-top: 1px solid var(--border-glass); padding-top: 24px;">
                            <button type="button" onclick="window.history.back()" style="padding: 12px 24px; border-radius: 8px; border: 1px solid var(--border-glass); background: transparent; color: var(--text-main); cursor: pointer; font-weight: 600;">Cancel</button>
                            <button type="button" onclick="window.ServiceForm.nextStep()" style="padding: 12px 24px; border-radius: 8px; border: none; background: #ff9f43; color: white; cursor: pointer; font-weight: 600; display: flex; align-items: center; gap: 8px;">Next Step <i class="fa-solid fa-arrow-right"></i></button>
                        </div>
                    </div> <!-- End Step 1 -->

                    <!-- STEP 2: Billing Details -->
                    <div id="serviceMainStep2" style="display: none;">
                        <div class="grid-2-col">
                            <div style="grid-column: 1 / -1; margin-top: 16px; width: 100%;">
                                <h3 style="font-size: 16px; color: #0f172a; border-bottom: 1px solid var(--border-glass); padding-bottom: 8px; margin-bottom: 16px;">Billing Details</h3>
                            </div>

                            <div class="form-group" style="display: flex; flex-direction: column; gap: 8px;">
                                <label style="font-weight: 500; font-size: 14px; color: var(--text-main);">Labor / Service Charge (₹)</label>
                                <input type="number" step="0.01" min="0" name="labor_charge" id="labor_charge" value="${service.labor_charge || '0.00'}" oninput="if(this.value<0)this.value=0; window.ServiceForm.calculateTotal()" style="width: 100%; padding: 12px; border-radius: 8px; border: 1px solid var(--border-glass); background: transparent; color: var(--text-main); outline: none; font-family: inherit; font-size: 14px;">
                            </div>

                            <div class="form-group" style="display: flex; flex-direction: column; gap: 8px;">
                                <label style="font-weight: 500; font-size: 14px; color: var(--text-main);">Spare Parts Charge (₹)</label>
                                <input type="number" step="0.01" min="0" name="parts_charge" id="parts_charge" value="${service.parts_charge || '0.00'}" oninput="if(this.value<0)this.value=0; window.ServiceForm.calculateTotal()" style="width: 100%; padding: 12px; border-radius: 8px; border: 1px solid var(--border-glass); background: transparent; color: var(--text-main); outline: none; font-family: inherit; font-size: 14px;">
                            </div>

                            <div class="form-group" style="display: flex; flex-direction: column; gap: 8px;">
                                <label style="font-weight: 500; font-size: 14px; color: var(--text-main);">Copper Pipe Miter</label>
                                <input type="number" step="0.01" min="0" name="copper_pipe_charge" id="copper_pipe_charge" value="${service.copper_pipe_charge || '0.00'}" oninput="if(this.value<0)this.value=0; window.ServiceForm.calculateTotal()" style="width: 100%; padding: 12px; border-radius: 8px; border: 1px solid var(--border-glass); background: transparent; color: var(--text-main); outline: none; font-family: inherit; font-size: 14px;">
                            </div>

                            <div class="form-group" style="display: flex; flex-direction: column; gap: 8px;">
                                <label style="font-weight: 500; font-size: 14px; color: var(--text-main);">Copper Pipe Miter Price (₹)</label>
                                <input type="number" step="0.01" min="0" name="miter_charge" id="miter_charge" value="${service.miter_charge || '0.00'}" oninput="if(this.value<0)this.value=0; window.ServiceForm.calculateTotal()" style="width: 100%; padding: 12px; border-radius: 8px; border: 1px solid var(--border-glass); background: transparent; color: var(--text-main); outline: none; font-family: inherit; font-size: 14px;">
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
                                <label style="font-weight: 500; font-size: 14px; color: var(--text-main);">Payment Type</label>
                                <select name="payment_method" style="width: 100%; padding: 12px; border-radius: 8px; border: 1px solid var(--border-glass); background: transparent; color: var(--text-main); outline: none; font-family: inherit; font-size: 14px;">
                                    <option value="">Pending</option>
                                    <option value="Cash" ${service.payment_method === 'Cash' ? 'selected' : ''}>Cash</option>
                                    <option value="Online" ${service.payment_method === 'Online' ? 'selected' : ''}>Online</option>
                                </select>
                            </div>

                            <div class="form-group" style="display: flex; flex-direction: column; gap: 8px;">
                                <label style="font-weight: 500; font-size: 14px; color: var(--text-main);">Next Maintenance Date</label>
                                <input type="date" name="next_maintenance_date" value="${service.next_maintenance_date ? service.next_maintenance_date.split('T')[0] : ''}" style="width: 100%; padding: 12px; border-radius: 8px; border: 1px solid var(--border-glass); background: transparent; color: var(--text-main); outline: none; font-family: inherit; font-size: 14px;">
                            </div>

                            <div style="grid-column: 1 / -1; display: flex; justify-content: flex-end; gap: 16px; margin-top: 24px; border-top: 1px solid var(--border-glass); padding-top: 24px;">
                                <button type="button" onclick="window.history.back()" class="hide-on-mobile" style="padding: 12px 24px; border-radius: 8px; border: 1px solid var(--border-glass); background: transparent; color: var(--text-main); cursor: pointer; font-weight: 600;">Cancel</button>
                                <button type="button" onclick="window.ServiceForm.prevStep()" class="hide-on-desktop" style="padding: 12px 24px; border-radius: 8px; border: 1px solid var(--border-glass); background: transparent; color: var(--text-main); cursor: pointer; font-weight: 600;"><i class="fa-solid fa-arrow-left"></i> Previous</button>
                                <button type="submit" style="padding: 12px 24px; border-radius: 8px; border: none; background: #ff9f43; color: white; cursor: pointer; font-weight: 600; box-shadow: 0 4px 12px rgba(255,159,67,0.3);">
                                    ${isEdit ? 'Save Changes' : 'Save Maintenance'}
                                </button>
                            </div>
                        </div>
                    </div> <!-- End Step 2 -->
                </form>
            </div>

            <!-- Add AC Modal -->
            <div id="addAcModal" style="display: none; position: fixed; inset: 0; background: rgba(15, 23, 42, 0.6); backdrop-filter: blur(4px); z-index: 1000; align-items: center; justify-content: center;">
                <div style="background: #ffffff; width: 100%; max-width: 700px; border-radius: 16px; padding: 32px; box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04); position: relative; max-height: 90vh; overflow-y: auto;">
                    <button type="button" onclick="document.getElementById('addAcModal').style.display='none'" style="position: absolute; top: 16px; right: 16px; background: transparent; border: none; font-size: 20px; color: #64748b; cursor: pointer;"><i class="fa-solid fa-xmark"></i></button>
                    <h3 style="font-size: 20px; color: #0f172a; margin-bottom: 24px;">Quick Add AC Unit</h3>
                    
                    <div class="grid-2-col">
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
                            <input type="text" id="qaAcCode" style="width: 100%; padding: 12px; border-radius: 8px; border: 1px solid var(--border-glass); background: transparent; color: var(--text-main); outline: none; font-family: inherit; font-size: 14px;">
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
                            <div style="display: flex; justify-content: space-between; align-items: center;">
                                <label style="font-weight: 500; font-size: 14px; color: #334155;">AC Type</label>
                                <button type="button" onclick="window.ServiceForm.openMasterModal('ac_type')" style="background: #0f172a; color: white; border: none; border-radius: 4px; padding: 4px 8px; font-size: 12px; cursor: pointer;"><i class="fa-solid fa-plus"></i> Add New</button>
                            </div>
                            <select id="qaAcType" style="width: 100%; padding: 12px; border-radius: 8px; border: 1px solid var(--border-glass); background: transparent; color: var(--text-main); outline: none; font-family: inherit; font-size: 14px;">
                                <option value="">Select Type</option>
                                ${acTypeOptions}
                            </select>
                        </div>

                        <div class="form-group" style="display: flex; flex-direction: column; gap: 8px;">
                            <div style="display: flex; justify-content: space-between; align-items: center;">
                                <label style="font-weight: 500; font-size: 14px; color: #334155;">Inverter Type</label>
                                <button type="button" onclick="window.ServiceForm.openMasterModal('inverter_type')" style="background: #0f172a; color: white; border: none; border-radius: 4px; padding: 4px 8px; font-size: 12px; cursor: pointer;"><i class="fa-solid fa-plus"></i> Add New</button>
                            </div>
                            <select id="qaInverterType" style="width: 100%; padding: 12px; border-radius: 8px; border: 1px solid var(--border-glass); background: transparent; color: var(--text-main); outline: none; font-family: inherit; font-size: 14px;">
                                <option value="">Select</option>
                                ${invTypeOptions}
                            </select>
                        </div>

                        <div style="grid-column: span 2; display: flex; justify-content: flex-end; gap: 12px; margin-top: 8px;">
                            <button type="button" onclick="document.getElementById('addAcModal').style.display='none'" style="padding: 10px 20px; border-radius: 8px; border: 1px solid var(--border-glass); background: transparent; color: var(--text-main); cursor: pointer; font-weight: 600;">Cancel</button>
                            <button type="button" id="qaSaveAcBtn" onclick="window.ServiceForm.saveAcUnit(event)" style="padding: 10px 20px; border-radius: 8px; border: none; background: var(--primary); color: white; cursor: pointer; font-weight: 600;">Save AC Unit</button>
                        </div>
                    </div>
                </div>
            </div> <!-- End Add AC Modal -->

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
                            <button type="button" id="qaSaveMasterBtn" onclick="window.ServiceForm.saveMaster()" style="padding: 10px 20px; border-radius: 8px; border: none; background: var(--primary); color: white; cursor: pointer; font-weight: 600;">Save Option</button>
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

    nextStep: () => {
        let valid = true;
        const acEl = document.getElementById('acSelect');
        const dateEl = document.querySelector('input[name="service_date"]');
        const typeEl = document.querySelector('select[name="service_type"]');
        
        ['acSelect', 'service_date', 'service_type'].forEach(id => {
            const errEl = document.getElementById('err_' + (id === 'acSelect' ? 'ac_unit_id' : id));
            if (errEl) errEl.style.display = 'none';
        });
        
        if (acEl.parentElement.querySelector('.choices')) {
            acEl.parentElement.querySelector('.choices').style.border = '1px solid var(--border-glass)';
        } else {
            acEl.style.borderColor = 'var(--border-glass)';
        }
        dateEl.style.borderColor = 'var(--border-glass)';
        typeEl.style.borderColor = 'var(--border-glass)';

        if (!acEl.value) {
            if (acEl.parentElement.querySelector('.choices')) {
                acEl.parentElement.querySelector('.choices').style.border = '1px solid #ef4444';
            } else {
                acEl.style.borderColor = '#ef4444';
            }
            document.getElementById('err_ac_unit_id').innerText = 'AC Unit is required.';
            document.getElementById('err_ac_unit_id').style.display = 'block';
            valid = false;
        }

        if (!dateEl.value) {
            dateEl.style.borderColor = '#ef4444';
            document.getElementById('err_service_date').innerText = 'Service date is required.';
            document.getElementById('err_service_date').style.display = 'block';
            valid = false;
        }

        if (!typeEl.value) {
            typeEl.style.borderColor = '#ef4444';
            document.getElementById('err_service_type').innerText = 'Service type is required.';
            document.getElementById('err_service_type').style.display = 'block';
            valid = false;
        }

        if (!valid) return;

        document.getElementById('serviceMainStep1').style.display = 'none';
        document.getElementById('serviceMainStep2').style.display = 'block';
    },

    prevStep: () => {
        document.getElementById('serviceMainStep2').style.display = 'none';
        document.getElementById('serviceMainStep1').style.display = 'block';
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
                const acCode = document.getElementById('qaAcCode').value || '';
                if (window.addNotification) {
                    window.addNotification('AC Unit Created', `AC Unit "${acCode}" was successfully created.`, 'ac-unit');
                }
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
        const copper_miter = parseFloat(document.getElementById('copper_pipe_charge').value) || 0;
        const miter_price = parseFloat(document.getElementById('miter_charge').value) || 0;

        const total = labor + parts + (copper_miter * miter_price);
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
                const serviceType = data.service_type || 'Maintenance';
                if (window.addNotification) {
                    window.addNotification(
                        isEdit ? 'Service Record Updated' : 'Service Record Created',
                        `Service record for "${serviceType}" was successfully ${isEdit ? 'updated' : 'created'}.`,
                        'service'
                    );
                }
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
        btn.disabled = false;
        btn.innerText = 'Save Service';
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
                    // Based on type, the select ID might be different
                    let selectEl;
                    if (type === 'service_type') selectEl = document.querySelector(`select[name="service_type"]`);
                    else if (type === 'ac_type') selectEl = document.getElementById('qaAcType');
                    else if (type === 'inverter_type') selectEl = document.getElementById('qaInverterType');

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
                let title = 'Add New Option';
                if (type === 'ac_type') title = 'Add AC Type';
                if (type === 'inverter_type') title = 'Add Inverter Type';
                if (type === 'service_type') title = 'Add Service Type';
                document.getElementById('masterModalTitle').innerText = title;
                document.getElementById('addMasterModal').style.display = 'flex';
            } catch (e) {
                alert("Error in openMasterModal: " + e.message);
                console.error(e);
            }
        }
};
