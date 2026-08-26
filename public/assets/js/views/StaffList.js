window.StaffList = {
    render: async (container) => {
        let state = {
            search: '',
            page: 1,
            perPage: 10,
            staff: [],
            meta: null
        };

        const fetchStaff = async () => {
            // Fetch staff from the endpoint we created
            const response = await window.api.get('/admin/staff');

            if (response.success) {
                let data = response.data;
                // Basic client-side filtering if search is used
                if (state.search) {
                    const s = state.search.toLowerCase();
                    data = data.filter(u => u.name.toLowerCase().includes(s) || (u.phone && u.phone.includes(s)) || (u.email && u.email.toLowerCase().includes(s)));
                }

                state.meta = {
                    total: data.length,
                    current_page: state.page,
                    per_page: state.perPage,
                    last_page: Math.ceil(data.length / state.perPage) || 1
                };

                // Pagination slice
                const start = (state.page - 1) * state.perPage;
                state.staff = data.slice(start, start + state.perPage);
            } else {
                state.staff = [];
                state.meta = null;
            }
        };

        const renderTable = () => {
            if (!state.staff || state.staff.length === 0) {
                return `<tr><td colspan="5" style="padding: 16px; text-align: center; color: var(--text-muted);">No staff found</td></tr>`;
            }

            return state.staff.map(c => {
                const roleNames = c.roles && c.roles.length ? c.roles.map(r => r.name).join(', ') : '--';
                return `
                <tr style="border-bottom: 1px solid var(--border-glass);">
                    <td style="padding: 16px; font-size: 14px; font-weight: 600;">${c.name}<br><span style="font-size: 12px; color: var(--text-muted); font-weight: 400;">${c.email}</span></td>
                    <td style="padding: 16px; font-size: 14px; font-weight: 500; color: var(--text-main);">${c.phone || '--'}</td>
                    <td class="hide-on-mobile" style="padding: 16px; font-size: 14px; color: var(--text-muted); max-width: 200px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${roleNames}</td>
                    <td class="hide-on-mobile" style="padding: 16px; font-size: 14px; font-weight: 600;"><span style="background-color: rgba(16, 185, 129, 0.1); color: #10b981; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: 600;">Active</span></td>
                    <td style="padding: 16px;">
                        <button class="mobile-expand-btn" data-id="${c.id}"><i class="fa-solid fa-plus"></i></button>
                        <div class="desktop-only" style="display: flex; gap: 8px;">
                            <button onclick="window.router.navigate('/staff/view/${c.id}')" class="view-staff-btn" data-id="${c.id}" style="background: #3b82f6; border: none; color: white; border-radius: 4px; padding: 6px 10px; cursor: pointer; transition: 0.2s;" title="View"><i class="fa-regular fa-eye"></i> View</button>
                            <button class="edit-staff-btn" data-id="${c.id}" style="background: #f59e0b; border: none; color: white; border-radius: 4px; padding: 6px 10px; cursor: pointer; transition: 0.2s;" title="Edit"><i class="fa-solid fa-pencil"></i> Edit</button>
                            <button class="delete-staff-btn" data-id="${c.id}" data-name="${c.name}" style="background: #ef4444; border: none; color: white; border-radius: 4px; padding: 6px 10px; cursor: pointer; transition: 0.2s;" title="Delete"><i class="fa-regular fa-trash-can"></i> Delete</button>
                        </div>
                    </td>
                </tr>
                <tr id="mobile-expand-${c.id}" class="mobile-expanded-row">
                    <td colspan="5" style="padding: 16px; background: #f8fafc; border-bottom: 1px solid var(--border-glass);">
                        <div style="background: #ffffff; border-radius: 12px; border-left: 4px solid #0f172a; padding: 16px; box-shadow: 0 4px 6px rgba(0,0,0,0.02);">
                            <div style="display: flex; justify-content: space-between; margin-bottom: 12px; font-size: 12px; font-weight: 700; color: #0f172a;">
                                <div><i class="fa-solid fa-user-tie" style="margin-right: 8px;"></i> ROLE :</div>
                                <div style="font-weight: 400; color: #64748b;">${roleNames}</div>
                            </div>
                            <div style="display: flex; justify-content: space-between; margin-bottom: 16px; font-size: 12px; font-weight: 700; color: #0f172a;">
                                <div><i class="fa-solid fa-circle-check" style="margin-right: 8px;"></i> STATUS :</div>
                                <div style="font-weight: 400; color: #64748b;"><span style="color: #10b981; font-weight: 600;">Active</span></div>
                            </div>
                            
                            <hr style="border: 0; border-top: 1px solid #e2e8f0; margin-bottom: 16px;">
                            
                            <div style="display: flex; flex-wrap: wrap; gap: 8px; justify-content: flex-start; align-items: center;">
                                <button onclick="window.router.navigate('/staff/view/${c.id}')" style="background: #3b82f6; border: none; color: white; border-radius: 6px; padding: 6px 12px; cursor: pointer; font-size: 12px; font-weight: 600;"><i class="fa-regular fa-eye" style="margin-right: 4px;"></i> View</button>
                                <button class="edit-staff-btn" data-id="${c.id}" style="background: #f59e0b; border: none; color: white; border-radius: 6px; padding: 6px 12px; cursor: pointer; font-size: 12px; font-weight: 600;"><i class="fa-solid fa-pencil" style="margin-right: 4px;"></i> Edit</button>
                                <button class="delete-staff-btn" data-id="${c.id}" data-name="${c.name}" style="background: #ef4444; border: none; color: white; border-radius: 6px; padding: 6px 12px; cursor: pointer; font-size: 12px; font-weight: 600;"><i class="fa-regular fa-trash-can" style="margin-right: 4px;"></i> Delete</button>
                            </div>
                        </div>
                    </td>
                </tr>
            `}).join('');
        };

        const renderPagination = () => {
            if (!state.meta || state.meta.total === 0) return '';

            const start = (state.meta.current_page - 1) * state.meta.per_page + 1;
            const end = Math.min(state.meta.current_page * state.meta.per_page, state.meta.total);

            let pagesHTML = '';
            for (let i = 1; i <= state.meta.last_page; i++) {
                if (i === 1 || i === state.meta.last_page || (i >= state.meta.current_page - 1 && i <= state.meta.current_page + 1)) {
                    const isActive = i === state.meta.current_page;
                    pagesHTML += `<button class="page-btn" data-page="${i}" style="padding: 6px 12px; border-radius: 6px; border: 1px solid var(--border-glass); background: ${isActive ? '#ff9f43' : 'transparent'}; color: ${isActive ? 'white' : 'var(--text-main)'}; cursor: pointer;">${i}</button>`;
                } else if (i === state.meta.current_page - 2 || i === state.meta.current_page + 2) {
                    pagesHTML += `<span style="padding: 6px 12px; color: var(--text-muted);">...</span>`;
                }
            }

            return `
                <div style="display: flex; flex-wrap: wrap; gap: 16px; justify-content: space-between; align-items: center; margin-top: 20px; font-size: 14px; color: var(--text-muted);">
                    <div>Showing ${start} to ${end} of ${state.meta.total} results</div>
                    <div style="display: flex; flex-wrap: wrap; gap: 8px;">
                        <button class="page-btn" data-page="${state.meta.current_page - 1}" ${state.meta.current_page === 1 ? 'disabled' : ''} style="padding: 6px 12px; border-radius: 6px; border: 1px solid var(--border-glass); background: transparent; color: ${state.meta.current_page === 1 ? 'var(--border-glass)' : 'var(--text-main)'}; cursor: ${state.meta.current_page === 1 ? 'not-allowed' : 'pointer'};">Previous</button>
                        ${pagesHTML}
                        <button class="page-btn" data-page="${state.meta.current_page + 1}" ${state.meta.current_page === state.meta.last_page ? 'disabled' : ''} style="padding: 6px 12px; border-radius: 6px; border: 1px solid var(--border-glass); background: transparent; color: ${state.meta.current_page === state.meta.last_page ? 'var(--border-glass)' : 'var(--text-main)'}; cursor: ${state.meta.current_page === state.meta.last_page ? 'not-allowed' : 'pointer'};">Next</button>
                    </div>
                </div>
            `;
        };

        const renderView = () => {
            const content = `
                <div class="glass-panel" style="padding: 24px; background: #ffffff;">
                    <div class="table-header-row" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px;">
                        <div>
                            <h1 style="font-size: 24px; margin-bottom: 4px; color: #0f172a;">Manage Staff</h1>
                        </div>
                        <div style="display: flex; gap: 12px;">
                            <button onclick="window.router.navigate('/staff/add')" style="display: flex; align-items: center; gap: 8px; padding: 8px 16px; background: #ff9f43; color: white; border: none; border-radius: 8px; cursor: pointer; font-weight: 600; font-size: 14px; white-space: nowrap;">
                                <i class="fa-solid fa-plus"></i> Add Staff
                            </button>
                        </div>
                    </div>

                    <div>
                        <div class="table-filter-row" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; gap: 12px; flex-wrap: wrap;">
                            <div style="display: flex; gap: 12px; flex-wrap: wrap; flex: 1;">
                                <!-- Search Input -->
                                <div style="position: relative; flex: 1 1 140px; min-width: 140px;">
                                    <i class="fa-solid fa-magnifying-glass" style="position: absolute; left: 12px; top: 50%; transform: translateY(-50%); color: #94a3b8; font-size: 14px; pointer-events: none; z-index: 1;"></i>
                                    <input type="text" id="searchInput" value="${state.search}" placeholder="Search by name, phone no..." style="width: 100%; padding: 9px 12px 9px 38px !important; border-radius: 8px; border: 1px solid var(--border-glass); background: transparent; color: var(--text-main); outline: none; font-size: 14px;">
                                </div>
                                
                                <!-- Per Page -->
                                <div style="flex: 1 1 140px; min-width: 140px; display: flex; align-items: center; gap: 0px; color: var(--text-muted); font-size: 11px; white-space: nowrap;">
                                    Show:
                                    <select id="perPageSelect" style="padding: 7px 10px; border-radius: 8px; border: 1px solid var(--border-glass); background: transparent; color: var(--text-main); outline: none; font-size: 14px; cursor: pointer;">
                                        <option value="10" ${state.perPage == 10 ? 'selected' : ''}>10</option>
                                        <option value="25" ${state.perPage == 25 ? 'selected' : ''}>25</option>
                                        <option value="50" ${state.perPage == 50 ? 'selected' : ''}>50</option>
                                    </select>
                                    per page
                                </div>
                            </div>
                        </div>

                        <div style="overflow-x: auto;">
                            <table style="width: 100%; border-collapse: collapse; text-align: left;">
                                <thead>
                                    <tr style="border-bottom: 2px solid var(--border-glass); color: var(--text-muted); font-size: 12px; text-transform: uppercase; font-weight: 700;">
                                        <th style="padding: 16px;">Name & Email</th>
                                        <th style="padding: 16px;">Phone</th>
                                        <th style="padding: 16px;" class="hide-on-mobile">Role</th>
                                        <th style="padding: 16px;" class="hide-on-mobile">Status</th>
                                        <th style="padding: 16px;">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    ${renderTable()}
                                </tbody>
                            </table>
                        </div>

                        ${renderPagination()}
                    </div>
                </div>
            `;

            container.innerHTML = window.renderLayout(content);
            attachListeners();
        };

        const attachListeners = () => {
            // Mobile Expand
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

            // Search
            const searchInput = document.getElementById('searchInput');
            if (searchInput) {
                let debounceTimer;
                searchInput.addEventListener('input', (e) => {
                    clearTimeout(debounceTimer);
                    debounceTimer = setTimeout(async () => {
                        state.search = e.target.value;
                        state.page = 1;
                        await fetchStaff();
                        renderView();
                    }, 500);
                });
            }

            // Per Page
            const perPageSelect = document.getElementById('perPageSelect');
            if (perPageSelect) {
                perPageSelect.addEventListener('change', async (e) => {
                    state.perPage = parseInt(e.target.value);
                    state.page = 1;
                    await fetchStaff();
                    renderView();
                });
            }

            // Pagination
            document.querySelectorAll('.page-btn').forEach(btn => {
                btn.addEventListener('click', async (e) => {
                    if (btn.disabled) return;
                    const newPage = parseInt(btn.dataset.page);
                    if (newPage !== state.page) {
                        state.page = newPage;
                        await fetchStaff();
                        renderView();
                    }
                });
            });

            // Edit Staff
            document.querySelectorAll('.edit-staff-btn').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const id = e.currentTarget.dataset.id;
                    window.router.navigate(`/staff/edit/${id}`);
                });
            });

            // Delete Staff
            document.querySelectorAll('.delete-staff-btn').forEach(btn => {
                btn.addEventListener('click', async (e) => {
                    const id = e.currentTarget.dataset.id;

                    const result = await Swal.fire({
                        title: 'Are you sure?',
                        text: "You won't be able to revert this!",
                        icon: 'warning',
                        showCancelButton: true,
                        confirmButtonColor: '#ef4444',
                        cancelButtonColor: '#64748b',
                        confirmButtonText: 'Yes, delete it!'
                    });

                    if (result.isConfirmed) {
                        try {
                            const token = localStorage.getItem('auth_token');
                            const response = await fetch(`/api/admin/staff/${id}`, {
                                method: 'DELETE',
                                headers: {
                                    'Authorization': `Bearer ${token}`,
                                    'Accept': 'application/json'
                                }
                            });

                            const jsonResult = await response.json();
                            if (jsonResult.success) {
                                const staffName = e.currentTarget.dataset.name || 'Staff member';
                                if (window.addNotification) {
                                    window.addNotification(
                                        'Staff Deleted',
                                        `Staff member "${staffName}" was successfully deleted.`,
                                        'staff'
                                    );
                                }
                                Swal.fire(
                                    'Deleted!',
                                    'Staff member has been deleted.',
                                    'success'
                                );
                                await fetchStaff();
                                renderView();
                            } else {
                                Swal.fire(
                                    'Error!',
                                    jsonResult.message || 'Failed to delete staff member.',
                                    'error'
                                );
                            }
                        } catch (err) {
                            Swal.fire('Error!', 'An error occurred while deleting.', 'error');
                        }
                    }
                });
            });
        };

        await fetchStaff();
        renderView();
    }
};
