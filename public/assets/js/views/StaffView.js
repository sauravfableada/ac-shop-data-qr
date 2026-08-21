window.StaffView = {
    render: async (container) => {
        // Extract ID from URL
        const pathParts = window.location.pathname.split('/');
        const id = pathParts[pathParts.length - 1];

        // Fetch staff data
        const fetchStaff = async () => {
            const response = await window.api.get(`/admin/staff/${id}`);
            return response.success ? response.data : null;
        };

        const staff = await fetchStaff();

        if (!staff) {
            container.innerHTML = window.renderLayout(`
                <div class="glass-panel" style="padding: 32px; text-align: center;">
                    <h2 style="color: var(--accent);">Staff Not Found</h2>
                    <button onclick="window.router.navigate('/staff')" class="btn btn-primary" style="margin-top: 16px;">Back to Staff</button>
                </div>
            `);
            return;
        }

        const roleNames = staff.roles && staff.roles.length ? staff.roles.map(r => r.name).join(', ') : 'No Role Assigned';

        const content = `
            <div>
                <div class="table-header-row" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px;">
                    <div>
                        <h1 style="font-size: 24px; margin-bottom: 4px; color: #0f172a;">Staff Profile</h1>
                    </div>
                    <div style="display: flex; gap: 12px;">
                        <button onclick="window.router.navigate('/staff')" style="display: flex; align-items: center; gap: 8px; padding: 8px 16px; background: #ffffff; color: #0f172a; border: 1px solid #e2e8f0; border-radius: 8px; cursor: pointer; font-weight: 600; font-size: 14px;">
                            <i class="fa-solid fa-arrow-left"></i> <span class="hide-on-mobile">Back</span>
                        </button>
                        <button onclick="window.router.navigate('/staff/edit/${staff.id}')" style="display: flex; align-items: center; gap: 8px; padding: 8px 16px; background: #f59e0b; color: white; border: none; border-radius: 8px; cursor: pointer; font-weight: 600; font-size: 14px; white-space: nowrap;">
                            <i class="fa-solid fa-pencil"></i> Edit Profile
                        </button>
                    </div>
                </div>

                <div class="glass-panel" style="background: #ffffff; padding: 32px; border-radius: 12px;">
                    
                    <div style="display: flex; align-items: center; gap: 24px; margin-bottom: 40px; padding-bottom: 32px; border-bottom: 1px solid var(--border-glass);">
                        ${staff.profile_image ?
                `<img src="${staff.profile_image}" alt="${staff.name}" style="width: 100px; height: 100px; border-radius: 50%; object-fit: cover; border: 2px solid var(--border-glass);">` :
                `<div style="width: 100px; height: 100px; border-radius: 50%; background: linear-gradient(135deg, var(--primary), #8b5cf6); display: flex; align-items: center; justify-content: center; font-size: 32px; font-weight: 700; color: white;">
                                ${staff.name.charAt(0).toUpperCase()}
                            </div>`
            }
                        <div>
                            <h2 style="font-size: 28px; margin-bottom: 8px;">${staff.name}</h2>
                            <span style="background-color: rgba(16, 185, 129, 0.1); color: #10b981; padding: 6px 12px; border-radius: 20px; font-size: 12px; font-weight: 600;">Status: Active</span>
                        </div>
                    </div>

                    <div class="responsive-grid" style="display: grid; grid-template-columns: 1fr 1fr; gap: 32px;">
                        
                        <div>
                            <h3 style="font-size: 16px; margin-bottom: 16px; color: var(--text-muted); border-bottom: 1px solid var(--border-glass); padding-bottom: 8px;">Contact Information</h3>
                            
                            <div style="margin-bottom: 16px;">
                                <label style="display: block; font-size: 12px; color: var(--text-muted); margin-bottom: 4px;">Email Address</label>
                                <div style="font-size: 15px; font-weight: 500;">${staff.email}</div>
                            </div>
                            
                            <div style="margin-bottom: 16px;">
                                <label style="display: block; font-size: 12px; color: var(--text-muted); margin-bottom: 4px;">Phone Number</label>
                                <div style="font-size: 15px; font-weight: 500;">${staff.phone || '<span style="color:var(--text-muted);">Not provided</span>'}</div>
                            </div>
                        </div>

                        <div>
                            <h3 style="font-size: 16px; margin-bottom: 16px; color: var(--text-muted); border-bottom: 1px solid var(--border-glass); padding-bottom: 8px;">Account Details</h3>
                            
                            <div style="margin-bottom: 16px;">
                                <label style="display: block; font-size: 12px; color: var(--text-muted); margin-bottom: 4px;">Role</label>
                                <div style="font-size: 15px; font-weight: 500;">${roleNames}</div>
                            </div>

                            <div style="margin-bottom: 16px;">
                                <label style="display: block; font-size: 12px; color: var(--text-muted); margin-bottom: 4px;">Joined On</label>
                                <div style="font-size: 15px; font-weight: 500;">${new Date(staff.created_at).toLocaleString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute:'2-digit' })}</div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        `;

        container.innerHTML = window.renderLayout(content);
    }
};
