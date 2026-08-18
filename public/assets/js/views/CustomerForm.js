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
                        <p style="color: #64748b; font-size: 14px;">Fill out the information below to ${isEdit ? 'update the' : 'create a new'} customer profile.</p>
                    </div>
                    <div>
                        <button onclick="window.router.navigate('/customers')" style="display: flex; align-items: center; gap: 8px; padding: 8px 16px; background: transparent; color: #0f172a; border: 1px solid #e2e8f0; border-radius: 8px; cursor: pointer; font-weight: 600; font-size: 14px;">
                            <i class="fa-solid fa-arrow-left"></i> <span class="hide-on-mobile">Back to List</span>
                        </button>
                    </div>
                </div>

                <div class="glass-panel" style="background: #ffffff; padding: 32px; border-radius: 12px; margin: 0 auto;">
                    <form id="customerForm" novalidate>
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 20px;">
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

                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 20px;">
                            <div>
                                <label style="display: block; margin-bottom: 8px; font-size: 14px; font-weight: 500;">Mobile *</label>
                                <input type="text" id="cMobile" value="${customer?.mobile || ''}" required style="width: 100%; padding: 12px; border-radius: 8px; border: 1px solid var(--border-glass); background: transparent; color: var(--text-main); outline: none;">
                                <div id="err_cMobile" style="color: #ef4444; font-size: 12px; margin-top: 4px; display: none;"></div>
                            </div>
                            <div>
                                <label style="display: block; margin-bottom: 8px; font-size: 14px; font-weight: 500;">WhatsApp No.</label>
                                <input type="text" id="cWhatsapp" value="${customer?.whatsapp_no || ''}" style="width: 100%; padding: 12px; border-radius: 8px; border: 1px solid var(--border-glass); background: transparent; color: var(--text-main); outline: none;">
                                <div id="err_cWhatsapp" style="color: #ef4444; font-size: 12px; margin-top: 4px; display: none;"></div>
                            </div>
                        </div>

                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 20px;">
                            <div>
                                <label style="display: block; margin-bottom: 8px; font-size: 14px; font-weight: 500;">Email Address</label>
                                <input type="email" id="cEmail" value="${customer?.email || ''}" style="width: 100%; padding: 12px; border-radius: 8px; border: 1px solid var(--border-glass); background: transparent; color: var(--text-main); outline: none;">
                                <div id="err_cEmail" style="color: #ef4444; font-size: 12px; margin-top: 4px; display: none;"></div>
                            </div>
                            <div>
                                <label style="display: block; margin-bottom: 8px; font-size: 14px; font-weight: 500;">Date of Birth</label>
                                <input type="date" id="cDob" value="${customer?.dob || ''}" style="width: 100%; padding: 12px; border-radius: 8px; border: 1px solid var(--border-glass); background: transparent; color: var(--text-main); outline: none;">
                                <div id="err_cDob" style="color: #ef4444; font-size: 12px; margin-top: 4px; display: none;"></div>
                            </div>
                        </div>

                        <div style="margin-bottom: 20px;">
                            <label style="display: block; margin-bottom: 8px; font-size: 14px; font-weight: 500;">Customer Photo</label>
                            ${customer?.image ? `<div style="margin-bottom: 12px;"><img src="${customer.image}" style="height: 64px; border-radius: 8px; border: 1px solid var(--border-glass);"></div>` : ''}
                            <input type="file" id="cImage" accept="image/*" style="width: 100%; padding: 12px; border-radius: 8px; border: 1px solid var(--border-glass); background: transparent; color: var(--text-main); outline: none;">
                        </div>

                        <div style="margin-bottom: 20px;">
                            <label style="display: block; margin-bottom: 8px; font-size: 14px; font-weight: 500;">Full Address</label>
                            <textarea id="cAddress" rows="3" style="width: 100%; padding: 12px; border-radius: 8px; border: 1px solid var(--border-glass); background: transparent; color: var(--text-main); outline: none; font-family: inherit;">${customer?.address || ''}</textarea>
                            <div id="err_cAddress" style="color: #ef4444; font-size: 12px; margin-top: 4px; display: none;"></div>
                        </div>

                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 32px;">
                            <div>
                                <label style="display: block; margin-bottom: 8px; font-size: 14px; font-weight: 500;">City</label>
                                <input type="text" id="cCity" value="${customer?.city || ''}" style="width: 100%; padding: 12px; border-radius: 8px; border: 1px solid var(--border-glass); background: transparent; color: var(--text-main); outline: none;">
                                <div id="err_cCity" style="color: #ef4444; font-size: 12px; margin-top: 4px; display: none;"></div>
                            </div>
                            <div>
                                <label style="display: block; margin-bottom: 8px; font-size: 14px; font-weight: 500;">Country</label>
                                <input type="text" id="cCountry" value="${customer?.country || 'India'}" style="width: 100%; padding: 12px; border-radius: 8px; border: 1px solid var(--border-glass); background: transparent; color: var(--text-main); outline: none;">
                                <div id="err_cCountry" style="color: #ef4444; font-size: 12px; margin-top: 4px; display: none;"></div>
                            </div>
                        </div>

                        <div style="display: flex; justify-content: flex-end; gap: 16px;">
                            <button type="button" onclick="window.router.navigate('/customers')" style="padding: 12px 24px; border-radius: 8px; border: 1px solid var(--border-glass); background: transparent; color: var(--text-main); cursor: pointer; font-weight: 600;">Cancel</button>
                            <button type="submit" id="saveCustomerBtn" style="padding: 12px 24px; border-radius: 8px; border: none; background: var(--primary); color: white; cursor: pointer; font-weight: 600; box-shadow: 0 4px 12px var(--primary-glow);">Save Customer</button>
                        </div>
                    </form>
                </div>
            </div>
        `;

        container.innerHTML = window.renderLayout(content);

        document.getElementById('customerForm').addEventListener('submit', async (e) => {
            e.preventDefault();

            const payload = new FormData();
            payload.append('customer_code', document.getElementById('cCode').value);
            payload.append('full_name', document.getElementById('cName').value);
            payload.append('mobile', document.getElementById('cMobile').value);
            payload.append('whatsapp_no', document.getElementById('cWhatsapp').value);
            payload.append('email', document.getElementById('cEmail').value);
            payload.append('dob', document.getElementById('cDob').value);
            payload.append('address', document.getElementById('cAddress').value);
            payload.append('city', document.getElementById('cCity').value);
            payload.append('country', document.getElementById('cCountry').value);
            payload.append('status', 'active');

            const fileInput = document.getElementById('cImage');
            if (fileInput.files.length > 0) {
                payload.append('image', fileInput.files[0]);
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
            if (isEdit) {
                payload.append('_method', 'PUT'); // Laravel form method spoofing
                res = await window.api.put('/customers/' + params.id, payload);
            } else {
                res = await window.api.post('/customers', payload);
            }

            if (res.success) {
                window.showToast(isEdit ? 'Customer updated successfully!' : 'Customer created successfully!', 'success');
                window.router.navigate('/customers');
            } else {
                let errorMessage = res.message || 'Error saving customer';
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

                    const firstErrorKey = Object.keys(res.errors)[0];
                    if (res.errors[firstErrorKey] && res.errors[firstErrorKey].length > 0) {
                        errorMessage = res.errors[firstErrorKey][0];
                    }
                }
                window.showToast(errorMessage, 'error');
                btn.disabled = false;
                btn.innerText = 'Save Customer';
            }
        });
    }
};
