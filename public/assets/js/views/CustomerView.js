window.CustomerView = {
    render: async (container, params = {}) => {
        if (!params.id) {
            container.innerHTML = window.renderLayout(`<div class="glass-panel" style="padding: 24px;">Invalid customer ID</div>`);
            return;
        }

        const response = await window.api.get('/customers/' + params.id);
        if (!response.success) {
            container.innerHTML = window.renderLayout(`<div class="glass-panel" style="padding: 24px;">Customer not found</div>`);
            return;
        }

        const c = response.data;

        const content = `
            <div>
                <div class="table-header-row" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px;">
                    <div>
                        <h1 style="font-size: 24px; margin-bottom: 4px; color: #0f172a;">Customer Profile</h1>
                        <p style="color: #64748b; font-size: 14px;">Detailed view of customer information.</p>
                    </div>
                    <div style="display: flex; gap: 12px;">
                        <button onclick="window.router.navigate('/customers')" style="display: flex; align-items: center; gap: 8px; padding: 8px 16px; background: transparent; color: #0f172a; border: 1px solid #e2e8f0; border-radius: 8px; cursor: pointer; font-weight: 600; font-size: 14px;">
                            <i class="fa-solid fa-arrow-left"></i> <span class="hide-on-mobile">Back</span>
                        </button>
                        <button onclick="window.router.navigate('/customers/edit/${c.id}')" style="display: flex; align-items: center; gap: 8px; padding: 8px 16px; background: var(--primary); color: white; border: none; border-radius: 8px; cursor: pointer; font-weight: 600; font-size: 14px; box-shadow: 0 4px 12px var(--primary-glow);">
                            <i class="fa-solid fa-pencil"></i> Edit Profile
                        </button>
                    </div>
                </div>

                <div class="glass-panel" style="background: #ffffff; padding: 32px; border-radius: 12px;">
                    
                    <div style="display: flex; align-items: center; gap: 24px; margin-bottom: 40px; padding-bottom: 32px; border-bottom: 1px solid var(--border-glass);">
                        ${c.image ?
                `<img src="${c.image}" alt="${c.full_name}" style="width: 100px; height: 100px; border-radius: 50%; object-fit: cover; border: 2px solid var(--border-glass);">` :
                `<div style="width: 100px; height: 100px; border-radius: 50%; background: linear-gradient(135deg, var(--primary), #8b5cf6); display: flex; align-items: center; justify-content: center; font-size: 32px; font-weight: 700; color: white;">
                                ${c.full_name.charAt(0).toUpperCase()}
                            </div>`
            }
                        <div>
                            <h2 style="font-size: 28px; margin-bottom: 8px;">${c.full_name}</h2>
                            <span style="background-color: rgba(16, 185, 129, 0.1); color: #10b981; padding: 6px 12px; border-radius: 20px; font-size: 12px; font-weight: 600;">Code: ${c.customer_code}</span>
                        </div>
                    </div>

                    <div class="responsive-grid" style="display: grid; grid-template-columns: 1fr 1fr; gap: 32px;">
                        
                        <div>
                            <h3 style="font-size: 16px; margin-bottom: 16px; color: var(--text-muted); border-bottom: 1px solid var(--border-glass); padding-bottom: 8px;">Contact Information</h3>
                            
                            <div style="margin-bottom: 16px;">
                                <label style="display: block; font-size: 12px; color: var(--text-muted); margin-bottom: 4px;">Mobile Phone</label>
                                <div style="font-size: 15px; font-weight: 500;">${c.mobile}</div>
                            </div>
                            
                            <div style="margin-bottom: 16px;">
                                <label style="display: block; font-size: 12px; color: var(--text-muted); margin-bottom: 4px;">WhatsApp Number</label>
                                <div style="font-size: 15px; font-weight: 500;">${c.whatsapp_no || '<span style="color:var(--text-muted);">N/A</span>'}</div>
                            </div>
                            
                            <div style="margin-bottom: 16px;">
                                <label style="display: block; font-size: 12px; color: var(--text-muted); margin-bottom: 4px;">Email Address</label>
                                <div style="font-size: 15px; font-weight: 500;">${c.email || '<span style="color:var(--text-muted);">N/A</span>'}</div>
                            </div>
                            
                            <div style="margin-bottom: 16px;">
                                <label style="display: block; font-size: 12px; color: var(--text-muted); margin-bottom: 4px;">Date of Birth</label>
                                <div style="font-size: 15px; font-weight: 500;">${c.dob ? new Date(c.dob).toLocaleDateString() : '<span style="color:var(--text-muted);">N/A</span>'}</div>
                            </div>
                        </div>

                        <div>
                            <h3 style="font-size: 16px; margin-bottom: 16px; color: var(--text-muted); border-bottom: 1px solid var(--border-glass); padding-bottom: 8px;">Address Information</h3>
                            
                            <div style="margin-bottom: 16px;">
                                <label style="display: block; font-size: 12px; color: var(--text-muted); margin-bottom: 4px;">Full Address</label>
                                <div style="font-size: 15px; font-weight: 500; line-height: 1.5;">${c.address || '<span style="color:var(--text-muted);">N/A</span>'}</div>
                            </div>
                            
                            <div style="margin-bottom: 16px;">
                                <label style="display: block; font-size: 12px; color: var(--text-muted); margin-bottom: 4px;">City</label>
                                <div style="font-size: 15px; font-weight: 500;">${c.city || '<span style="color:var(--text-muted);">N/A</span>'}</div>
                            </div>
                            
                            <div style="margin-bottom: 16px;">
                                <label style="display: block; font-size: 12px; color: var(--text-muted); margin-bottom: 4px;">Country</label>
                                <div style="font-size: 15px; font-weight: 500;">${c.country || '<span style="color:var(--text-muted);">N/A</span>'}</div>
                            </div>

                            <div style="margin-bottom: 16px;">
                                <label style="display: block; font-size: 12px; color: var(--text-muted); margin-bottom: 4px;">Registered On</label>
                                <div style="font-size: 15px; font-weight: 500;">${new Date(c.created_at).toLocaleString()}</div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        `;

        container.innerHTML = window.renderLayout(content);
    }
};
