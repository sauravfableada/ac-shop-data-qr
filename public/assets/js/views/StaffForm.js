window.StaffForm = {
    render: async (container) => {
        const pathParts = window.location.pathname.split('/');
        const isEdit = pathParts.includes('edit');
        const id = isEdit ? pathParts[pathParts.length - 1] : null;

        let staff = {
            name: '',
            email: '',
            phone: '',
            password: '',
            profile_image: ''
        };

        if (isEdit && id) {
            const response = await window.api.get(`/admin/staff/${id}`);
            if (response.success) {
                staff = response.data;
            } else {
                window.router.navigate('/staff');
                return;
            }
        }

        const title = isEdit ? 'Edit Staff' : 'Add New Staff';

        const content = `
            <div>
                <div class="table-header-row" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px;">
                    <div>
                        <h1 style="font-size: 24px; margin-bottom: 4px; color: #0f172a;">${title}</h1>
                    </div>
                    <div>
                        <button onclick="window.router.navigate('/staff')" style="display: flex; align-items: center; gap: 8px; padding: 8px 16px; background: transparent; color: #0f172a; border: 1px solid #e2e8f0; border-radius: 8px; cursor: pointer; font-weight: 600; font-size: 14px;">
                            <i class="fa-solid fa-arrow-left"></i> <span class="hide-on-mobile">Back to List</span>
                        </button>
                    </div>
                </div>

                <div class="glass-panel" style="background: #ffffff; padding: 32px; border-radius: 12px; margin: 0 auto;">
                    <form id="staffForm" novalidate>
                        <div class="grid-2-col" style="margin-bottom: 20px;">
                            <div>
                                <label style="display: block; margin-bottom: 8px; font-size: 14px; font-weight: 500;">Full Name *</label>
                                <input type="text" id="name" value="${staff.name || ''}" required style="width: 100%; padding: 12px; border-radius: 8px; border: 1px solid var(--border-glass); background: transparent; color: var(--text-main); outline: none;">
                                <div id="err_name" style="color: #ef4444; font-size: 12px; margin-top: 4px; display: none;"></div>
                            </div>
                            <div>
                                <label style="display: block; margin-bottom: 8px; font-size: 14px; font-weight: 500;">Email Address *</label>
                                <input type="email" id="email" value="${staff.email || ''}" required style="width: 100%; padding: 12px; border-radius: 8px; border: 1px solid var(--border-glass); background: transparent; color: var(--text-main); outline: none;">
                                <div id="err_email" style="color: #ef4444; font-size: 12px; margin-top: 4px; display: none;"></div>
                            </div>
                        </div>

                        <div class="grid-2-col" style="margin-bottom: 20px;">
                            <div>
                                <label style="display: block; margin-bottom: 8px; font-size: 14px; font-weight: 500;">Phone Number</label>
                                <input type="text" id="phone" value="${staff.phone || ''}" style="width: 100%; padding: 12px; border-radius: 8px; border: 1px solid var(--border-glass); background: transparent; color: var(--text-main); outline: none;">
                                <div id="err_phone" style="color: #ef4444; font-size: 12px; margin-top: 4px; display: none;"></div>
                            </div>
                            <div>
                                <label style="display: block; margin-bottom: 8px; font-size: 14px; font-weight: 500;">${isEdit ? 'Password (leave blank to keep current)' : 'Password *'}</label>
                                <input type="password" id="password" ${!isEdit ? 'required' : ''} style="width: 100%; padding: 12px; border-radius: 8px; border: 1px solid var(--border-glass); background: transparent; color: var(--text-main); outline: none;">
                                <div id="err_password" style="color: #ef4444; font-size: 12px; margin-top: 4px; display: none;"></div>
                            </div>
                        </div>

                        <div style="display: grid; grid-template-columns: 1fr; gap: 20px; margin-bottom: 32px;">
                            <div>
                                <label style="display: block; margin-bottom: 8px; font-size: 14px; font-weight: 500;">Profile Image</label>
                                ${staff.profile_image ? `<div style="margin-bottom: 12px;"><img src="${staff.profile_image}" style="height: 64px; border-radius: 8px; border: 1px solid var(--border-glass); object-fit: cover;"></div>` : ''}
                                <input type="file" id="profile_image" accept="image/*" style="width: 100%; padding: 12px; border-radius: 8px; border: 1px solid var(--border-glass); background: transparent; color: var(--text-main); outline: none;">
                                <div id="err_profile_image" style="color: #ef4444; font-size: 12px; margin-top: 4px; display: none;"></div>
                            </div>
                        </div>

                        <div id="formError" style="color: #ef4444; margin-bottom: 16px; display: none; font-size: 14px;"></div>

                        <div style="display: flex; justify-content: flex-end; align-items: center; gap: 16px;">
                            <button type="button" onclick="window.router.navigate('/staff')" style="padding: 12px 24px; border-radius: 8px; border: 1px solid var(--border-glass); background: transparent; color: var(--text-main); cursor: pointer; font-weight: 600;">Cancel</button>
                            <button type="submit" id="saveBtn" style="padding: 12px 24px; border-radius: 8px; border: none; background: var(--primary); color: white; cursor: pointer; font-weight: 600; box-shadow: 0 4px 12px var(--primary-glow);">${isEdit ? 'Update Staff' : 'Save Staff'}</button>
                        </div>
                    </form>
                </div>
            </div>
        `;

        container.innerHTML = window.renderLayout(content);

        document.getElementById('staffForm').addEventListener('submit', async (e) => {
            e.preventDefault();
            const btn = document.getElementById('saveBtn');
            
            // Clear previous errors
            document.querySelectorAll('#staffForm input').forEach(input => {
                input.style.borderColor = 'var(--border-glass)';
            });
            document.querySelectorAll('[id^="err_"]').forEach(el => {
                el.style.display = 'none';
                el.innerText = '';
            });

            // Note: Since we have a file upload, we need to use FormData
            const formData = new FormData();
            formData.append('name', document.getElementById('name').value);
            formData.append('email', document.getElementById('email').value);
            formData.append('phone', document.getElementById('phone').value);
            
            const password = document.getElementById('password').value;
            if (password) {
                formData.append('password', password);
            }

            const imageFile = document.getElementById('profile_image').files[0];
            if (imageFile) {
                formData.append('profile_image', imageFile);
            }

            if (isEdit) {
                // For PUT request with FormData in Laravel, spoofing the method is needed
                formData.append('_method', 'PUT');
            }

            btn.disabled = true;
            btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin" style="margin-right:6px;"></i>Saving...';

            try {
                const token = localStorage.getItem('auth_token');
                const url = isEdit ? '/api/admin/staff/' + id : '/api/admin/staff';
                
                const response = await fetch(url, {
                    method: 'POST', // Always POST for FormData in this context with _method=PUT
                    headers: {
                        'Authorization': 'Bearer ' + token,
                        'Accept': 'application/json'
                    },
                    body: formData
                });
                
                const result = await response.json();

                if (result.success) {
                    const staffName = document.getElementById('name').value;
                    if (window.addNotification) {
                        window.addNotification(
                            isEdit ? 'Staff Updated' : 'Staff Created',
                            `Staff member "${staffName}" was successfully ${isEdit ? 'updated' : 'created'}.`,
                            'staff'
                        );
                    }
                    window.showToast(isEdit ? 'Staff updated successfully!' : 'Staff created successfully!', 'success');
                    window.router.navigate('/staff');
                } else {
                    if (result.errors) {
                        for (const [key, messages] of Object.entries(result.errors)) {
                            const input = document.getElementById(key);
                            if (input) input.style.borderColor = '#ef4444';

                            const errDiv = document.getElementById('err_' + key);
                            if (errDiv) {
                                errDiv.innerText = messages[0];
                                errDiv.style.display = 'block';
                            }
                        }
                    }
                    window.showToast(result.message || 'Failed to save staff.', 'error');
                    btn.disabled = false;
                    btn.innerHTML = isEdit ? 'Update Staff' : 'Save Staff';
                }
            } catch (err) {
                window.showToast('An error occurred. Please try again.', 'error');
                btn.disabled = false;
                btn.innerHTML = isEdit ? 'Update Staff' : 'Save Staff';
            }
        });
    }
};
