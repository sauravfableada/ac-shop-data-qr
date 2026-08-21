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
                <!-- Header -->
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px;">
                    <div>
                        <button onclick="window.router.navigate('/staff')" style="background: transparent; border: none; color: var(--text-muted); cursor: pointer; display: flex; align-items: center; gap: 8px; margin-bottom: 8px;">
                            <i class="fa-solid fa-arrow-left"></i> Back to Staff
                        </button>
                        <h1 style="font-size: 24px; font-weight: 700; color: var(--text-main); margin-bottom: 4px; display: flex; align-items: center; gap: 10px;">
                            <i class="fa-solid fa-user-tie" style="color: #EF4444;"></i> Staff Details
                        </h1>
                    </div>
                    <div style="display: flex; gap: 12px;">
                        <button onclick="window.router.navigate('/staff/edit/${staff.id}')" style="padding: 8px 16px; background: #f59e0b; color: white; border: none; border-radius: 8px; font-weight: 600; cursor: pointer;">
                            <i class="fa-solid fa-pencil"></i> Edit Staff
                        </button>
                    </div>
                </div>

                <div class="glass-panel" style="padding: 24px; background: #ffffff;">
                    <div style="display: flex; gap: 24px; align-items: flex-start; flex-wrap: wrap;">
                        <!-- Avatar / Basic Info -->
                        <div style="text-align: center; min-width: 200px; padding: 24px; border: 1px solid var(--border-glass); border-radius: 12px; background: #f8fafc;">
                            <img src="${staff.profile_image || `https://ui-avatars.com/api/?name=${encodeURIComponent(staff.name)}&background=EF4444&color=fff`}" alt="${staff.name}" style="width: 100px; height: 100px; border-radius: 50%; object-fit: cover; margin-bottom: 16px; border: 3px solid white; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
                            <h2 style="font-size: 18px; color: #0f172a; margin-bottom: 4px;">${staff.name}</h2>
                            <span style="background-color: rgba(16, 185, 129, 0.1); color: #10b981; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: 600; display: inline-block; margin-bottom: 16px;">Active</span>
                            
                            <div style="text-align: left; border-top: 1px solid var(--border-glass); padding-top: 16px; margin-top: 16px;">
                                <div style="margin-bottom: 12px;">
                                    <div style="font-size: 11px; font-weight: 700; color: var(--text-muted); text-transform: uppercase; margin-bottom: 4px;">Role</div>
                                    <div style="font-size: 14px; font-weight: 600; color: #0f172a;">${roleNames}</div>
                                </div>
                            </div>
                        </div>

                        <!-- Contact & Info -->
                        <div style="flex: 1; min-width: 300px;">
                            <h3 style="font-size: 16px; color: #0f172a; margin-bottom: 16px; border-bottom: 1px solid var(--border-glass); padding-bottom: 8px;">Contact Information</h3>
                            
                            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 20px; margin-bottom: 32px;">
                                <div>
                                    <div style="font-size: 11px; font-weight: 700; color: var(--text-muted); text-transform: uppercase; margin-bottom: 4px;">Email Address</div>
                                    <div style="font-size: 15px; color: var(--text-main); display: flex; align-items: center; gap: 8px;">
                                        <i class="fa-solid fa-envelope" style="color: #64748b;"></i> ${staff.email}
                                    </div>
                                </div>
                                <div>
                                    <div style="font-size: 11px; font-weight: 700; color: var(--text-muted); text-transform: uppercase; margin-bottom: 4px;">Phone Number</div>
                                    <div style="font-size: 15px; color: var(--text-main); display: flex; align-items: center; gap: 8px;">
                                        <i class="fa-solid fa-phone" style="color: #64748b;"></i> ${staff.phone || 'Not provided'}
                                    </div>
                                </div>
                                <div>
                                    <div style="font-size: 11px; font-weight: 700; color: var(--text-muted); text-transform: uppercase; margin-bottom: 4px;">Joined On</div>
                                    <div style="font-size: 15px; color: var(--text-main); display: flex; align-items: center; gap: 8px;">
                                        <i class="fa-solid fa-calendar-days" style="color: #64748b;"></i> ${new Date(staff.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        container.innerHTML = window.renderLayout(content);
    }
};
