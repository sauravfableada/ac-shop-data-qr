window.MasterList = {
    render: async (container) => {
        const urlSegments = window.location.pathname.split('/');
        const masterType = urlSegments[urlSegments.length - 1]; // 'ac_type', 'inverter_type', 'service_type'
        
        let title = "Master List";
        if (masterType === 'ac_type') title = "AC Type Master";
        if (masterType === 'inverter_type') title = "Inverter Type Master";
        if (masterType === 'service_type') title = "Service Type Master";

        let records = [];
        let isLoading = true;

        const renderTable = () => {
            const tbody = document.getElementById('masterTableBody');
            if (!tbody) return;

            if (isLoading) {
                tbody.innerHTML = '<tr><td colspan="6" style="text-align: center; padding: 24px;">Loading...</td></tr>';
                return;
            }

            if (records.length === 0) {
                tbody.innerHTML = '<tr><td colspan="6" style="text-align: center; padding: 24px;">No records found.</td></tr>';
                return;
            }

            tbody.innerHTML = records.map((record, index) => {
                const statusBadge = record.status === 'active' 
                    ? '<span style="background: rgba(16,185,129,0.1); color: #10b981; padding: 4px 8px; border-radius: 4px; font-size: 12px; font-weight: 600;">Active</span>' 
                    : '<span style="background: rgba(239,68,68,0.1); color: #ef4444; padding: 4px 8px; border-radius: 4px; font-size: 12px; font-weight: 600;">Inactive</span>';
                
                return `
                    <tr style="border-bottom: 1px solid var(--border-glass);">
                        <td style="padding: 16px;">${index + 1}</td>
                        <td style="padding: 16px; font-weight: 500;">${record.name}</td>
                        <td style="padding: 16px;">${statusBadge}</td>
                        <td style="padding: 16px; font-size: 12px; color: #64748b;">${record.creator?.name || '-'}</td>
                        <td style="padding: 16px; font-size: 12px; color: #64748b;">${record.updater?.name || '-'}</td>
                        <td style="padding: 16px; text-align: right;">
                            <button onclick="window.MasterList.edit(${record.id})" style="background: none; border: none; color: #3b82f6; cursor: pointer; margin-right: 12px;" title="Edit">
                                <i class="fa-solid fa-pen"></i>
                            </button>
                            <button onclick="window.MasterList.delete(${record.id})" style="background: none; border: none; color: #ef4444; cursor: pointer;" title="Delete">
                                <i class="fa-solid fa-trash"></i>
                            </button>
                        </td>
                    </tr>
                `;
            }).join('');
        };

        const content = `
            <div>
                <div class="table-header-row" style="margin-bottom: 24px; display: flex; justify-content: space-between; align-items: center;">
                    <div>
                        <h1 style="font-size: 24px; color: #0f172a; margin-bottom: 4px;">${title}</h1>
                        <button onclick="window.router.navigate('/masters')" style="background: none; border: none; color: #64748b; cursor: pointer; display: flex; align-items: center; gap: 4px; padding: 0;">
                            <i class="fa-solid fa-arrow-left"></i> Back to Dashboard
                        </button>
                    </div>
                    <div>
                        <button onclick="window.MasterList.add()" style="background: var(--primary); color: white; padding: 10px 16px; border: none; border-radius: 8px; font-weight: 600; cursor: pointer; display: flex; align-items: center; gap: 8px; box-shadow: 0 4px 6px -1px rgba(255, 159, 67, 0.3);">
                            <i class="fa-solid fa-plus"></i> Add New
                        </button>
                    </div>
                </div>

                <div class="glass-panel" style="background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
                    <div style="overflow-x: auto;">
                        <table style="width: 100%; border-collapse: collapse;">
                            <thead>
                                <tr style="background: #f8fafc; border-bottom: 1px solid #e2e8f0; text-align: left;">
                                    <th style="padding: 16px; color: #475569; font-weight: 600; font-size: 14px;">#</th>
                                    <th style="padding: 16px; color: #475569; font-weight: 600; font-size: 14px;">Name</th>
                                    <th style="padding: 16px; color: #475569; font-weight: 600; font-size: 14px;">Status</th>
                                    <th style="padding: 16px; color: #475569; font-weight: 600; font-size: 14px;">Created By</th>
                                    <th style="padding: 16px; color: #475569; font-weight: 600; font-size: 14px;">Updated By</th>
                                    <th style="padding: 16px; color: #475569; font-weight: 600; font-size: 14px; text-align: right;">Actions</th>
                                </tr>
                            </thead>
                            <tbody id="masterTableBody">
                                <!-- Records will be injected here -->
                            </tbody>
                        </table>
                    </div>
                </div>

                <!-- Add/Edit Modal -->
                <div id="masterModal" style="display: none; position: fixed; inset: 0; background: rgba(0,0,0,0.5); z-index: 1000; align-items: center; justify-content: center; backdrop-filter: blur(4px);">
                    <div style="background: #ffffff; padding: 24px; border-radius: 12px; width: 90%; max-width: 400px; box-shadow: 0 10px 25px rgba(0,0,0,0.1);">
                        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
                            <h3 id="modalTitle" style="margin: 0; font-size: 18px; color: #0f172a;">Add New</h3>
                            <button onclick="document.getElementById('masterModal').style.display='none'" style="background: none; border: none; font-size: 20px; cursor: pointer; color: #64748b;">&times;</button>
                        </div>
                        <form id="masterForm" onsubmit="window.MasterList.save(event)" novalidate>
                            <input type="hidden" id="masterId" name="id">
                            <input type="hidden" id="masterType" name="type" value="${masterType}">
                            
                            <div style="margin-bottom: 16px;">
                                <label style="display: block; margin-bottom: 8px; font-size: 14px; font-weight: 500;">Name <span style="color:red;">*</span></label>
                                <input type="text" id="masterName" name="name" required style="width: 100%; padding: 10px; border-radius: 8px; border: 1px solid var(--border-glass); background: transparent; color: var(--text-main); outline: none;">
                                <div id="err_name" style="color: #ef4444; font-size: 12px; margin-top: 4px; display: none;"></div>
                            </div>
                            
                            <div style="margin-bottom: 24px;">
                                <label style="display: block; margin-bottom: 8px; font-size: 14px; font-weight: 500;">Status</label>
                                <select id="masterStatus" name="status" style="width: 100%; padding: 10px; border-radius: 8px; border: 1px solid var(--border-glass); background: transparent; color: var(--text-main); outline: none;">
                                    <option value="active">Active</option>
                                    <option value="inactive">Inactive</option>
                                </select>
                            </div>

                            <div style="display: flex; justify-content: flex-end; gap: 12px;">
                                <button type="button" onclick="document.getElementById('masterModal').style.display='none'" style="padding: 10px 16px; border-radius: 8px; border: 1px solid var(--border-glass); background: transparent; cursor: pointer; color: var(--text-main); font-weight: 600;">Cancel</button>
                                <button type="submit" id="saveMasterBtn" style="padding: 10px 16px; border-radius: 8px; border: none; background: var(--primary); color: white; cursor: pointer; font-weight: 600;">Save</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        `;

        container.innerHTML = window.renderLayout(content);
        
        window.MasterList.loadData = async () => {
            isLoading = true;
            renderTable();
            try {
                const res = await window.api.get('/masters?type=' + masterType);
                if (res.success) {
                    records = res.data;
                }
            } catch (e) {
                console.error("Failed to fetch masters", e);
            }
            isLoading = false;
            renderTable();
        };

        window.MasterList.add = () => {
            document.getElementById('masterId').value = '';
            document.getElementById('masterName').value = '';
            document.getElementById('masterStatus').value = 'active';
            document.getElementById('modalTitle').innerText = 'Add New';
            document.getElementById('err_name').style.display = 'none';
            document.getElementById('masterModal').style.display = 'flex';
        };

        window.MasterList.edit = (id) => {
            const record = records.find(r => r.id === id);
            if (!record) return;
            document.getElementById('masterId').value = record.id;
            document.getElementById('masterName').value = record.name;
            document.getElementById('masterStatus').value = record.status;
            document.getElementById('modalTitle').innerText = 'Edit Record';
            document.getElementById('err_name').style.display = 'none';
            document.getElementById('masterModal').style.display = 'flex';
        };

        window.MasterList.save = async (e) => {
            e.preventDefault();
            const btn = document.getElementById('saveMasterBtn');
            btn.disabled = true;
            btn.innerText = 'Saving...';
            document.getElementById('err_name').style.display = 'none';

            const id = document.getElementById('masterId').value;
            const payload = {
                type: document.getElementById('masterType').value,
                name: document.getElementById('masterName').value,
                status: document.getElementById('masterStatus').value
            };

            try {
                let res;
                if (id) {
                    res = await window.api.put('/masters/' + id, payload);
                } else {
                    res = await window.api.post('/masters', payload);
                }

                if (res.success) {
                    window.showToast('Saved successfully', 'success');
                    document.getElementById('masterModal').style.display = 'none';
                    window.MasterList.loadData();
                } else {
                    if (res.errors && res.errors.name) {
                        document.getElementById('err_name').innerText = res.errors.name[0];
                        document.getElementById('err_name').style.display = 'block';
                    } else {
                        window.showToast(res.message || 'Error saving', 'error');
                    }
                }
            } catch (e) {
                window.showToast('An error occurred', 'error');
            }
            btn.disabled = false;
            btn.innerText = 'Save';
        };

        window.MasterList.delete = async (id) => {
            if (confirm("Are you sure you want to delete this record?")) {
                try {
                    const res = await window.api.delete('/masters/' + id);
                    if (res.success) {
                        window.showToast('Deleted successfully', 'success');
                        window.MasterList.loadData();
                    } else {
                        window.showToast(res.message || 'Error deleting', 'error');
                    }
                } catch (e) {
                    window.showToast('Failed to delete', 'error');
                }
            }
        };

        await window.MasterList.loadData();
    }
};
