window.ProfileView = {
    render: async (container) => {
        // Fetch current user
        const response = await window.api.get('/auth/me');
        if (!response.success) {
            window.showToast('Failed to load profile', 'error');
            return;
        }
        const user = response.data;

        // Split name into first and last for display if possible
        let firstName = user.name;
        let lastName = '';
        if (user.name.includes(' ')) {
            const parts = user.name.split(' ');
            firstName = parts[0];
            lastName = parts.slice(1).join(' ');
        }

        const content = `
            <div>
                <div class="table-header-row" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px;">
                    <div>
                        <h1 style="font-size: 28px; margin-bottom: 8px;">My Profile</h1>
                        
                    </div>
                </div>

                <div class="responsive-grid" style="display: grid; grid-template-columns: 1fr 2fr; gap: 24px;">
                    <!-- Left Column: Profile Card -->
                    <div class="glass-panel" style="padding: 32px; text-align: center; height: fit-content;">
                        <div style="position: relative; display: inline-block; margin-bottom: 24px;">
                            <img id="profileImageDisplay" src="${user.profile_image ? user.profile_image : `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=10B981&color=fff&size=128`}" alt="Profile Picture" style="width: 120px; height: 120px; border-radius: 50%; border: 4px solid var(--border-glass); box-shadow: var(--shadow-glass); object-fit: cover;">
                            
                            <input type="file" id="avatarInput" accept="image/*" style="display: none;">
                            
                            <button id="uploadAvatarBtn" style="position: absolute; bottom: 0; right: 0; background: var(--primary); color: white; border: none; border-radius: 50%; width: 36px; height: 36px; cursor: pointer; box-shadow: 0 4px 12px rgba(79, 70, 229, 0.4); display: flex; align-items: center; justify-content: center; transition: transform 0.2s;">
                                <i class="fa-solid fa-camera"></i>
                            </button>
                        </div>
                        <h2 style="font-size: 22px; margin-bottom: 8px;">${user.name}</h2>
                        <p style="color: var(--text-muted); margin-bottom: 16px;">${user.email}</p>
                    </div>

                    <!-- Right Column: Settings Form -->
                    <div class="glass-panel" style="padding: 32px;">
                        <h3 style="font-size: 18px; margin-bottom: 24px; border-bottom: 1px solid var(--border-glass); padding-bottom: 12px;">Personal Information</h3>
                        
                        <form id="profileForm">
                            <div class="responsive-grid" style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 20px;">
                                <div>
                                    <label style="display: block; color: var(--text-muted); font-size: 13px; margin-bottom: 8px;">First Name</label>
                                    <input type="text" id="prof_first_name" value="${firstName}" style="width: 100%; padding: 12px 16px; background: rgba(0,0,0,0.1); border: 1px solid var(--border-glass); border-radius: 8px; color: var(--text-main); outline: none;">
                                </div>
                                <div>
                                    <label style="display: block; color: var(--text-muted); font-size: 13px; margin-bottom: 8px;">Last Name</label>
                                    <input type="text" id="prof_last_name" value="${lastName}" style="width: 100%; padding: 12px 16px; background: rgba(0,0,0,0.1); border: 1px solid var(--border-glass); border-radius: 8px; color: var(--text-main); outline: none;">
                                </div>
                            </div>
                            
                            <div style="margin-bottom: 20px;">
                                <label style="display: block; color: var(--text-muted); font-size: 13px; margin-bottom: 8px;">Email Address</label>
                                <input type="email" id="prof_email" value="${user.email}" style="width: 100%; padding: 12px 16px; background: rgba(0,0,0,0.1); border: 1px solid var(--border-glass); border-radius: 8px; color: var(--text-main); outline: none;">
                            </div>

                            <div style="margin-bottom: 32px;">
                                <label style="display: block; color: var(--text-muted); font-size: 13px; margin-bottom: 8px;">Phone Number</label>
                                <input type="text" id="prof_phone" value="${user.phone || ''}" style="width: 100%; padding: 12px 16px; background: rgba(0,0,0,0.1); border: 1px solid var(--border-glass); border-radius: 8px; color: var(--text-main); outline: none;">
                            </div>

                            <h3 style="font-size: 18px; margin-bottom: 24px; border-bottom: 1px solid var(--border-glass); padding-bottom: 12px;">Security</h3>

                            <div style="margin-bottom: 20px;">
                                <label style="display: block; color: var(--text-muted); font-size: 13px; margin-bottom: 8px;">Current Password</label>
                                <input type="password" id="prof_current_password" placeholder="Enter current password (if changing)" style="width: 100%; padding: 12px 16px; background: rgba(0,0,0,0.1); border: 1px solid var(--border-glass); border-radius: 8px; color: var(--text-main); outline: none;">
                            </div>

                            <div style="margin-bottom: 32px;">
                                <label style="display: block; color: var(--text-muted); font-size: 13px; margin-bottom: 8px;">New Password</label>
                                <input type="password" id="prof_new_password" placeholder="Enter new password" style="width: 100%; padding: 12px 16px; background: rgba(0,0,0,0.1); border: 1px solid var(--border-glass); border-radius: 8px; color: var(--text-main); outline: none;">
                            </div>

                            <div style="display: flex; justify-content: flex-end; gap: 16px;">
                                <button type="submit" id="saveProfileBtn" style="padding: 10px 24px; background: var(--primary); border: none; color: white; border-radius: 8px; cursor: pointer; font-weight: 600; box-shadow: 0 4px 12px var(--primary-glow);">Save Changes</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        `;

        container.innerHTML = window.renderLayout(content);

        document.getElementById('profileForm').addEventListener('submit', async (e) => {
            e.preventDefault();
            const btn = document.getElementById('saveProfileBtn');
            const originalText = btn.innerText;
            btn.innerHTML = '<div class="spinner" style="width: 16px; height: 16px; border-width: 2px;"></div>';
            btn.disabled = true;

            const name = (document.getElementById('prof_first_name').value + ' ' + document.getElementById('prof_last_name').value).trim();
            const email = document.getElementById('prof_email').value;
            const phone = document.getElementById('prof_phone').value;
            const current_password = document.getElementById('prof_current_password').value;
            const new_password = document.getElementById('prof_new_password').value;

            const payload = { name, email, phone };
            if (new_password) {
                payload.current_password = current_password;
                payload.new_password = new_password;
            }

            const updateRes = await window.api.request('/auth/me', {
                method: 'PUT',
                body: JSON.stringify(payload)
            });

            btn.innerHTML = originalText;
            btn.disabled = false;

            if (updateRes.success) {
                window.showToast('Profile updated successfully');
                document.getElementById('prof_current_password').value = '';
                document.getElementById('prof_new_password').value = '';
                // re-render to update the visual layout names
                setTimeout(() => window.router.navigate('/profile'), 500);
            } else {
                window.showToast(updateRes.message || 'Failed to update profile', 'error');
            }
        });

        // Avatar Upload Logic
        const avatarInput = document.getElementById('avatarInput');
        const uploadBtn = document.getElementById('uploadAvatarBtn');
        const profileImageDisplay = document.getElementById('profileImageDisplay');

        uploadBtn.addEventListener('click', () => {
            avatarInput.click();
        });

        avatarInput.addEventListener('change', async (e) => {
            const file = e.target.files[0];
            if (!file) return;

            // Optional: Preview immediately
            const reader = new FileReader();
            reader.onload = (e) => {
                profileImageDisplay.src = e.target.result;
            };
            reader.readAsDataURL(file);

            // Upload to server
            const formData = new FormData();
            formData.append('avatar', file);

            uploadBtn.innerHTML = '<div class="spinner" style="width: 16px; height: 16px; border-width: 2px;"></div>';
            uploadBtn.disabled = true;

            const res = await window.api.post('/auth/me/avatar', formData);
            
            uploadBtn.innerHTML = '<i class="fa-solid fa-camera"></i>';
            uploadBtn.disabled = false;

            if (res.success) {
                window.showToast('Profile picture updated!');
                profileImageDisplay.src = res.data.profile_image;
            } else {
                window.showToast(res.message || 'Failed to update profile picture', 'error');
            }
        });
    }
};
