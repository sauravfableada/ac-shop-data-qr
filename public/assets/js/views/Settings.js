window.Settings = {
    render: async (container) => {
        const content = `
            <div style="margin: 0 auto; padding-bottom: 40px;">
                <div style="margin-bottom: 24px;">
                    <h1 style="font-size: 24px; color: #0f172a; margin-bottom: 4px;">Settings</h1>
                    <p style="color: #64748b; margin: 0;">Configure your application settings</p>
                </div>

                <div class="glass-panel" style="background: #ffffff; border-radius: 12px; padding: 24px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
                    <form id="settingsForm" onsubmit="window.Settings.save(event)" novalidate>
                        
                        <!-- Company Details -->
                        <div style="margin-bottom: 24px;">
                            <h3 style="font-size: 16px; font-weight: 600; color: #0f172a; margin-bottom: 16px; padding-bottom: 8px; border-bottom: 1px solid var(--border-glass);">Company Information</h3>
                            
                            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 16px; margin-bottom: 16px;">
                                <div>
                                    <label style="display: block; font-size: 13px; font-weight: 600; color: #475569; margin-bottom: 6px;">Company Name <span style="color: #ef4444;">*</span></label>
                                    <input type="text" id="company_name" name="company_name" required style="width: 100%; padding: 10px 12px; border: 1px solid var(--border-glass); border-radius: 8px; background: #f8fafc; color: var(--text-main); font-size: 14px; outline: none; transition: border-color 0.2s;">
                                </div>
                                <div>
                                    <label style="display: block; font-size: 13px; font-weight: 600; color: #475569; margin-bottom: 6px;">Company Number</label>
                                    <input type="text" id="company_number" name="company_number" style="width: 100%; padding: 10px 12px; border: 1px solid var(--border-glass); border-radius: 8px; background: #f8fafc; color: var(--text-main); font-size: 14px; outline: none; transition: border-color 0.2s;">
                                </div>
                            </div>
                            
                            <div style="margin-bottom: 16px;">
                                <label style="display: block; font-size: 13px; font-weight: 600; color: #475569; margin-bottom: 6px;">GST Number</label>
                                <input type="text" id="gst" name="gst" style="width: 100%; max-width: 400px; padding: 10px 12px; border: 1px solid var(--border-glass); border-radius: 8px; background: #f8fafc; color: var(--text-main); font-size: 14px; outline: none; transition: border-color 0.2s;">
                            </div>
                            
                            <div style="margin-bottom: 24px;">
                                <label style="display: block; font-size: 13px; font-weight: 600; color: #475569; margin-bottom: 6px;">Address</label>
                                <textarea id="address" name="address" rows="3" style="width: 100%; padding: 10px 12px; border: 1px solid var(--border-glass); border-radius: 8px; background: #f8fafc; color: var(--text-main); font-size: 14px; outline: none; resize: vertical; transition: border-color 0.2s;"></textarea>
                            </div>
                        </div>

                        <!-- Logos -->
                        <div style="margin-bottom: 32px;">
                            <h3 style="font-size: 16px; font-weight: 600; color: #0f172a; margin-bottom: 16px; padding-bottom: 8px; border-bottom: 1px solid var(--border-glass);">Branding</h3>
                            
                            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 24px;">
                                <!-- Logo -->
                                <div>
                                    <label style="display: block; font-size: 13px; font-weight: 600; color: #475569; margin-bottom: 12px;">Company Logo</label>
                                    <div style="display: flex; gap: 16px; align-items: flex-start;">
                                        <div id="logoPreview" style="width: 100px; height: 100px; border: 1px dashed #cbd5e1; border-radius: 8px; display: flex; align-items: center; justify-content: center; background: #f8fafc; overflow: hidden;">
                                            <i class="fa-solid fa-image" style="font-size: 24px; color: #94a3b8;"></i>
                                        </div>
                                        <div>
                                            <input type="file" id="company_logo" name="company_logo" accept="image/*" style="display: none;" onchange="window.Settings.previewImage(this, 'logoPreview')">
                                            <label for="company_logo" style="display: inline-block; padding: 8px 16px; background: white; border: 1px solid var(--border-glass); border-radius: 6px; font-size: 13px; font-weight: 600; color: #475569; cursor: pointer; margin-bottom: 8px; box-shadow: 0 1px 2px rgba(0,0,0,0.05); transition: 0.2s;">
                                                <i class="fa-solid fa-upload" style="margin-right: 6px;"></i> Choose File
                                            </label>
                                            <p style="font-size: 11px; color: #94a3b8; margin: 0;">Recommended: PNG or JPG, max 2MB.</p>
                                        </div>
                                    </div>
                                </div>
                                
                                <!-- Favicon -->
                                <div>
                                    <label style="display: block; font-size: 13px; font-weight: 600; color: #475569; margin-bottom: 12px;">Company Favicon</label>
                                    <div style="display: flex; gap: 16px; align-items: flex-start;">
                                        <div id="faviconPreview" style="width: 64px; height: 64px; border: 1px dashed #cbd5e1; border-radius: 8px; display: flex; align-items: center; justify-content: center; background: #f8fafc; overflow: hidden;">
                                            <i class="fa-solid fa-image" style="font-size: 20px; color: #94a3b8;"></i>
                                        </div>
                                        <div>
                                            <input type="file" id="company_favicon" name="company_favicon" accept="image/png, image/x-icon, image/ico" style="display: none;" onchange="window.Settings.previewImage(this, 'faviconPreview')">
                                            <label for="company_favicon" style="display: inline-block; padding: 8px 16px; background: white; border: 1px solid var(--border-glass); border-radius: 6px; font-size: 13px; font-weight: 600; color: #475569; cursor: pointer; margin-bottom: 8px; box-shadow: 0 1px 2px rgba(0,0,0,0.05); transition: 0.2s;">
                                                <i class="fa-solid fa-upload" style="margin-right: 6px;"></i> Choose File
                                            </label>
                                            <p style="font-size: 11px; color: #94a3b8; margin: 0;">Recommended: PNG or ICO, 32x32px.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Code Settings -->
                        <div style="margin-bottom: 32px;">
                            <h3 style="font-size: 16px; font-weight: 600; color: #0f172a; margin-bottom: 16px; padding-bottom: 8px; border-bottom: 1px solid var(--border-glass);">Scanning Configuration</h3>
                            
                            <label style="display: block; font-size: 13px; font-weight: 600; color: #475569; margin-bottom: 12px;">Preferred Code Type</label>
                            <div style="display: flex; gap: 24px;">
                                <label style="display: flex; align-items: center; gap: 8px; cursor: pointer; font-size: 14px; color: #475569;">
                                    <input type="radio" name="code_type" value="qr" checked style="accent-color: #ff9f43; width: 16px; height: 16px;">
                                    <i class="fa-solid fa-qrcode" style="color: #64748b;"></i> QR Code
                                </label>
                                <label style="display: flex; align-items: center; gap: 8px; cursor: pointer; font-size: 14px; color: #475569;">
                                    <input type="radio" name="code_type" value="barcode" style="accent-color: #ff9f43; width: 16px; height: 16px;">
                                    <i class="fa-solid fa-barcode" style="color: #64748b;"></i> Barcode
                                </label>
                            </div>
                        </div>

                        <!-- Actions -->
                        <div style="display: flex; justify-content: flex-end; padding-top: 16px; border-top: 1px solid var(--border-glass);">
                            <button type="submit" id="saveSettingsBtn" style="background: #ff9f43; color: white; border: none; padding: 12px 24px; border-radius: 8px; font-weight: 600; cursor: pointer; font-size: 14px; box-shadow: 0 4px 6px -1px rgba(255, 159, 67, 0.3); transition: 0.2s;">
                                <i class="fa-solid fa-save" style="margin-right: 6px;"></i> Save Settings
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        `;

        container.innerHTML = window.renderLayout(content);
        await window.Settings.loadData();
    },

    previewImage: (input, previewId) => {
        const previewContainer = document.getElementById(previewId);
        if (input.files && input.files[0]) {
            const reader = new FileReader();
            reader.onload = function (e) {
                previewContainer.innerHTML = `<img src="${e.target.result}" style="width: 100%; height: 100%; object-fit: contain;">`;
            }
            reader.readAsDataURL(input.files[0]);
        }
    },

    loadData: async () => {
        try {
            const res = await window.api.get('/settings');
            if (res.success && res.data) {
                const settings = res.data;

                // Populate text fields
                ['company_name', 'company_number', 'gst', 'address'].forEach(key => {
                    if (settings[key] && document.getElementById(key)) {
                        document.getElementById(key).value = settings[key];
                    }
                });

                // Populate code_type radio button
                if (settings['code_type']) {
                    const rb = document.querySelector(`input[name="code_type"][value="${settings['code_type']}"]`);
                    if (rb) rb.checked = true;
                }

                // Populate image previews
                if (settings['company_logo']) {
                    document.getElementById('logoPreview').innerHTML = `<img src="${settings['company_logo']}" style="width: 100%; height: 100%; object-fit: contain;">`;
                }
                if (settings['company_favicon']) {
                    document.getElementById('faviconPreview').innerHTML = `<img src="${settings['company_favicon']}" style="width: 100%; height: 100%; object-fit: contain;">`;
                }
            }
        } catch (e) {
            console.error('Failed to load settings', e);
        }
    },

    save: async (e) => {
        e.preventDefault();
        const form = e.target;

        // Basic validation
        if (!form.company_name.value.trim()) {
            window.showToast('Company Name is required', 'error');
            return;
        }

        const btn = document.getElementById('saveSettingsBtn');
        const originalText = btn.innerHTML;
        btn.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin"></i> Saving...';
        btn.disabled = true;

        try {
            const formData = new FormData(form);

            // Use fetch directly for FormData to avoid default JSON stringification in api.js
            const token = localStorage.getItem('auth_token');
            const response = await fetch('/api/settings', {
                method: 'POST', // POST for file uploads
                headers: {
                    'Authorization': 'Bearer ' + token,
                    'Accept': 'application/json'
                },
                body: formData
            });

            const res = await response.json();

            if (res.success) {
                window.showToast('Settings saved successfully!', 'success');
                window.appSettings = res.data;

                // Dynamically update the header
                const headerLogo = document.querySelector('.header-left img');
                const headerText = document.querySelector('.header-left span');
                if (headerLogo) headerLogo.src = window.appSettings.company_logo || '/public/assets/logos/crmfavicon.png';
                if (headerText) headerText.textContent = window.appSettings.company_name || 'Maimoon Sales';

                // Dynamically update the favicon and title
                document.title = (window.appSettings.company_name || 'Maimoon Sales') + ' - AC Service Management';
                document.querySelectorAll('link[rel="icon"], link[rel="shortcut icon"]').forEach(link => {
                    link.href = window.appSettings.company_favicon || '/public/assets/logos/crmfavicon.png';
                });
            } else {
                window.showToast(res.message || 'Failed to save settings', 'error');
            }
        } catch (err) {
            console.error(err);
            window.showToast('An error occurred while saving', 'error');
        } finally {
            btn.innerHTML = originalText;
            btn.disabled = false;
        }
    }
};
