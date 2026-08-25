window.CustomerForm = {
    render: async (container, params = {}) => {
        let customer = null;
        let isEdit = !!params.id;

        let dynamicCode = '';

        if (isEdit) {
            const response = await window.api.get('/customers/' + params.id);
            if (response.success) {
                customer = response.data;
            } else {
                container.innerHTML = window.renderLayout(`<div class="glass-panel" style="padding: 24px;">Customer not found</div>`);
                return;
            }
        } else {
            const codeRes = await window.api.get('/customers/next-code');
            if (codeRes.success) {
                dynamicCode = codeRes.code;
            }
        }

        const title = isEdit ? 'Edit Customer' : 'Add New Customer';

        const content = `
            <div>
                <div class="table-header-row" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px;">
                    <div>
                        <h1 style="font-size: 24px; margin-bottom: 4px; color: #0f172a;">${title}</h1>
                        
                    </div>
                    <div>
                        <button onclick="window.router.navigate('/customers')" style="display: flex; align-items: center; gap: 8px; padding: 8px 16px; background: transparent; color: #0f172a; border: 1px solid #e2e8f0; border-radius: 8px; cursor: pointer; font-weight: 600; font-size: 14px;">
                            <i class="fa-solid fa-arrow-left"></i> <span class="hide-on-mobile">Back to List</span>
                        </button>
                    </div>
                </div>

                <div class="glass-panel" style="background: #ffffff; padding: clamp(16px, 5vw, 32px); border-radius: 12px; margin: 0 auto; overflow-x: hidden;">
                    <form id="customerForm" novalidate>
                        <div class="grid-2-col">
                            <div>
                                <label style="display: block; margin-bottom: 8px; font-size: 14px; font-weight: 500;">Customer Code *</label>
                                <input type="text" id="cCode" value="${customer?.customer_code || dynamicCode}" required readonly style="width: 100%; padding: 12px; border-radius: 8px; border: 1px solid var(--border-glass); background: rgba(0,0,0,0.1); color: var(--text-muted); outline: none; cursor: not-allowed;">
                                <div id="err_cCode" style="color: #ef4444; font-size: 12px; margin-top: 4px; display: none;"></div>
                            </div>
                            <div>
                                <label style="display: block; margin-bottom: 8px; font-size: 14px; font-weight: 500;">Full Name *</label>
                                <input type="text" id="cName" value="${customer?.full_name || ''}" required style="width: 100%; padding: 12px; border-radius: 8px; border: 1px solid var(--border-glass); background: transparent; color: var(--text-main); outline: none;">
                                <div id="err_cName" style="color: #ef4444; font-size: 12px; margin-top: 4px; display: none;"></div>
                            </div>
                        </div>

                        <div class="grid-2-col">
                            <div>
                                <label style="display: block; margin-bottom: 8px; font-size: 14px; font-weight: 500;">Mobile *</label>
                                <input type="text" id="cMobile" value="${customer?.mobile || ''}" required style="width: 100%; padding: 12px; border-radius: 8px; border: 1px solid var(--border-glass); background: transparent; color: var(--text-main); outline: none;">
                                <div id="err_cMobile" style="color: #ef4444; font-size: 12px; margin-top: 4px; display: none;"></div>
                            </div>
                            <div>
                                <label style="display: block; margin-bottom: 8px; font-size: 14px; font-weight: 500;">WhatsApp No.</label>
                                <div style="display: flex; gap: 8px; align-items: center;">
                                    <input type="text" id="cWhatsapp" value="${customer?.whatsapp_no || ''}" style="width: 100%; padding: 12px; border-radius: 8px; border: 1px solid var(--border-glass); background: transparent; color: var(--text-main); outline: none;">
                                    <button type="button" onclick="document.getElementById('cWhatsapp').value = document.getElementById('cMobile').value" style="padding: 12px; border-radius: 8px; border: 1px solid var(--border-glass); background: #f1f5f9; color: #475569; cursor: pointer; display: flex; align-items: center; justify-content: center; min-width: 48px;" title="Copy from Mobile">
                                        <i class="fa-solid fa-copy"></i>
                                    </button>
                                </div>
                                <div id="err_cWhatsapp" style="color: #ef4444; font-size: 12px; margin-top: 4px; display: none;"></div>
                            </div>
                        </div>



                        <div class="grid-2-col">
                            <div>
                                <label style="display: block; margin-bottom: 8px; font-size: 14px; font-weight: 500;">Customer Photo</label>
                                ${customer?.image ? `<div style="margin-bottom: 12px;"><img src="${customer.image}" style="height: 64px; border-radius: 8px; border: 1px solid var(--border-glass);"></div>` : ''}
                                <input type="file" id="cImage" accept="image/*" style="width: 100%; padding: 12px; border-radius: 8px; border: 1px solid var(--border-glass); background: transparent; color: var(--text-main); outline: none;">
                            </div>

                            <div>
                                <label style="display: block; margin-bottom: 8px; font-size: 14px; font-weight: 500;">Full Address</label>
                                <textarea id="cAddress" rows="3" style="width: 100%; padding: 12px; border-radius: 8px; border: 1px solid var(--border-glass); background: transparent; color: var(--text-main); outline: none; font-family: inherit;">${customer?.address || ''}</textarea>
                                <div id="err_cAddress" style="color: #ef4444; font-size: 12px; margin-top: 4px; display: none;"></div>
                            </div>
                        </div>

                        ${window.appUser && window.appUser.roles && window.appUser.roles[0].name === 'admin' ? `
                        <div class="grid-2-col" style="margin-bottom: 24px;">
                            <div>
                                <label style="display: block; margin-bottom: 8px; font-size: 14px; font-weight: 500;">Assign Staff</label>
                                <select id="cAssignStaff" style="width: 100%; padding: 12px; border-radius: 8px; border: 1px solid var(--border-glass); background: transparent; color: var(--text-main); outline: none;">
                                    <option value="">Unassigned</option>
                                </select>
                            </div>
                        </div>
                        ` : ''}

                        <!-- Bottom action row: quick-add buttons (left) + cancel/save (right) -->
                        <div style="display: flex; justify-content: space-between; align-items: center; gap: 16px; flex-wrap: wrap;">
                            <div style="display: flex; gap: 12px; flex-wrap: wrap;">
                                <button type="button" id="openServiceModalBtn" onclick="window.CustomerForm.openServiceModal()"
                                    style="display: flex; align-items: center; gap: 8px; padding: 12px 20px; border-radius: 8px; border: 2px dashed #0ea5e9; background: transparent; color: #0ea5e9; cursor: pointer; font-weight: 600; font-size: 14px; transition: background 0.2s;"
                                    onmouseover="this.style.background='#e0f2fe'" onmouseout="this.style.background='transparent'">
                                    <i class="fa-solid fa-plus"></i> ${isEdit ? 'Edit' : 'Add'} Service
                                </button>
                            </div>
                            <div style="display: flex; gap: 16px;">
                                <button type="button" onclick="window.router.navigate('/customers')" style="padding: 12px 24px; border-radius: 8px; border: 1px solid var(--border-glass); background: transparent; color: var(--text-main); cursor: pointer; font-weight: 600;">Cancel</button>
                                <button type="submit" id="saveCustomerBtn" style="padding: 12px 24px; border-radius: 8px; border: none; background: #ff9f43; color: white; cursor: pointer; font-weight: 600; box-shadow: 0 4px 12px rgba(255,159,67,0.3);">Save Customer</button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>

            <!-- ═══════════════════════════════════ Add AC Unit Modal ═══════════════════════════════════ -->
            <div id="addAcUnitModal" style="display: none; position: fixed; inset: 0; background: rgba(15,23,42,0.6); backdrop-filter: blur(4px); z-index: 2000; align-items: center; justify-content: center; padding: 16px;">
                <div style="background: #ffffff; width: 100%; max-width: 720px; border-radius: 16px; padding: 32px; box-shadow: 0 20px 40px rgba(0,0,0,0.15); position: relative; max-height: 90vh; overflow-y: auto;">
                    <button type="button" onclick="window.CustomerForm.closeAcModal()" style="position: absolute; top: 16px; right: 16px; background: #f1f5f9; border: none; border-radius: 8px; width: 32px; height: 32px; font-size: 18px; cursor: pointer; color: #64748b; display: flex; align-items: center; justify-content: center;"><i class="fa-solid fa-xmark"></i></button>
                    <h3 style="font-size: 20px; font-weight: 700; color: #0f172a; margin-bottom: 6px;">Add AC Unit</h3>
                    <p id="acModalSubtitle" style="font-size: 13px; color: #64748b; margin-bottom: 24px;">This AC unit will be linked to the current customer.</p>

                    <form id="modalAcForm" novalidate>
                        <!-- Basic Details -->
                        <div style="border-bottom: 1px solid #e2e8f0; padding-bottom: 8px; margin-bottom: 20px;">
                            <h4 style="font-size: 14px; font-weight: 600; color: #334155; text-transform: uppercase; letter-spacing: 0.05em; margin: 0;">Basic Details</h4>
                        </div>
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 16px;">
                            <div style="display: flex; flex-direction: column; gap: 8px;">
                                <label style="font-weight: 500; font-size: 14px; color: #334155;">AC Code <span style="color: red;">*</span></label>
                                <input type="text" id="macAcCode" readonly style="width: 100%; padding: 12px; border-radius: 8px; border: 1px solid var(--border-glass); background: rgba(0,0,0,0.05); color: var(--text-muted); outline: none; font-family: inherit; font-size: 14px; cursor: not-allowed;">
                                <div id="err_macAcCode" style="color: #ef4444; font-size: 12px; margin-top: 2px; display: none;"></div>
                            </div>
                            <div style="display: flex; flex-direction: column; gap: 8px;">
                                <label style="font-weight: 500; font-size: 14px; color: #334155;">Brand</label>
                                <input type="text" id="macBrand" placeholder="e.g. Daikin, LG" style="width: 100%; padding: 12px; border-radius: 8px; border: 1px solid var(--border-glass); background: transparent; color: var(--text-main); outline: none; font-family: inherit; font-size: 14px;">
                            </div>
                            <div style="display: flex; flex-direction: column; gap: 8px;">
                                <label style="font-weight: 500; font-size: 14px; color: #334155;">Model</label>
                                <input type="text" id="macModel" style="width: 100%; padding: 12px; border-radius: 8px; border: 1px solid var(--border-glass); background: transparent; color: var(--text-main); outline: none; font-family: inherit; font-size: 14px;">
                            </div>
                            <div style="display: flex; flex-direction: column; gap: 8px;">
                                <label style="font-weight: 500; font-size: 14px; color: #334155;">Serial Number</label>
                                <input type="text" id="macSerial" style="width: 100%; padding: 12px; border-radius: 8px; border: 1px solid var(--border-glass); background: transparent; color: var(--text-main); outline: none; font-family: inherit; font-size: 14px;">
                            </div>
                            <div style="display: flex; flex-direction: column; gap: 8px;">
                                <label style="font-weight: 500; font-size: 14px; color: #334155;">Capacity</label>
                                <input type="text" id="macCapacity" placeholder="e.g. 1.5 Ton" style="width: 100%; padding: 12px; border-radius: 8px; border: 1px solid var(--border-glass); background: transparent; color: var(--text-main); outline: none; font-family: inherit; font-size: 14px;">
                            </div>
                            <div style="display: flex; flex-direction: column; gap: 8px;">
                                <label style="font-weight: 500; font-size: 14px; color: #334155;">AC Type</label>
                                <select id="macAcType" style="width: 100%; padding: 12px; border-radius: 8px; border: 1px solid var(--border-glass); background: transparent; color: var(--text-main); outline: none; font-family: inherit; font-size: 14px;">
                                    <option value="">Select Type</option>
                                    <option value="Split">Split</option>
                                    <option value="Window">Window</option>
                                    <option value="Cassette">Cassette</option>
                                    <option value="Tower">Tower</option>
                                </select>
                            </div>
                            <div style="display: flex; flex-direction: column; gap: 8px;">
                                <label style="font-weight: 500; font-size: 14px; color: #334155;">Inverter Type</label>
                                <select id="macInverterType" style="width: 100%; padding: 12px; border-radius: 8px; border: 1px solid var(--border-glass); background: transparent; color: var(--text-main); outline: none; font-family: inherit; font-size: 14px;">
                                    <option value="">Select</option>
                                    <option value="Inverter">Inverter</option>
                                    <option value="Non-Inverter">Non-Inverter</option>
                                </select>
                            </div>
                        </div>

                        <!-- Installation & Warranty -->
                        <div style="border-bottom: 1px solid #e2e8f0; padding-bottom: 8px; margin-bottom: 20px; margin-top: 8px;">
                            <h4 style="font-size: 14px; font-weight: 600; color: #334155; text-transform: uppercase; letter-spacing: 0.05em; margin: 0;">Installation &amp; Warranty</h4>
                        </div>
                        <div class="installation-grid" style="margin-bottom: 16px;">
                            <div style="display: flex; flex-direction: column; gap: 8px;">
                                <label style="font-weight: 500; font-size: 14px; color: #334155;">Installation Date</label>
                                <input type="date" id="macInstDate" style="width: 100%; padding: 12px; border-radius: 8px; border: 1px solid var(--border-glass); background: transparent; color: var(--text-main); outline: none; font-family: inherit; font-size: 14px;">
                            </div>
                            <div style="display: flex; flex-direction: column; gap: 8px;">
                                <label style="font-weight: 500; font-size: 14px; color: #334155;">Installation Location / Room</label>
                                <input type="text" id="macRoom" placeholder="e.g. Master Bedroom" style="width: 100%; padding: 12px; border-radius: 8px; border: 1px solid var(--border-glass); background: transparent; color: var(--text-main); outline: none; font-family: inherit; font-size: 14px;">
                            </div>
                            <div class="status-field" style="display: flex; flex-direction: column; gap: 8px;">
                                <label style="font-weight: 500; font-size: 14px; color: #334155;">Status</label>
                                <select id="macStatus" style="width: 100%; padding: 12px; border-radius: 8px; border: 1px solid var(--border-glass); background: transparent; color: var(--text-main); outline: none; font-family: inherit; font-size: 14px;">
                                    <option value="active">Active</option>
                                    <option value="inactive">Inactive</option>
                                </select>
                            </div>
                        </div>

                        <!-- Notes -->
                        <div style="display: flex; flex-direction: column; gap: 8px; margin-bottom: 24px;">
                            <label style="font-weight: 500; font-size: 14px; color: #334155;">Notes</label>
                            <textarea id="macNotes" rows="3" style="width: 100%; padding: 12px; border-radius: 8px; border: 1px solid var(--border-glass); background: transparent; color: var(--text-main); outline: none; font-family: inherit; resize: vertical;"></textarea>
                        </div>

                        <!-- Buttons -->
                        <div style="display: flex; justify-content: flex-end; gap: 12px; border-top: 1px solid #e2e8f0; padding-top: 20px;">
                            <button type="button" onclick="window.CustomerForm.closeAcModal()" style="padding: 10px 20px; border-radius: 8px; border: 1px solid var(--border-glass); background: transparent; color: var(--text-main); cursor: pointer; font-weight: 600;">Cancel</button>
                            <button type="button" id="macSaveBtn" onclick="window.CustomerForm.saveAcUnit()" style="padding: 10px 20px; border-radius: 8px; border: none; background: #6366f1; color: white; cursor: pointer; font-weight: 600; box-shadow: 0 4px 12px rgba(99,102,241,0.35);">
                                <i class="fa-solid fa-floppy-disk" style="margin-right: 6px;"></i>Save AC Unit
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            <!-- ═══════════════════════════════════ Add Service Modal ═══════════════════════════════════ -->
            <div id="addServiceModal" style="display: none; position: fixed; inset: 0; background: rgba(15,23,42,0.6); backdrop-filter: blur(4px); z-index: 2000; align-items: center; justify-content: center; padding: 16px;">
                <div style="background: #ffffff; width: 100%; max-width: 800px; border-radius: 16px; padding: clamp(16px, 5vw, 32px); box-shadow: 0 20px 40px rgba(0,0,0,0.15); position: relative; max-height: 90vh; overflow-y: auto; overflow-x: hidden;">
                    <button type="button" onclick="window.CustomerForm.closeServiceModal()" style="position: absolute; top: 16px; right: 16px; background: #f1f5f9; border: none; border-radius: 8px; width: 32px; height: 32px; font-size: 18px; cursor: pointer; color: #64748b; display: flex; align-items: center; justify-content: center;"><i class="fa-solid fa-xmark"></i></button>
                    <h3 id="serviceModalTitle" style="font-size: 20px; font-weight: 700; color: #0f172a; margin-bottom: 6px;">${isEdit ? 'Edit' : 'Add'} Service</h3>
                    <p id="serviceModalSubtitle" style="font-size: 13px; color: #64748b; margin-bottom: 24px;">AC units shown are scoped to this customer.</p>

                    <form id="modalServiceForm" novalidate>
                        <!-- Service Details -->
                        <div id="serviceStep1">
                            <div style="border-bottom: 1px solid #e2e8f0; padding-bottom: 8px; margin-bottom: 20px;">
                                <h4 style="font-size: 14px; font-weight: 600; color: #334155; text-transform: uppercase; letter-spacing: 0.05em; margin: 0;">Service Details</h4>
                            </div>


                        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 16px; margin-bottom: 16px;">
                            <div style="display: flex; flex-direction: column; gap: 8px;">
                                <div style="display: flex; justify-content: space-between; align-items: center;">
                                    <label style="font-weight: 500; font-size: 14px; color: #334155;">AC Unit <span style="color: red;">*</span></label>
                                    <button type="button" onclick="window.CustomerForm.openMsvAcModal()" style="background: var(--primary); color: white; border: none; border-radius: 4px; padding: 4px 8px; font-size: 12px; cursor: pointer;"><i class="fa-solid fa-plus"></i> Add New</button>
                                </div>
                                <select id="msvAcUnit" required style="width: 100%; padding: 12px; border-radius: 8px; border: 1px solid var(--border-glass); background: transparent; color: var(--text-main); outline: none; font-family: inherit; font-size: 14px;">
                                    <option value="">Select AC Unit</option>
                                </select>
                                <div id="err_msvAcUnit" style="color: #ef4444; font-size: 12px; margin-top: 2px; display: none;"></div>
                            </div>
                            <div style="display: flex; flex-direction: column; gap: 8px;">
                                <label style="font-weight: 500; font-size: 14px; color: #334155;">Service Date <span style="color: red;">*</span></label>
                                <input type="date" id="msvDate" required value="${new Date().toISOString().split('T')[0]}" style="width: 100%; padding: 12px; border-radius: 8px; border: 1px solid var(--border-glass); background: transparent; color: var(--text-main); outline: none; font-family: inherit; font-size: 14px;">
                                <div id="err_msvDate" style="color: #ef4444; font-size: 12px; margin-top: 2px; display: none;"></div>
                            </div>
                            <div style="display: flex; flex-direction: column; gap: 8px;">
                                <label style="font-weight: 500; font-size: 14px; color: #334155;">Service Type <span style="color: red;">*</span></label>
                                <select id="msvServiceType" required style="width: 100%; padding: 12px; border-radius: 8px; border: 1px solid var(--border-glass); background: transparent; color: var(--text-main); outline: none; font-family: inherit; font-size: 14px;">
                                    <option value="Regular Maintenance" selected>Regular Maintenance</option>
                                    <option value="Repair">Repair</option>
                                    <option value="Installation">Installation</option>
                                    <option value="Inspection">Inspection</option>
                                </select>
                                <div id="err_msvServiceType" style="color: #ef4444; font-size: 12px; margin-top: 2px; display: none;"></div>
                            </div>
                            <div style="display: flex; flex-direction: column; gap: 8px;">
                                <label style="font-weight: 500; font-size: 14px; color: #334155;">Status</label>
                                <select id="msvStatus" style="width: 100%; padding: 12px; border-radius: 8px; border: 1px solid var(--border-glass); background: transparent; color: var(--text-main); outline: none; font-family: inherit; font-size: 14px;">
                                    <option value="completed" selected>Completed</option>
                                    <option value="pending">Pending</option>
                                    <option value="in-progress">In Progress</option>
                                </select>
                            </div>
                            <div style="display: flex; flex-direction: column; gap: 8px;">
                                <label style="font-weight: 500; font-size: 14px; color: #334155;">Customer Complaint / Issue</label>
                                <textarea id="msvComplaint" rows="3" placeholder="What is the issue reported by the customer?" style="width: 100%; padding: 12px; border-radius: 8px; border: 1px solid var(--border-glass); background: transparent; color: var(--text-main); outline: none; font-family: inherit; resize: vertical;"></textarea>
                            </div>
                            <div style="display: flex; flex-direction: column; gap: 8px;">
                                <label style="font-weight: 500; font-size: 14px; color: #334155;">Diagnosis &amp; Work Done</label>
                                <textarea id="msvWorkDone" rows="3" placeholder="Describe the work performed..." style="width: 100%; padding: 12px; border-radius: 8px; border: 1px solid var(--border-glass); background: transparent; color: var(--text-main); outline: none; font-family: inherit; resize: vertical;"></textarea>
                            </div>
                            </div>
                            
                            <div style="display: flex; justify-content: flex-end; gap: 12px; border-top: 1px solid #e2e8f0; padding-top: 20px;">
                                <button type="button" onclick="window.CustomerForm.closeServiceModal()" style="padding: 10px 20px; border-radius: 8px; border: 1px solid var(--border-glass); background: transparent; color: var(--text-main); cursor: pointer; font-weight: 600;">Cancel</button>
                                <button type="button" onclick="window.CustomerForm.nextServiceStep()" style="padding: 10px 20px; border-radius: 8px; border: none; background: #0ea5e9; color: white; cursor: pointer; font-weight: 600; box-shadow: 0 4px 12px rgba(14,165,233,0.35);">
                                    Next <i class="fa-solid fa-arrow-right" style="margin-left: 6px;"></i>
                                </button>
                            </div>
                        </div>

                        <!-- Billing Details -->
                        <div id="serviceStep2" style="display: none;">
                            <div style="border-bottom: 1px solid #e2e8f0; padding-bottom: 8px; margin-bottom: 20px; margin-top: 8px;">
                                <h4 style="font-size: 14px; font-weight: 600; color: #334155; text-transform: uppercase; letter-spacing: 0.05em; margin: 0;">Billing Details</h4>
                            </div>
                        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 16px; margin-bottom: 24px;">
                            <div style="display: flex; flex-direction: column; gap: 8px;">
                                <label style="font-weight: 500; font-size: 14px; color: #334155;">Labor / Service Charge (&#8377;)</label>
                                <input type="number" step="0.01" id="msvLabor" value="0.00" oninput="window.CustomerForm.calcServiceTotal()" style="width: 100%; padding: 12px; border-radius: 8px; border: 1px solid var(--border-glass); background: transparent; color: var(--text-main); outline: none; font-family: inherit; font-size: 14px;">
                            </div>
                            <div style="display: flex; flex-direction: column; gap: 8px;">
                                <label style="font-weight: 500; font-size: 14px; color: #334155;">Spare Parts Charge (&#8377;)</label>
                                <input type="number" step="0.01" id="msvParts" value="0.00" oninput="window.CustomerForm.calcServiceTotal()" style="width: 100%; padding: 12px; border-radius: 8px; border: 1px solid var(--border-glass); background: transparent; color: var(--text-main); outline: none; font-family: inherit; font-size: 14px;">
                            </div>
                            <div style="display: flex; flex-direction: column; gap: 8px;">
                                <label style="font-weight: 500; font-size: 14px; color: #334155;">Discount (&#8377;)</label>
                                <input type="number" step="0.01" id="msvDiscount" value="0.00" oninput="window.CustomerForm.calcServiceTotal()" style="width: 100%; padding: 12px; border-radius: 8px; border: 1px solid var(--border-glass); background: transparent; color: var(--text-main); outline: none; font-family: inherit; font-size: 14px;">
                            </div>
                            <div style="display: flex; flex-direction: column; gap: 8px;">
                                <label style="font-weight: 500; font-size: 14px; color: #334155;">Total Amount (&#8377;)</label>
                                <input type="number" step="0.01" id="msvTotal" value="0.00" readonly style="width: 100%; padding: 12px; border-radius: 8px; border: 1px solid var(--border-glass); background: rgba(0,0,0,0.05); color: var(--text-muted); outline: none; font-family: inherit; font-size: 14px; cursor: not-allowed; font-weight: bold;">
                            </div>
                            <div style="display: flex; flex-direction: column; gap: 8px;">
                                <label style="font-weight: 500; font-size: 14px; color: #334155;">Payment Status</label>
                                <select id="msvPaymentStatus" style="width: 100%; padding: 12px; border-radius: 8px; border: 1px solid var(--border-glass); background: transparent; color: var(--text-main); outline: none; font-family: inherit; font-size: 14px;">
                                    <option value="unpaid">Unpaid</option>
                                    <option value="paid">Paid</option>
                                </select>
                            </div>
                            <div style="display: flex; flex-direction: column; gap: 8px;">
                                <label style="font-weight: 500; font-size: 14px; color: #334155;">Next Maintenance Date</label>
                                <input type="date" id="msvNextDate" style="width: 100%; padding: 12px; border-radius: 8px; border: 1px solid var(--border-glass); background: transparent; color: var(--text-main); outline: none; font-family: inherit; font-size: 14px;">
                            </div>
                        </div>

                        <!-- Buttons -->
                        <div style="display: flex; justify-content: flex-end; gap: 12px; border-top: 1px solid #e2e8f0; padding-top: 20px;">
                            <button type="button" onclick="window.CustomerForm.prevServiceStep()" style="padding: 10px 20px; border-radius: 8px; border: 1px solid var(--border-glass); background: transparent; color: var(--text-main); cursor: pointer; font-weight: 600;"><i class="fa-solid fa-arrow-left" style="margin-right: 6px;"></i> Previous</button>
                            <button type="button" id="msvSaveBtn" onclick="window.CustomerForm.saveService()" style="padding: 10px 20px; border-radius: 8px; border: none; background: #0ea5e9; color: white; cursor: pointer; font-weight: 600; box-shadow: 0 4px 12px rgba(14,165,233,0.35);">
                                <i class="fa-solid fa-floppy-disk" style="margin-right: 6px;"></i>Save Service
                            </button>
                        </div>
                        </div>
                    </form>
                </div>
            </div>

            <!-- ═══════════════════════════════════ Add AC Unit Modal (Over Add Service Modal) ═══════════════════════════════════ -->
            <div id="msvAddAcModal" style="display: none; position: fixed; inset: 0; background: rgba(15,23,42,0.6); backdrop-filter: blur(4px); z-index: 2010; align-items: center; justify-content: center; padding: 16px;">
                <div style="background: #ffffff; width: 100%; max-width: 800px; border-radius: 16px; padding: clamp(16px, 5vw, 32px); box-shadow: 0 20px 40px rgba(0,0,0,0.15); position: relative; max-height: 90vh; overflow-y: auto; overflow-x: hidden;">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px;">
                        <h4 style="font-size: 20px; font-weight: 700; color: #0f172a; margin: 0; display: flex; align-items: center; gap: 8px;">
                            <i class="fa-solid fa-snowflake" style="color: #6366f1;"></i> Add New AC Unit
                        </h4>
                        <button type="button" onclick="window.CustomerForm.closeMsvAcModal()" style="position: absolute; top: 16px; right: 16px; background: #f1f5f9; border: none; border-radius: 8px; width: 32px; height: 32px; font-size: 18px; cursor: pointer; color: #64748b; display: flex; align-items: center; justify-content: center;"><i class="fa-solid fa-xmark"></i></button>
                    </div>

                    <div id="acStep1">
                        <p style="font-size: 12px; font-weight: 700; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.06em; margin: 0 0 12px;">Basic Details</p>
                        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 16px; margin-bottom: 24px;">
                        <div style="display: flex; flex-direction: column; gap: 8px;">
                            <label style="font-weight: 500; font-size: 14px; color: #334155;">Customer <span style="color: red;">*</span></label>
                            <select id="msvIacCustomer" style="width: 100%; padding: 12px; border-radius: 8px; border: 1px solid var(--border-glass); background: transparent; color: var(--text-main); outline: none; font-family: inherit; font-size: 14px;">
                                <option value="">Select Customer</option>
                            </select>
                            <div id="err_msvIacCustomer" style="color: #ef4444; font-size: 12px; margin-top: 2px; display: none;"></div>
                        </div>
                        <div style="display: flex; flex-direction: column; gap: 8px;">
                            <label style="font-weight: 500; font-size: 14px; color: #334155;">AC Code <span style="color: red;">*</span></label>
                            <input type="text" id="msvIacCode" readonly style="width: 100%; padding: 12px; border-radius: 8px; border: 1px solid var(--border-glass); background: rgba(0,0,0,0.05); color: var(--text-muted); outline: none; font-family: inherit; font-size: 14px; cursor: not-allowed;">
                            <div id="err_msvIacCode" style="color: #ef4444; font-size: 12px; margin-top: 2px; display: none;"></div>
                        </div>
                        <div style="display: flex; flex-direction: column; gap: 8px;">
                            <label style="font-weight: 500; font-size: 14px; color: #334155;">Brand</label>
                            <input type="text" id="msvIacBrand" placeholder="e.g. Daikin, LG" style="width: 100%; padding: 12px; border-radius: 8px; border: 1px solid var(--border-glass); background: transparent; color: var(--text-main); outline: none; font-family: inherit; font-size: 14px;">
                        </div>
                        <div style="display: flex; flex-direction: column; gap: 8px;">
                            <label style="font-weight: 500; font-size: 14px; color: #334155;">Model</label>
                            <input type="text" id="msvIacModel" style="width: 100%; padding: 12px; border-radius: 8px; border: 1px solid var(--border-glass); background: transparent; color: var(--text-main); outline: none; font-family: inherit; font-size: 14px;">
                        </div>
                        <div style="display: flex; flex-direction: column; gap: 8px;">
                            <label style="font-weight: 500; font-size: 14px; color: #334155;">Serial Number</label>
                            <input type="text" id="msvIacSerial" style="width: 100%; padding: 12px; border-radius: 8px; border: 1px solid var(--border-glass); background: transparent; color: var(--text-main); outline: none; font-family: inherit; font-size: 14px;">
                        </div>
                        <div style="display: flex; flex-direction: column; gap: 8px;">
                            <label style="font-weight: 500; font-size: 14px; color: #334155;">Capacity</label>
                            <input type="text" id="msvIacCapacity" placeholder="e.g. 1.5 Ton" style="width: 100%; padding: 12px; border-radius: 8px; border: 1px solid var(--border-glass); background: transparent; color: var(--text-main); outline: none; font-family: inherit; font-size: 14px;">
                        </div>
                        <div style="display: flex; flex-direction: column; gap: 8px;">
                            <label style="font-weight: 500; font-size: 14px; color: #334155;">AC Type</label>
                            <select id="msvIacAcType" style="width: 100%; padding: 12px; border-radius: 8px; border: 1px solid var(--border-glass); background: transparent; color: var(--text-main); outline: none; font-family: inherit; font-size: 14px;">
                                <option value="">Select Type</option>
                                <option value="Split">Split</option>
                                <option value="Window">Window</option>
                                <option value="Cassette">Cassette</option>
                                <option value="Tower">Tower</option>
                            </select>
                        </div>
                        <div style="display: flex; flex-direction: column; gap: 8px;">
                            <label style="font-weight: 500; font-size: 14px; color: #334155;">Inverter Type</label>
                            <select id="msvIacInverterType" style="width: 100%; padding: 12px; border-radius: 8px; border: 1px solid var(--border-glass); background: transparent; color: var(--text-main); outline: none; font-family: inherit; font-size: 14px;">
                                <option value="">Select</option>
                                <option value="Inverter">Inverter</option>
                                <option value="Non-Inverter">Non-Inverter</option>
                            </select>
                        </div>
                        </div>
                        <div style="display: flex; justify-content: flex-end; gap: 12px; border-top: 1px solid #e2e8f0; padding-top: 20px;">
                            <button type="button" onclick="window.CustomerForm.closeMsvAcModal()" style="padding: 10px 20px; border-radius: 8px; border: 1px solid var(--border-glass); background: transparent; color: var(--text-main); cursor: pointer; font-weight: 600;">Cancel</button>
                            <button type="button" onclick="window.CustomerForm.nextAcStep()" style="padding: 10px 20px; border-radius: 8px; border: none; background: #6366f1; color: white; cursor: pointer; font-weight: 600; box-shadow: 0 4px 12px rgba(99,102,241,0.3);">
                                Next <i class="fa-solid fa-arrow-right" style="margin-left: 6px;"></i>
                            </button>
                        </div>
                    </div>

                    <div id="acStep2" style="display: none;">
                        <p style="font-size: 12px; font-weight: 700; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.06em; margin: 0 0 12px;">Installation &amp; Warranty</p>
                        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 16px; margin-bottom: 24px;">
                        <div style="display: flex; flex-direction: column; gap: 8px;">
                            <label style="font-weight: 500; font-size: 14px; color: #334155;">Installation Date</label>
                            <input type="date" id="msvIacInstDate" style="width: 100%; padding: 12px; border-radius: 8px; border: 1px solid var(--border-glass); background: transparent; color: var(--text-main); outline: none; font-family: inherit; font-size: 14px;">
                        </div>
                        <div style="display: flex; flex-direction: column; gap: 8px;">
                            <label style="font-weight: 500; font-size: 14px; color: #334155;">Installation Location / Room</label>
                            <input type="text" id="msvIacRoom" placeholder="e.g. Master Bedroom" style="width: 100%; padding: 12px; border-radius: 8px; border: 1px solid var(--border-glass); background: transparent; color: var(--text-main); outline: none; font-family: inherit; font-size: 14px;">
                        </div>
                        <div class="status-field" style="display: flex; flex-direction: column; gap: 8px;">
                            <label style="font-weight: 500; font-size: 14px; color: #334155;">Status</label>
                            <select id="msvIacStatus" style="width: 100%; padding: 12px; border-radius: 8px; border: 1px solid var(--border-glass); background: transparent; color: var(--text-main); outline: none; font-family: inherit; font-size: 14px;">
                                <option value="active">Active</option>
                                <option value="inactive">Inactive</option>
                            </select>
                        </div>
                        </div>

                        <div style="display: flex; justify-content: flex-end; gap: 12px; border-top: 1px solid #e2e8f0; padding-top: 20px;">
                            <button type="button" onclick="window.CustomerForm.prevAcStep()" style="padding: 10px 20px; border-radius: 8px; border: 1px solid var(--border-glass); background: transparent; color: var(--text-main); cursor: pointer; font-weight: 600;"><i class="fa-solid fa-arrow-left" style="margin-right: 6px;"></i> Previous</button>
                            <button type="button" id="msvIacSaveBtn" onclick="window.CustomerForm.saveMsvAcUnit()" style="padding: 10px 20px; border-radius: 8px; border: none; background: #6366f1; color: white; cursor: pointer; font-weight: 600; box-shadow: 0 4px 12px rgba(99,102,241,0.3); display: flex; align-items: center; gap: 6px;">
                                <i class="fa-solid fa-floppy-disk"></i> Save AC Unit
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;

        container.innerHTML = window.renderLayout(content);

        // Track saved customer id so modals can link records to the right customer
        window._cfSavedCustomerId = customer?.id || null;

        if (window.appUser && window.appUser.roles && window.appUser.roles[0].name === 'admin') {
            const staffSelect = document.getElementById('cAssignStaff');
            if (staffSelect) {
                const staffRes = await window.api.get('/admin/staff');
                if (staffRes.success) {
                    staffRes.data.forEach(staff => {
                        const option = document.createElement('option');
                        option.value = staff.id;
                        option.textContent = staff.name;
                        if (customer && customer.assign_staff == staff.id) {
                            option.selected = true;
                        }
                        staffSelect.appendChild(option);
                    });
                }
            }
        }

        document.getElementById('customerForm').addEventListener('submit', async (e) => {
            e.preventDefault();

            const payload = new FormData();
            payload.append('customer_code', document.getElementById('cCode').value);
            payload.append('full_name', document.getElementById('cName').value);
            payload.append('mobile', document.getElementById('cMobile').value);
            payload.append('whatsapp_no', document.getElementById('cWhatsapp').value);
            payload.append('address', document.getElementById('cAddress').value);
            payload.append('status', 'active');

            const fileInput = document.getElementById('cImage');
            if (fileInput.files.length > 0) {
                payload.append('image', fileInput.files[0]);
            }

            const staffSelect = document.getElementById('cAssignStaff');
            if (staffSelect && staffSelect.value) {
                payload.append('assign_staff', staffSelect.value);
            }

            const btn = document.getElementById('saveCustomerBtn');
            btn.disabled = true;
            btn.innerText = 'Saving...';

            // Clear previous error styles
            document.querySelectorAll('#customerForm input, #customerForm textarea').forEach(input => {
                input.style.borderColor = 'var(--border-glass)';
            });
            document.querySelectorAll('[id^="err_"]').forEach(el => {
                el.style.display = 'none';
                el.innerText = '';
            });

            let res;
            if (isEdit || window._cfSavedCustomerId) {
                payload.append('_method', 'PUT'); // Laravel form method spoofing
                const updateId = isEdit ? params.id : window._cfSavedCustomerId;
                res = await window.api.put('/customers/' + updateId, payload);
            } else {
                res = await window.api.post('/customers', payload);
            }

            if (res.success) {
                const customerName = document.getElementById('cName').value || 'Customer';
                if (window.addNotification) {
                    window.addNotification(
                        isEdit ? 'Customer Updated' : 'Customer Created',
                        `Customer "${customerName}" was successfully ${isEdit ? 'updated' : 'created'}.`,
                        'customer'
                    );
                }
                if (!isEdit && res.data?.id) {
                    window._cfSavedCustomerId = res.data.id;
                }
                window.showToast(isEdit ? 'Customer updated successfully!' : 'Customer created successfully!', 'success');
                window.router.navigate('/customers');
            } else {
                if (res.errors) {
                    const fieldMap = {
                        'mobile': 'cMobile',
                        'email': 'cEmail',
                        'full_name': 'cName',
                        'customer_code': 'cCode',
                        'whatsapp_no': 'cWhatsapp',
                        'dob': 'cDob',
                        'address': 'cAddress',
                        'city': 'cCity',
                        'country': 'cCountry'
                    };

                    for (const [key, messages] of Object.entries(res.errors)) {
                        if (fieldMap[key]) {
                            const input = document.getElementById(fieldMap[key]);
                            if (input) input.style.borderColor = '#ef4444';

                            const errDiv = document.getElementById('err_' + fieldMap[key]);
                            if (errDiv) {
                                errDiv.innerText = messages[0];
                                errDiv.style.display = 'block';
                            }
                        }
                    }
                }
                window.showToast(res.message || 'Failed to save customer', 'error');
                btn.disabled = false;
                btn.innerText = 'Save Customer';
            }
        });
    },

    // ─── Ensure customer is saved before opening modals ────────────────────────
    _ensureCustomerSaved: async () => {
        if (window._cfSavedCustomerId) return true;

        const nameInput = document.getElementById('cName');
        const mobileInput = document.getElementById('cMobile');
        const nameVal = nameInput?.value?.trim();
        const mobileVal = mobileInput?.value?.trim();

        let isValid = true;

        if (!nameVal) {
            if (nameInput) nameInput.style.borderColor = '#ef4444';
            const errName = document.getElementById('err_cName');
            if (errName) { errName.innerText = 'Full Name is required to auto-save.'; errName.style.display = 'block'; }
            isValid = false;
        } else {
            if (nameInput) nameInput.style.borderColor = 'var(--border-glass)';
            const errName = document.getElementById('err_cName');
            if (errName) errName.style.display = 'none';
        }

        if (!mobileVal) {
            if (mobileInput) mobileInput.style.borderColor = '#ef4444';
            const errMobile = document.getElementById('err_cMobile');
            if (errMobile) { errMobile.innerText = 'Mobile is required to auto-save.'; errMobile.style.display = 'block'; }
            isValid = false;
        } else {
            if (mobileInput) mobileInput.style.borderColor = 'var(--border-glass)';
            const errMobile = document.getElementById('err_cMobile');
            if (errMobile) errMobile.style.display = 'none';
        }

        if (!isValid) {
            window.showToast("Please fill in the required customer details (Full Name and Mobile) first.", 'error');
            return false;
        }

        const payload = new FormData();
        payload.append('customer_code', document.getElementById('cCode').value);
        payload.append('full_name', nameVal);
        payload.append('mobile', mobileVal);
        payload.append('whatsapp_no', document.getElementById('cWhatsapp').value || '');
        payload.append('address', document.getElementById('cAddress').value || '');
        payload.append('status', 'active');

        const fileInput = document.getElementById('cImage');
        if (fileInput && fileInput.files.length > 0) {
            payload.append('image', fileInput.files[0]);
        }
        const res = await window.api.post('/customers', payload);
        if (res.success && res.data?.id) {
            if (window.addNotification) {
                window.addNotification('Customer Created', `Customer "${nameVal}" was successfully created.`, 'customer');
            }
            window._cfSavedCustomerId = res.data.id;
            window.showToast('Customer saved! You can now add AC units / services.', 'success');
            const saveBtn = document.getElementById('saveCustomerBtn');
            if (saveBtn) saveBtn.innerText = 'Update Customer';
            return true;
        }

        let msg = res.message || 'Could not save customer.';
        if (res.errors) {
            const firstKey = Object.keys(res.errors)[0];
            msg = res.errors[firstKey]?.[0] || msg;
        }
        window.showToast(msg, 'error');
        return false;
    },

    // ─── AC Unit Modal ──────────────────────────────────────────────────────────
    openAcModal: async () => {
        const ok = await window.CustomerForm._ensureCustomerSaved();
        if (!ok) return;

        const name = document.getElementById('cName')?.value || 'this customer';
        const subtitle = document.getElementById('acModalSubtitle');
        if (subtitle) subtitle.textContent = 'This AC unit will be linked to: ' + name;

        try {
            const codeRes = await window.api.get('/ac-units/next-code');
            if (codeRes.success) {
                const el = document.getElementById('macAcCode');
                if (el) el.value = codeRes.code;
            }
        } catch (e) { }

        ['macBrand', 'macModel', 'macSerial', 'macCapacity', 'macNotes', 'macRoom'].forEach(id => {
            const el = document.getElementById(id); if (el) el.value = '';
        });
        ['macAcType', 'macInverterType'].forEach(id => {
            const el = document.getElementById(id); if (el) el.selectedIndex = 0;
        });
        const macStatus = document.getElementById('macStatus'); if (macStatus) macStatus.value = 'active';
        const macInstDate = document.getElementById('macInstDate'); if (macInstDate) macInstDate.value = '';

        const errEl = document.getElementById('err_macAcCode');
        if (errEl) { errEl.style.display = 'none'; errEl.innerText = ''; }

        document.getElementById('addAcUnitModal').style.display = 'flex';
    },

    closeAcModal: () => { document.getElementById('addAcUnitModal').style.display = 'none'; },

    saveAcUnit: async () => {
        const btn = document.getElementById('macSaveBtn');
        btn.disabled = true;
        btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin" style="margin-right:6px;"></i>Saving...';

        const errEl = document.getElementById('err_macAcCode');
        if (errEl) { errEl.style.display = 'none'; errEl.innerText = ''; }

        const payload = {
            customer_id: window._cfSavedCustomerId,
            ac_code: document.getElementById('macAcCode').value,
            brand: document.getElementById('macBrand').value,
            model: document.getElementById('macModel').value,
            serial_number: document.getElementById('macSerial').value,
            capacity: document.getElementById('macCapacity').value,
            ac_type: document.getElementById('macAcType').value,
            inverter_type: document.getElementById('macInverterType').value,
            installation_date: document.getElementById('macInstDate').value,
            room: document.getElementById('macRoom').value,
            status: document.getElementById('macStatus').value,
            notes: document.getElementById('macNotes').value,
        };

        try {
            const res = await window.api.post('/ac-units', payload);
            if (res.success) {
                if (window.addNotification) {
                    window.addNotification('AC Unit Created', `AC Unit "${payload.ac_code}" was successfully created.`, 'ac-unit');
                }
                window.showToast('AC Unit added successfully!', 'success');
                window.CustomerForm.closeAcModal();
            } else {
                if (res.errors) {
                    const map = { ac_code: 'macAcCode' };
                    for (const [key, messages] of Object.entries(res.errors)) {
                        const elId = map[key];
                        if (elId) {
                            const el = document.getElementById(elId);
                            if (el) el.style.borderColor = '#ef4444';
                            const e2 = document.getElementById('err_' + elId);
                            if (e2) { e2.innerText = messages[0]; e2.style.display = 'block'; }
                        }
                    }
                } else {
                    window.showToast(res.message || 'Error saving AC Unit', 'error');
                }
            }
        } catch (err) {
            window.showToast('Failed to save AC Unit', 'error');
            console.error(err);
        } finally {
            btn.disabled = false;
            btn.innerHTML = '<i class="fa-solid fa-floppy-disk" style="margin-right:6px;"></i>Save AC Unit';
        }
    },

    // ─── Service Modal ──────────────────────────────────────────────────────────
    openServiceModal: async () => {
        // Auto-save the customer first if needed
        const ok = await window.CustomerForm._ensureCustomerSaved();
        if (!ok) return;

        const subtitle = document.getElementById('serviceModalSubtitle');
        if (subtitle) subtitle.style.display = 'none';

        // Load all AC units
        const acSelect = document.getElementById('msvAcUnit');
        acSelect.innerHTML = '<option value="">Loading AC units\u2026</option>';
        try {
            const acRes = await window.api.get('/ac-units?per_page=1000');
            const acUnits = (acRes.success ? (acRes.data?.data || acRes.data || []) : []);
            acSelect.innerHTML = '<option value="">Select AC Unit</option>' +
                acUnits.map(ac => '<option value="' + ac.id + '">' + ac.ac_code + ' - ' + (ac.customer ? ac.customer.full_name : '') + '</option>').join('');
        } catch (e) {
            acSelect.innerHTML = '<option value="">Select AC Unit</option>';
        }

        if (window.msvAcChoices) {
            window.msvAcChoices.destroy();
        }
        if (window.Choices) {
            window.msvAcChoices = new Choices(acSelect, {
                searchEnabled: true,
                itemSelectText: '',
                shouldSort: false
            });
        }

        // Pre-load customers into the inline quick-add AC section
        try {
            const custRes = await window.api.get('/customers?per_page=1000');
            const customers = custRes.success ? (custRes.data?.data || custRes.data || []) : [];
            const custSel = document.getElementById('msvIacCustomer');
            if (custSel) {
                custSel.innerHTML = '<option value="">Select Customer</option>' +
                    customers.map(c => '<option value="' + c.id + '">' + c.full_name + ' (' + c.mobile + ')' + '</option>').join('');
                // Auto-select current customer if already saved
                if (window._cfSavedCustomerId) custSel.value = window._cfSavedCustomerId;

                if (window.msvIacCustChoices) {
                    window.msvIacCustChoices.destroy();
                }
                if (window.Choices) {
                    window.msvIacCustChoices = new Choices(custSel, {
                        searchEnabled: true,
                        itemSelectText: '',
                        shouldSort: false
                    });
                }
            }
        } catch (e) { }

        // Reset all fields
        document.getElementById('msvDate').value = new Date().toISOString().split('T')[0];
        document.getElementById('msvServiceType').value = 'Regular Maintenance';
        document.getElementById('msvStatus').value = 'completed';
        document.getElementById('msvComplaint').value = '';
        document.getElementById('msvWorkDone').value = '';
        document.getElementById('msvLabor').value = '0.00';
        document.getElementById('msvParts').value = '0.00';
        document.getElementById('msvDiscount').value = '0.00';
        document.getElementById('msvTotal').value = '0.00';
        document.getElementById('msvPaymentStatus').value = 'unpaid';
        document.getElementById('msvNextDate').value = '';



        ['msvAcUnit', 'msvDate', 'msvServiceType'].forEach(id => {
            const errEl = document.getElementById('err_' + id);
            if (errEl) { errEl.style.display = 'none'; errEl.innerText = ''; }
        });

        document.getElementById('addServiceModal').style.display = 'flex';
    },

    closeServiceModal: () => {
        if (window.msvAcChoices) {
            window.msvAcChoices.destroy();
            window.msvAcChoices = null;
        }
        if (window.msvIacCustChoices) {
            window.msvIacCustChoices.destroy();
            window.msvIacCustChoices = null;
        }
        document.getElementById('addServiceModal').style.display = 'none';
    },

    nextServiceStep: () => {
        let valid = true;
        ['msvAcUnit', 'msvDate', 'msvServiceType'].forEach(id => {
            const el = document.getElementById(id);
            const errEl = document.getElementById('err_' + id);
            if (!el.value) {
                valid = false;
                if (el.parentElement.querySelector('.choices')) {
                    el.parentElement.querySelector('.choices').style.border = '1px solid #ef4444';
                } else {
                    el.style.borderColor = '#ef4444';
                }
                if (errEl) { errEl.style.display = 'block'; errEl.innerText = 'This field is required.'; }
            } else {
                if (el.parentElement.querySelector('.choices')) {
                    el.parentElement.querySelector('.choices').style.border = '1px solid var(--border-glass)';
                } else {
                    el.style.borderColor = 'var(--border-glass)';
                }
                if (errEl) { errEl.style.display = 'none'; errEl.innerText = ''; }
            }
        });

        if (!valid) return;

        document.getElementById('serviceStep1').style.display = 'none';
        document.getElementById('serviceStep2').style.display = 'block';
    },

    prevServiceStep: () => {
        document.getElementById('serviceStep2').style.display = 'none';
        document.getElementById('serviceStep1').style.display = 'block';
    },

    openMsvAcModal: async () => {
        const step1 = document.getElementById('acStep1');
        const step2 = document.getElementById('acStep2');
        if (step1 && step2) {
            step1.style.display = 'block';
            step2.style.display = 'none';
        }

        document.getElementById('msvAddAcModal').style.display = 'flex';
        // Fetch next AC code
        await window.CustomerForm.loadMsvAcCode();
    },

    nextAcStep: () => {
        let valid = true;
        const custEl = document.getElementById('msvIacCustomer');
        const custErr = document.getElementById('err_msvIacCustomer');

        if (!custEl.value) {
            valid = false;
            if (custEl.parentElement.querySelector('.choices')) {
                custEl.parentElement.querySelector('.choices').style.border = '1px solid #ef4444';
            } else {
                custEl.style.borderColor = '#ef4444';
            }
            if (custErr) { custErr.style.display = 'block'; custErr.innerText = 'Customer is required.'; }
        } else {
            if (custEl.parentElement.querySelector('.choices')) {
                custEl.parentElement.querySelector('.choices').style.border = '1px solid var(--border-glass)';
            } else {
                custEl.style.borderColor = 'var(--border-glass)';
            }
            if (custErr) { custErr.style.display = 'none'; custErr.innerText = ''; }
        }

        if (!valid) return;

        document.getElementById('acStep1').style.display = 'none';
        document.getElementById('acStep2').style.display = 'block';
    },

    prevAcStep: () => {
        document.getElementById('acStep2').style.display = 'none';
        document.getElementById('acStep1').style.display = 'block';
    },

    closeMsvAcModal: () => {
        document.getElementById('msvAddAcModal').style.display = 'none';
    },

    loadMsvAcCode: async () => {
        try {
            const res = await window.api.get('/ac-units/next-code');
            if (res.success) {
                const el = document.getElementById('msvIacCode');
                if (el) el.value = res.code;
            }
        } catch (e) { }
    },

    // Save the AC unit created inside the service modal's inline section
    saveMsvAcUnit: async () => {
        const btn = document.getElementById('msvIacSaveBtn');
        btn.disabled = true;
        btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Saving...';

        // Clear errors
        ['msvIacCustomer', 'msvIacCode'].forEach(id => {
            const el = document.getElementById(id); if (el) el.style.borderColor = 'var(--border-glass)';
            const errEl = document.getElementById('err_' + id);
            if (errEl) { errEl.style.display = 'none'; errEl.innerText = ''; }
        });

        const payload = {
            customer_id: document.getElementById('msvIacCustomer').value,
            ac_code: document.getElementById('msvIacCode').value,
            brand: document.getElementById('msvIacBrand').value,
            model: document.getElementById('msvIacModel').value,
            serial_number: document.getElementById('msvIacSerial').value,
            capacity: document.getElementById('msvIacCapacity').value,
            ac_type: document.getElementById('msvIacAcType').value,
            inverter_type: document.getElementById('msvIacInverterType').value,
            installation_date: document.getElementById('msvIacInstDate').value,
            room: document.getElementById('msvIacRoom').value,
            status: document.getElementById('msvIacStatus').value,
        };

        try {
            const res = await window.api.post('/ac-units', payload);
            if (res.success) {
                if (window.addNotification) {
                    window.addNotification('AC Unit Created', `AC Unit "${payload.ac_code}" was successfully created.`, 'ac-unit');
                }
                window.showToast('AC Unit added successfully!', 'success');
                window.CustomerForm.closeMsvAcModal();

                // Reload all AC units and auto-select the new one
                const acRes = await window.api.get('/ac-units?per_page=1000');
                const acUnits = (acRes.success ? (acRes.data?.data || acRes.data || []) : []);
                const select = document.getElementById('msvAcUnit');

                if (window.msvAcChoices) {
                    window.msvAcChoices.destroy();
                }

                select.innerHTML = '<option value="">Select AC Unit</option>' +
                    acUnits.map(ac => '<option value="' + ac.id + '">' + ac.ac_code + ' - ' + (ac.customer ? ac.customer.full_name : '') + '</option>').join('');

                if (window.Choices) {
                    window.msvAcChoices = new Choices(select, {
                        searchEnabled: true,
                        itemSelectText: '',
                        shouldSort: false
                    });
                }

                if (res.data?.id) {
                    if (window.msvAcChoices) {
                        window.msvAcChoices.setChoiceByValue(String(res.data.id));
                    } else {
                        select.value = res.data.id;
                    }
                }
            } else {
                if (res.errors) {
                    const map = { customer_id: 'msvIacCustomer', ac_code: 'msvIacCode' };
                    for (const [key, messages] of Object.entries(res.errors)) {
                        const elId = map[key];
                        if (elId) {
                            const el = document.getElementById(elId);
                            if (el) el.style.borderColor = '#ef4444';
                            const errEl = document.getElementById('err_' + elId);
                            if (errEl) { errEl.innerText = messages[0]; errEl.style.display = 'block'; }
                        }
                    }
                } else {
                    window.showToast(res.message || 'Error saving AC Unit', 'error');
                }
            }
        } catch (err) {
            window.showToast('Failed to save AC Unit', 'error');
            console.error(err);
        } finally {
            btn.disabled = false;
            btn.innerHTML = '<i class="fa-solid fa-floppy-disk"></i> Save AC Unit';
        }
    },

    calcServiceTotal: () => {
        const labor = parseFloat(document.getElementById('msvLabor')?.value) || 0;
        const parts = parseFloat(document.getElementById('msvParts')?.value) || 0;
        const discount = parseFloat(document.getElementById('msvDiscount')?.value) || 0;
        const el = document.getElementById('msvTotal');
        if (el) el.value = Math.max(0, (labor + parts) - discount).toFixed(2);
    },

    saveService: async () => {
        const btn = document.getElementById('msvSaveBtn');
        btn.disabled = true;
        btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin" style="margin-right:6px;"></i>Saving...';

        ['msvAcUnit', 'msvDate', 'msvServiceType'].forEach(id => {
            const errEl = document.getElementById('err_' + id);
            if (errEl) { errEl.style.display = 'none'; errEl.innerText = ''; }
            const el = document.getElementById(id); if (el) el.style.borderColor = 'var(--border-glass)';
        });

        let valid = true;
        const acVal = document.getElementById('msvAcUnit').value;
        if (!acVal) {
            document.getElementById('msvAcUnit').style.borderColor = '#ef4444';
            const err = document.getElementById('err_msvAcUnit');
            if (err) { err.innerText = 'Please select an AC unit.'; err.style.display = 'block'; }
            valid = false;
        }
        const dateVal = document.getElementById('msvDate').value;
        if (!dateVal) {
            document.getElementById('msvDate').style.borderColor = '#ef4444';
            const err = document.getElementById('err_msvDate');
            if (err) { err.innerText = 'Service date is required.'; err.style.display = 'block'; }
            valid = false;
        }
        const typeVal = document.getElementById('msvServiceType').value;
        if (!typeVal) {
            document.getElementById('msvServiceType').style.borderColor = '#ef4444';
            const err = document.getElementById('err_msvServiceType');
            if (err) { err.innerText = 'Service type is required.'; err.style.display = 'block'; }
            valid = false;
        }
        if (!valid) {
            btn.disabled = false;
            btn.innerHTML = '<i class="fa-solid fa-floppy-disk" style="margin-right:6px;"></i>Save Service';
            return;
        }

        const payload = {
            ac_unit_id: acVal,
            service_date: dateVal,
            service_type: typeVal,
            status: document.getElementById('msvStatus').value,
            complaint: document.getElementById('msvComplaint').value,
            work_done: document.getElementById('msvWorkDone').value,
            labor_charge: document.getElementById('msvLabor').value,
            parts_charge: document.getElementById('msvParts').value,
            discount: document.getElementById('msvDiscount').value,
            total_amount: document.getElementById('msvTotal').value,
            payment_status: document.getElementById('msvPaymentStatus').value,
            next_maintenance_date: document.getElementById('msvNextDate').value,
        };

        try {
            const res = await window.api.post('/services', payload);
            if (res.success) {
                if (window.addNotification) {
                    window.addNotification(
                        'Service Record Created',
                        `Service record for "${payload.service_type}" was successfully created.`,
                        'service'
                    );
                }
                window.showToast('Service added successfully!', 'success');
                window.CustomerForm.closeServiceModal();
                window.router.navigate('/services');
            } else {
                if (res.errors) {
                    const fieldMap = {
                        'ac_unit_id': 'msvAcUnit',
                        'service_date': 'msvDate',
                        'service_type': 'msvServiceType',
                    };
                    for (const [key, messages] of Object.entries(res.errors)) {
                        const elId = fieldMap[key];
                        if (elId) {
                            const el = document.getElementById(elId);
                            if (el) el.style.borderColor = '#ef4444';
                            const errEl = document.getElementById('err_' + elId);
                            if (errEl) { errEl.innerText = messages[0]; errEl.style.display = 'block'; }
                        }
                    }
                } else {
                    window.showToast(res.message || 'Error saving service', 'error');
                }
            }
        } catch (err) {
            window.showToast('Failed to save service', 'error');
            console.error(err);
        } finally {
            btn.disabled = false;
            btn.innerHTML = '<i class="fa-solid fa-floppy-disk" style="margin-right:6px;"></i>Save Service';
        }
    },
};
