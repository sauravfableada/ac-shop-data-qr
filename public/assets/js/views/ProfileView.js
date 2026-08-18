window.ProfileView = {
    render: async (container) => {
        // We provide a premium static UI for the profile page
        
        const content = `
            <div>
                <div class="table-header-row" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px;">
                    <div>
                        <h1 style="font-size: 28px; margin-bottom: 8px;">My Profile</h1>
                        <p style="color: var(--text-muted);">Manage your account settings and preferences.</p>
                    </div>
                </div>

                <div class="responsive-grid" style="display: grid; grid-template-columns: 1fr 2fr; gap: 24px;">
                    <!-- Left Column: Profile Card -->
                    <div class="glass-panel" style="padding: 32px; text-align: center; height: fit-content;">
                        <div style="position: relative; display: inline-block; margin-bottom: 24px;">
                            <img src="https://ui-avatars.com/api/?name=Admin+User&background=10B981&color=fff&size=128" alt="Profile Picture" style="width: 120px; height: 120px; border-radius: 50%; border: 4px solid var(--border-glass); box-shadow: var(--shadow-glass);">
                            <button style="position: absolute; bottom: 0; right: 0; background: var(--primary); color: white; border: none; border-radius: 50%; width: 36px; height: 36px; cursor: pointer; box-shadow: 0 4px 12px rgba(79, 70, 229, 0.4); display: flex; align-items: center; justify-content: center; transition: transform 0.2s;">
                                <i class="fa-solid fa-camera"></i>
                            </button>
                        </div>
                        <h2 style="font-size: 22px; margin-bottom: 8px;">Admin User</h2>
                        <p style="color: var(--text-muted); margin-bottom: 16px;">admin@example.com</p>
                        <span style="background: rgba(16, 185, 129, 0.2); color: var(--secondary); padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: 600;">Administrator</span>
                    </div>

                    <!-- Right Column: Settings Form -->
                    <div class="glass-panel" style="padding: 32px;">
                        <h3 style="font-size: 18px; margin-bottom: 24px; border-bottom: 1px solid var(--border-glass); padding-bottom: 12px;">Personal Information</h3>
                        
                        <form id="profileForm" onsubmit="event.preventDefault(); alert('Profile updated successfully!');">
                            <div class="responsive-grid" style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 20px;">
                                <div>
                                    <label style="display: block; color: var(--text-muted); font-size: 13px; margin-bottom: 8px;">First Name</label>
                                    <input type="text" value="Admin" style="width: 100%; padding: 12px 16px; background: rgba(0,0,0,0.1); border: 1px solid var(--border-glass); border-radius: 8px; color: var(--text-main); outline: none;">
                                </div>
                                <div>
                                    <label style="display: block; color: var(--text-muted); font-size: 13px; margin-bottom: 8px;">Last Name</label>
                                    <input type="text" value="User" style="width: 100%; padding: 12px 16px; background: rgba(0,0,0,0.1); border: 1px solid var(--border-glass); border-radius: 8px; color: var(--text-main); outline: none;">
                                </div>
                            </div>
                            
                            <div style="margin-bottom: 20px;">
                                <label style="display: block; color: var(--text-muted); font-size: 13px; margin-bottom: 8px;">Email Address</label>
                                <input type="email" value="admin@example.com" style="width: 100%; padding: 12px 16px; background: rgba(0,0,0,0.1); border: 1px solid var(--border-glass); border-radius: 8px; color: var(--text-main); outline: none;">
                            </div>

                            <div style="margin-bottom: 32px;">
                                <label style="display: block; color: var(--text-muted); font-size: 13px; margin-bottom: 8px;">Phone Number</label>
                                <input type="text" value="+1 (555) 123-4567" style="width: 100%; padding: 12px 16px; background: rgba(0,0,0,0.1); border: 1px solid var(--border-glass); border-radius: 8px; color: var(--text-main); outline: none;">
                            </div>

                            <h3 style="font-size: 18px; margin-bottom: 24px; border-bottom: 1px solid var(--border-glass); padding-bottom: 12px;">Security</h3>

                            <div style="margin-bottom: 20px;">
                                <label style="display: block; color: var(--text-muted); font-size: 13px; margin-bottom: 8px;">Current Password</label>
                                <input type="password" placeholder="Enter current password" style="width: 100%; padding: 12px 16px; background: rgba(0,0,0,0.1); border: 1px solid var(--border-glass); border-radius: 8px; color: var(--text-main); outline: none;">
                            </div>

                            <div style="margin-bottom: 32px;">
                                <label style="display: block; color: var(--text-muted); font-size: 13px; margin-bottom: 8px;">New Password</label>
                                <input type="password" placeholder="Enter new password" style="width: 100%; padding: 12px 16px; background: rgba(0,0,0,0.1); border: 1px solid var(--border-glass); border-radius: 8px; color: var(--text-main); outline: none;">
                            </div>

                            <div style="display: flex; justify-content: flex-end; gap: 16px;">
                                <button type="button" style="padding: 10px 24px; background: transparent; border: 1px solid var(--border-glass); color: var(--text-main); border-radius: 8px; cursor: pointer; font-weight: 600;">Cancel</button>
                                <button type="submit" style="padding: 10px 24px; background: var(--primary); border: none; color: white; border-radius: 8px; cursor: pointer; font-weight: 600; box-shadow: 0 4px 12px var(--primary-glow);">Save Changes</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        `;
        
        container.innerHTML = window.renderLayout(content);
    }
};
