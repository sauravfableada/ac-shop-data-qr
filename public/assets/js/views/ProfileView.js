window.ProfileView = {
    render: async (container) => {
        const response = await window.api.get('/auth/me');
        if (!response.success) {
            window.showToast('Failed to load profile', 'error');
            return;
        }
        const user = response.data;

        let firstName = user.name;
        let lastName = '';
        if (user.name && user.name.includes(' ')) {
            const parts = user.name.split(' ');
            firstName = parts[0];
            lastName = parts.slice(1).join(' ');
        }

        const initials = (firstName.charAt(0) + (lastName.charAt(0) || '')).toUpperCase();
        const avatarSrc = user.profile_image
            ? user.profile_image
            : `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=10B981&color=fff&size=128`;

        const joinedDate = user.created_at
            ? new Date(user.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
            : '—';

        const content = `
            <div>
                <!-- Page Title -->
                <div style="margin-bottom: 8px;">
                    <h1 style="font-size: 24px; font-weight: 700; color: #0f172a; margin-bottom: 4px;">My Profile</h1>
                    <p style="font-size: 13px; color: #94a3b8;">Home &rsaquo; My Profile</p>
                </div>

                <div style="display: grid; grid-template-columns: 300px 1fr; gap: 24px; margin-top: 24px;" class="profile-grid">

                    <!-- LEFT: Profile Card -->
                    <div class="glass-panel" style="padding: 0; overflow: hidden; border-radius: 16px; height: fit-content;">
                        <!-- Banner -->
                        <div style="height: 100px; background: linear-gradient(135deg, #a5b4fc 0%, #818cf8 100%); position: relative;"></div>
                        
                        <!-- Avatar -->
                        <div style="display: flex; flex-direction: column; align-items: center; padding: 0 24px 24px; margin-top: -50px; text-align: center;">
                            <div style="position: relative; display: inline-block; margin-bottom: 16px;">
                                <img id="profileImageDisplay" src="${avatarSrc}" alt="Profile"
                                    style="width: 96px; height: 96px; border-radius: 50%; border: 4px solid #fff; object-fit: cover; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
                                <button id="uploadAvatarBtn"
                                    style="position: absolute; bottom: 2px; right: 2px; background: #1e293b; color: white; border: none; border-radius: 50%; width: 30px; height: 30px; cursor: pointer; display: flex; align-items: center; justify-content: center; font-size: 13px;">
                                    <i class="fa-solid fa-camera"></i>
                                </button>
                                <input type="file" id="avatarInput" accept="image/*" style="display: none;">
                            </div>

                            <h2 style="font-size: 18px; font-weight: 700; color: #0f172a; margin-bottom: 6px;">${user.name}</h2>
                            <span style="background: #e0e7ff; color: #4f46e5; font-size: 12px; font-weight: 600; padding: 3px 12px; border-radius: 20px;">${user.role_name || 'Administrator'}</span>

                            <!-- Info Rows -->
                            <div style="width: 100%; margin-top: 24px; display: flex; flex-direction: column; gap: 14px; text-align: left;">
                                <div style="display: flex; align-items: center; gap: 12px; font-size: 13px; color: #475569;">
                                    <i class="fa-regular fa-envelope" style="color: #6366f1; width: 16px;"></i>
                                    <span>${user.email || '—'}</span>
                                </div>
                                <div style="display: flex; align-items: center; gap: 12px; font-size: 13px; color: #475569;">
                                    <i class="fa-solid fa-phone" style="color: #6366f1; width: 16px;"></i>
                                    <span>${user.phone || '—'}</span>
                                </div>
                                <div style="display: flex; align-items: center; gap: 12px; font-size: 13px; color: #475569;">
                                    <i class="fa-solid fa-shield-halved" style="color: #6366f1; width: 16px;"></i>
                                    <span>${user.role_name || 'Administrator'}</span>
                                </div>
                                <div style="display: flex; align-items: center; gap: 12px; font-size: 13px; color: #475569;">
                                    <i class="fa-regular fa-calendar" style="color: #f97316; width: 16px;"></i>
                                    <span>Joined on<br><strong style="color: #0f172a;">${joinedDate}</strong></span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- RIGHT: Form Panel -->
                    <div class="glass-panel" style="padding: 32px; border-radius: 16px;">
                        <form id="profileForm">

                            <!-- Personal Information -->
                            <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 24px;">
                                <div style="width: 36px; height: 36px; background: #e0e7ff; border-radius: 50%; display: flex; align-items: center; justify-content: center;">
                                    <i class="fa-regular fa-user" style="color: #6366f1;"></i>
                                </div>
                                <h3 style="font-size: 16px; font-weight: 700; color: #0f172a;">Personal Information</h3>
                            </div>

                            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 16px;">
                                <div>
                                    <label style="display: block; font-size: 13px; font-weight: 500; color: #334155; margin-bottom: 8px;">First Name</label>
                                    <div style="display: flex; align-items: center; gap: 10px; border: 1px solid #e2e8f0; border-radius: 10px; padding: 10px 14px;">
                                        <i class="fa-regular fa-user" style="color: #94a3b8; font-size: 14px;"></i>
                                        <input type="text" id="prof_first_name" value="${firstName}"
                                            style="border: none; outline: none; width: 100%; font-size: 14px; color: #0f172a; background: transparent;">
                                    </div>
                                </div>
                                <div>
                                    <label style="display: block; font-size: 13px; font-weight: 500; color: #334155; margin-bottom: 8px;">Last Name</label>
                                    <div style="display: flex; align-items: center; gap: 10px; border: 1px solid #e2e8f0; border-radius: 10px; padding: 10px 14px;">
                                        <i class="fa-regular fa-user" style="color: #94a3b8; font-size: 14px;"></i>
                                        <input type="text" id="prof_last_name" value="${lastName}"
                                            style="border: none; outline: none; width: 100%; font-size: 14px; color: #0f172a; background: transparent;">
                                    </div>
                                </div>
                            </div>

                            <div style="margin-bottom: 16px;">
                                <label style="display: block; font-size: 13px; font-weight: 500; color: #334155; margin-bottom: 8px;">Email Address</label>
                                <div style="display: flex; align-items: center; gap: 10px; border: 1px solid #e2e8f0; border-radius: 10px; padding: 10px 14px;">
                                    <i class="fa-regular fa-envelope" style="color: #94a3b8; font-size: 14px;"></i>
                                    <input type="email" id="prof_email" value="${user.email || ''}"
                                        style="border: none; outline: none; width: 100%; font-size: 14px; color: #0f172a; background: transparent;">
                                </div>
                            </div>

                            <div style="margin-bottom: 36px;">
                                <label style="display: block; font-size: 13px; font-weight: 500; color: #334155; margin-bottom: 8px;">Phone Number</label>
                                <div style="display: flex; align-items: center; gap: 10px; border: 1px solid #e2e8f0; border-radius: 10px; padding: 10px 14px;">
                                    <i class="fa-solid fa-phone" style="color: #94a3b8; font-size: 14px;"></i>
                                    <input type="text" id="prof_phone" value="${user.phone || ''}" placeholder="Enter phone number"
                                        style="border: none; outline: none; width: 100%; font-size: 14px; color: #0f172a; background: transparent;">
                                </div>
                            </div>

                            <!-- Security -->
                            <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 24px;">
                                <div style="width: 36px; height: 36px; background: #dcfce7; border-radius: 50%; display: flex; align-items: center; justify-content: center;">
                                    <i class="fa-solid fa-lock" style="color: #16a34a;"></i>
                                </div>
                                <h3 style="font-size: 16px; font-weight: 700; color: #0f172a;">Security</h3>
                            </div>

                            <div style="margin-bottom: 16px;">
                                <label style="display: block; font-size: 13px; font-weight: 500; color: #334155; margin-bottom: 8px;">Current Password</label>
                                <div style="display: flex; align-items: center; gap: 10px; border: 1px solid #e2e8f0; border-radius: 10px; padding: 10px 14px;">
                                    <i class="fa-solid fa-lock" style="color: #94a3b8; font-size: 14px;"></i>
                                    <input type="password" id="prof_current_password" placeholder="Enter current password"
                                        style="border: none; outline: none; width: 100%; font-size: 14px; color: #0f172a; background: transparent;">
                                    <i class="fa-regular fa-eye" id="toggleCurrentPwd" style="color: #94a3b8; cursor: pointer; font-size: 14px;"></i>
                                </div>
                            </div>

                            <div style="margin-bottom: 36px;">
                                <label style="display: block; font-size: 13px; font-weight: 500; color: #334155; margin-bottom: 8px;">New Password</label>
                                <div style="display: flex; align-items: center; gap: 10px; border: 1px solid #e2e8f0; border-radius: 10px; padding: 10px 14px;">
                                    <i class="fa-solid fa-lock" style="color: #94a3b8; font-size: 14px;"></i>
                                    <input type="password" id="prof_new_password" placeholder="Enter new password"
                                        style="border: none; outline: none; width: 100%; font-size: 14px; color: #0f172a; background: transparent;">
                                    <i class="fa-regular fa-eye" id="toggleNewPwd" style="color: #94a3b8; cursor: pointer; font-size: 14px;"></i>
                                </div>
                            </div>

                            <!-- Save Button -->
                            <div style="display: flex; justify-content: flex-end;">
                                <button type="submit" id="saveProfileBtn"
                                    style="display: flex; align-items: center; gap: 8px; padding: 12px 28px; background: #0f172a; border: none; color: white; border-radius: 10px; cursor: pointer; font-weight: 600; font-size: 14px;">
                                    <i class="fa-regular fa-floppy-disk"></i> Save Changes
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        `;

        container.innerHTML = window.renderLayout(content);

        // Password toggle
        document.getElementById('toggleCurrentPwd').addEventListener('click', () => {
            const inp = document.getElementById('prof_current_password');
            inp.type = inp.type === 'password' ? 'text' : 'password';
        });
        document.getElementById('toggleNewPwd').addEventListener('click', () => {
            const inp = document.getElementById('prof_new_password');
            inp.type = inp.type === 'password' ? 'text' : 'password';
        });

        // Form submit
        document.getElementById('profileForm').addEventListener('submit', async (e) => {
            e.preventDefault();
            const btn = document.getElementById('saveProfileBtn');
            const originalHTML = btn.innerHTML;
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

            const updateRes = await window.api.put('/auth/me', payload);

            btn.innerHTML = originalHTML;
            btn.disabled = false;

            if (updateRes.success) {
                window.showToast('Profile updated successfully', 'success');
                document.getElementById('prof_current_password').value = '';
                document.getElementById('prof_new_password').value = '';
                setTimeout(() => window.router.navigate('/profile'), 600);
            } else {
                window.showToast(updateRes.message || 'Failed to update profile', 'error');
            }
        });

        // Avatar Upload
        const avatarInput = document.getElementById('avatarInput');
        const uploadBtn = document.getElementById('uploadAvatarBtn');
        const profileImageDisplay = document.getElementById('profileImageDisplay');

        uploadBtn.addEventListener('click', () => avatarInput.click());

        avatarInput.addEventListener('change', async (e) => {
            const file = e.target.files[0];
            if (!file) return;

            const reader = new FileReader();
            reader.onload = (ev) => { profileImageDisplay.src = ev.target.result; };
            reader.readAsDataURL(file);

            const formData = new FormData();
            formData.append('avatar', file);

            uploadBtn.innerHTML = '<div class="spinner" style="width: 14px; height: 14px; border-width: 2px;"></div>';
            uploadBtn.disabled = true;

            const res = await window.api.post('/auth/me/avatar', formData);

            uploadBtn.innerHTML = '<i class="fa-solid fa-camera"></i>';
            uploadBtn.disabled = false;

            if (res.success) {
                window.showToast('Profile picture updated!', 'success');
                profileImageDisplay.src = res.data.profile_image;
            } else {
                window.showToast(res.message || 'Failed to update picture', 'error');
            }
        });
    }
};
