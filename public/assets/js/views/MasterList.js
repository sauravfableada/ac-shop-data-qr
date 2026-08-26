window.MasterList = {
    render: async (container) => {
        const urlSegments = window.location.pathname.split('/');
        const masterType = urlSegments[urlSegments.length - 1]; // 'ac_type', 'inverter_type', 'service_type'
        
        let title = "Master List";
        if (masterType === 'ac_type') title = "AC Type Master";
        if (masterType === 'inverter_type') title = "Inverter Type Master";
        if (masterType === 'service_type') title = "Service Type Master";

        const state = {
            search: '',
            page: 1,
            perPage: 10,
            meta: { total: 0, current_page: 1, last_page: 1 },
            records: [] // paginated list
        };
        let allRecords = [];
        let isLoading = true;

        const renderTable = () => {
            if (isLoading) {
                return '<tr><td colspan="6" style="text-align: center; padding: 24px;">Loading...</td></tr>';
            }

            if (state.records.length === 0) {
                return '<tr><td colspan="6" style="text-align: center; padding: 24px;">No records found.</td></tr>';
            }

            return state.records.map((record, index) => {
                const globalIndex = (state.page - 1) * state.perPage + index + 1;
                const statusBadge = record.status === 'active' 
                    ? '<span style="background: rgba(16,185,129,0.1); color: #10b981; padding: 4px 8px; border-radius: 4px; font-size: 12px; font-weight: 600;">Active</span>' 
                    : '<span style="background: rgba(239,68,68,0.1); color: #ef4444; padding: 4px 8px; border-radius: 4px; font-size: 12px; font-weight: 600;">Inactive</span>';
                
                return `
                    <tr style="border-bottom: 1px solid var(--border-glass);">
                        <td style="padding: 16px;">${globalIndex}</td>
                        <td style="padding: 16px; font-weight: 500;">${record.name}</td>
                        <td style="padding: 16px;">${statusBadge}</td>
                        <td class="hide-on-mobile" style="padding: 16px; font-size: 12px; color: #64748b;">${record.creator?.name || '-'}</td>
                        <td class="hide-on-mobile" style="padding: 16px; font-size: 12px; color: #64748b;">${record.updater?.name || '-'}</td>
                        <td style="padding: 16px; text-align: right;">
                            <button class="mobile-expand-btn hide-on-desktop" data-id="${record.id}"><i class="fa-solid fa-plus"></i></button>
                            <div class="desktop-only" style="display: flex; gap: 8px; justify-content: flex-end;">
                            <button onclick="window.MasterList.edit(${record.id})" style="background: #f59e0b; border: none; color: white; border-radius: 4px; padding: 6px 10px; cursor: pointer; transition: 0.2s; font-size: 13px; font-weight: 500;" title="Edit">
                                <i class="fa-solid fa-pen" style="margin-right: 4px;"></i> Edit
                            </button>
                            <button onclick="window.MasterList.delete(${record.id})" style="background: #ef4444; border: none; color: white; border-radius: 4px; padding: 6px 10px; cursor: pointer; transition: 0.2s; font-size: 13px; font-weight: 500;" title="Delete">
                                <i class="fa-solid fa-trash" style="margin-right: 4px;"></i> Delete
                            </button>
                            </div>
                        </td>
                    </tr>
                    <tr id="mobile-expand-${record.id}" class="mobile-expanded-row">
                        <td colspan="6" style="padding: 16px; background: #f8fafc; border-bottom: 1px solid var(--border-glass);">
                            <div style="background: #ffffff; border-radius: 12px; border-left: 4px solid #0f172a; padding: 16px; box-shadow: 0 4px 6px rgba(0,0,0,0.02);">
                                <div style="display: flex; justify-content: space-between; margin-bottom: 12px; font-size: 12px; font-weight: 700; color: #0f172a;">
                                    <div><i class="fa-solid fa-user" style="margin-right: 8px;"></i> CREATED BY :</div>
                                    <div style="font-weight: 400; text-align: right; max-width: 60%; color: #64748b;">${record.creator?.name || '-'}</div>
                                </div>
                                <div style="display: flex; justify-content: space-between; margin-bottom: 12px; font-size: 12px; font-weight: 700; color: #0f172a;">
                                    <div><i class="fa-solid fa-clock-rotate-left" style="margin-right: 8px;"></i> UPDATED BY :</div>
                                    <div style="font-weight: 400; text-align: right; max-width: 60%; color: #64748b;">${record.updater?.name || '-'}</div>
                                </div>
                                
                                <hr style="border: 0; border-top: 1px solid #e2e8f0; margin-bottom: 16px;">
                                
                                <div style="display: flex; flex-wrap: wrap; gap: 8px; justify-content: flex-start; align-items: center;">
                                    <button onclick="window.MasterList.edit(${record.id})" style="background: #3b82f6; border: none; color: white; border-radius: 6px; padding: 6px 12px; cursor: pointer; font-size: 12px; font-weight: 600;"><i class="fa-solid fa-pen" style="margin-right: 4px;"></i> Edit</button>
                                    <button onclick="window.MasterList.delete(${record.id})" style="background: #ef4444; border: none; color: white; border-radius: 6px; padding: 6px 12px; cursor: pointer; font-size: 12px; font-weight: 600;"><i class="fa-solid fa-trash" style="margin-right: 4px;"></i> Delete</button>
                                </div>
                            </div>
                        </td>
                    </tr>
                `;
            }).join('');
        };

        const renderPagination = () => {
            const { current_page, last_page, total } = state.meta;
            if (total === 0) return '';
            
            let pages = [];
            for (let i = 1; i <= last_page; i++) {
                pages.push(`
                    <button class="page-btn ${i === current_page ? 'active' : ''}" data-page="${i}" style="padding: 6px 12px; border: 1px solid var(--border-glass); background: ${i === current_page ? '#ff9f43' : 'transparent'}; color: ${i === current_page ? 'white' : 'var(--text-main)'}; border-radius: 6px; cursor: pointer; font-size: 13px; font-weight: 500;">
                        ${i}
                    </button>
                `);
            }
            
            return `
                <div style="display: flex; justify-content: space-between; align-items: center; padding: 16px; border-top: 1px solid var(--border-glass); flex-wrap: wrap; gap: 16px;">
                    <div style="font-size: 13px; color: var(--text-muted);">
                        Showing ${Math.min((current_page - 1) * state.perPage + 1, total)} to ${Math.min(current_page * state.perPage, total)} of ${total} entries
                    </div>
                    <div style="display: flex; gap: 8px;">
                        <button class="page-btn" data-page="${current_page - 1}" ${current_page === 1 ? 'disabled' : ''} style="padding: 6px 12px; border: 1px solid var(--border-glass); background: transparent; color: var(--text-main); border-radius: 6px; cursor: ${current_page === 1 ? 'not-allowed' : 'pointer'}; opacity: ${current_page === 1 ? '0.5' : '1'}; font-size: 13px;">Previous</button>
                        ${pages.join('')}
                        <button class="page-btn" data-page="${current_page + 1}" ${current_page === last_page ? 'disabled' : ''} style="padding: 6px 12px; border: 1px solid var(--border-glass); background: transparent; color: var(--text-main); border-radius: 6px; cursor: ${current_page === last_page ? 'not-allowed' : 'pointer'}; opacity: ${current_page === last_page ? '0.5' : '1'}; font-size: 13px;">Next</button>
                    </div>
                </div>
            `;
        };

        const renderView = () => {
            const content = `
                <div>
                    <div class="table-header-row" style="margin-bottom: 24px; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 16px;">
                        <div>
                            <h1 style="font-size: 24px; color: #0f172a; margin-bottom: 4px;">${title}</h1>
                            <button onclick="window.router.navigate('/masters')" style="background: none; border: none; color: #64748b; cursor: pointer; display: flex; align-items: center; gap: 4px; padding: 0;">
                                <i class="fa-solid fa-arrow-left"></i> Back to Dashboard
                            </button>
                        </div>
                        <div>
                            <button onclick="window.MasterList.add()" style="background: #ff9f43; color: white; padding: 10px 16px; border: none; border-radius: 8px; font-weight: 600; cursor: pointer; display: flex; align-items: center; gap: 8px; box-shadow: 0 4px 6px -1px rgba(255, 159, 67, 0.3);">
                                <i class="fa-solid fa-plus"></i> Add New
                            </button>
                        </div>
                    </div>

                    <div class="glass-panel" style="background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
                        
                        <div class="table-filter-row" style="display: flex; justify-content: space-between; align-items: center; padding: 16px; border-bottom: 1px solid var(--border-glass); gap: 12px;">
                            <div style="display: flex; gap: 12px; flex: 1;">
                                <!-- Search Input -->
                                <div style="position: relative; flex: 1 1 140px; min-width: 140px; max-width: 350px;">
                                    <i class="fa-solid fa-magnifying-glass" style="position: absolute; left: 12px; top: 50%; transform: translateY(-50%); color: #94a3b8; font-size: 14px; pointer-events: none; z-index: 1;"></i>
                                    <input type="text" id="searchInput" value="${state.search}" placeholder="Search name..." style="width: 100%; padding: 9px 12px 9px 38px !important; border-radius: 8px; border: 1px solid var(--border-glass); background: transparent; color: var(--text-main); outline: none; font-size: 14px;">
                                </div>
                            </div>
                                
                            <!-- Per Page -->
                            <div style="flex: none; display: flex; align-items: center; gap: 0px; color: var(--text-muted); font-size: 13px; white-space: nowrap;">
                                Show:
                                <select id="perPageSelect" style="width: auto !important; height: auto !important; padding: 7px 10px; border-radius: 8px; border: 1px solid var(--border-glass); background: transparent; color: var(--text-main); outline: none; font-size: 14px; cursor: pointer; margin: 0 6px;">
                                    <option value="10" ${state.perPage == 10 ? 'selected' : ''}>10</option>
                                    <option value="25" ${state.perPage == 25 ? 'selected' : ''}>25</option>
                                    <option value="50" ${state.perPage == 50 ? 'selected' : ''}>50</option>
                                </select>
                                per page
                            </div>
                        </div>

                        <div style="overflow-x: auto;">
                            <table style="width: 100%; border-collapse: collapse;">
                                <thead>
                                    <tr style="background: #f8fafc; border-bottom: 1px solid #e2e8f0; text-align: left;">
                                <th class="hide-on-mobile" style="padding: 16px; color: #475569; font-weight: 600; font-size: 14px;">#</th>
                                        <th style="padding: 16px; color: #475569; font-weight: 600; font-size: 14px;">Name</th>
                                        <th style="padding: 16px; color: #475569; font-weight: 600; font-size: 14px;">Status</th>
                                        <th class="hide-on-mobile" style="padding: 16px; color: #475569; font-weight: 600; font-size: 14px;">Created By</th>
                                        <th class="hide-on-mobile" style="padding: 16px; color: #475569; font-weight: 600; font-size: 14px;">Updated By</th>
                                        <th style="padding: 16px; color: #475569; font-weight: 600; font-size: 14px; text-align: right;">Actions</th>
                                    </tr>
                                </thead>
                                <tbody id="masterTableBody">
                                    ${renderTable()}
                                </tbody>
                            </table>
                        </div>
                        <div id="masterPagination">
                            ${renderPagination()}
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
            attachListeners();
        };

        const updateDOM = () => {
            document.getElementById('masterTableBody').innerHTML = renderTable();
            document.getElementById('masterPagination').innerHTML = renderPagination();
            attachTableEvents();
        };

        const attachTableEvents = () => {
            // Expand button logic
            document.querySelectorAll('.mobile-expand-btn').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const id = e.currentTarget.dataset.id;
                    const row = document.getElementById(`mobile-expand-${id}`);
                    const icon = e.currentTarget.querySelector('i');
                    if (row.classList.contains('show')) {
                        row.classList.remove('show');
                        icon.className = 'fa-solid fa-plus';
                    } else {
                        row.classList.add('show');
                        icon.className = 'fa-solid fa-minus';
                    }
                });
            });

            // Pagination logic
            document.querySelectorAll('.page-btn').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const newPage = parseInt(e.currentTarget.dataset.page);
                    if (newPage && newPage !== state.page && newPage <= state.meta.last_page && newPage > 0) {
                        state.page = newPage;
                        applyClientPagination();
                    }
                });
            });
        };

        const attachListeners = () => {
            attachTableEvents();

            // Search logic (debounced)
            let searchTimeout;
            const searchInput = document.getElementById('searchInput');
            if (searchInput) {
                searchInput.addEventListener('input', (e) => {
                    clearTimeout(searchTimeout);
                    searchTimeout = setTimeout(() => {
                        state.search = e.target.value;
                        state.page = 1;
                        applyClientPagination();
                    }, 300);
                });
            }

            // Per page logic
            const perPageSelect = document.getElementById('perPageSelect');
            if (perPageSelect) {
                perPageSelect.addEventListener('change', (e) => {
                    state.perPage = parseInt(e.target.value);
                    state.page = 1;
                    applyClientPagination();
                });
            }
        };

        const applyClientPagination = () => {
            let data = allRecords;
            if (state.search) {
                const s = state.search.toLowerCase();
                data = data.filter(r => r.name.toLowerCase().includes(s));
            }
            
            state.meta.total = data.length;
            state.meta.current_page = state.page;
            state.meta.per_page = state.perPage;
            state.meta.last_page = Math.ceil(data.length / state.perPage) || 1;

            const start = (state.page - 1) * state.perPage;
            state.records = data.slice(start, start + state.perPage);
            
            updateDOM();
        };

        window.MasterList.loadData = async () => {
            isLoading = true;
            renderView();
            try {
                const res = await window.api.get('/masters?type=' + masterType);
                isLoading = false;
                if (res.success) {
                    allRecords = res.data;
                    applyClientPagination();
                } else {
                    updateDOM();
                }
            } catch (e) {
                console.error("Failed to fetch masters", e);
                isLoading = false;
                updateDOM();
            }
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
            const record = allRecords.find(r => r.id === id);
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
                    window.MasterList.loadData(); // Reload all data
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

        window.MasterList.delete = (id) => {
            Swal.fire({
                title: 'Are you sure?',
                text: "You won't be able to revert this!",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#ef4444',
                cancelButtonColor: '#64748b',
                confirmButtonText: 'Yes, delete it!'
            }).then(async (result) => {
                if (result.isConfirmed) {
                    try {
                        const res = await window.api.delete('/masters/' + id);
                        if (res.success) {
                            Swal.fire(
                                'Deleted!',
                                'Record has been deleted.',
                                'success'
                            );
                            window.MasterList.loadData();
                        } else {
                            Swal.fire('Error!', res.message || 'Error deleting', 'error');
                        }
                    } catch (e) {
                        Swal.fire('Error!', 'Failed to delete', 'error');
                    }
                }
            });
        };

        await window.MasterList.loadData();
    }
};
