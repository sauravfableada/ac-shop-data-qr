window.CustomerList = {
    render: async (container) => {

        let state = {
            search: '',
            page: 1,
            perPage: 10,
            customers: [],
            meta: null
        };

        const fetchCustomers = async () => {
            const query = new URLSearchParams({
                search: state.search,
                page: state.page,
                per_page: state.perPage
            }).toString();

            const response = await window.api.get('/customers?' + query);

            if (response.success) {
                state.customers = response.data.data;
                state.meta = response.data.meta;
            } else {
                state.customers = [];
                state.meta = null;
            }
        };

        const renderTable = () => {
            if (!state.customers.length) {
                return `<tr><td colspan="5" style="padding: 16px; text-align: center; color: var(--text-muted);">No customers found</td></tr>`;
            }

            // Calculate starting index
            const startIndex = (state.meta.current_page - 1) * state.meta.per_page;

            return state.customers.map((c, index) => `
                <tr style="border-bottom: 1px solid var(--border-glass);">
                    <td style="padding: 16px; font-size: 14px; font-weight: 600;">${c.full_name}<br><span style="font-size: 12px; color: var(--text-muted); font-weight: 400;">${c.customer_code}</span></td>
                    <td style="padding: 16px; font-size: 14px; font-weight: 500; color: var(--text-main);">${c.mobile}</td>
                    <td class="hide-on-mobile" style="padding: 16px; font-size: 14px; color: var(--text-muted); max-width: 200px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;" title="${c.address || '--'}">${c.address || '--'}</td>
                    <td class="hide-on-mobile" style="padding: 16px; font-size: 14px; font-weight: 600;">${new Date(c.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</td>
                    <td style="padding: 16px;">
                        <button class="mobile-expand-btn" data-id="${c.id}"><i class="fa-solid fa-plus"></i></button>
                        <div class="desktop-only" style="display: flex; gap: 8px;">
                            <button onclick="window.router.navigate('/services/add?customer_id=${c.id}')" style="background: #0ea5e9; border: none; color: white; border-radius: 4px; padding: 6px 10px; cursor: pointer; transition: 0.2s;" title="Add Service"><i class="fa-solid fa-plus"></i> Service</button>
                            <button onclick="window.router.navigate('/ac-units/add?customer_id=${c.id}')" style="background: #10b981; border: none; color: white; border-radius: 4px; padding: 6px 10px; cursor: pointer; transition: 0.2s;" title="Add AC Unit"><i class="fa-solid fa-plus"></i> Add AC</button>
                            <button class="view-customer-btn" data-id="${c.id}" style="background: #3b82f6; border: none; color: white; border-radius: 4px; padding: 6px 10px; cursor: pointer; transition: 0.2s;" title="View"><i class="fa-regular fa-eye"></i> View</button>
                            <button class="edit-customer-btn" data-id="${c.id}" style="background: #f59e0b; border: none; color: white; border-radius: 4px; padding: 6px 10px; cursor: pointer; transition: 0.2s;" title="Edit"><i class="fa-solid fa-pencil"></i> Edit</button>
                            <button class="delete-customer-btn" data-id="${c.id}" style="background: #ef4444; border: none; color: white; border-radius: 4px; padding: 6px 10px; cursor: pointer; transition: 0.2s;" title="Delete"><i class="fa-regular fa-trash-can"></i> Delete</button>
                        </div>
                    </td>
                </tr>
                <tr id="mobile-expand-${c.id}" class="mobile-expanded-row">
                    <td colspan="5" style="padding: 16px; background: #f8fafc; border-bottom: 1px solid var(--border-glass);">
                        <div style="background: #ffffff; border-radius: 12px; border-left: 4px solid #0f172a; padding: 16px; box-shadow: 0 4px 6px rgba(0,0,0,0.02);">
                            <div style="display: flex; justify-content: space-between; margin-bottom: 12px; font-size: 12px; font-weight: 700; color: #0f172a;">
                                <div><i class="fa-solid fa-map-marker-alt" style="margin-right: 8px;"></i> ADDRESS :</div>
                                <div style="font-weight: 400; color: #64748b; text-align: right; max-width: 60%;">${c.address || '--'}</div>
                            </div>
                            <div style="display: flex; justify-content: space-between; margin-bottom: 16px; font-size: 12px; font-weight: 700; color: #0f172a;">
                                <div><i class="fa-solid fa-calendar-days" style="margin-right: 8px;"></i> CREATED :</div>
                                <div style="font-weight: 400; color: #64748b;">${new Date(c.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</div>
                            </div>
                            
                            <hr style="border: 0; border-top: 1px solid #e2e8f0; margin-bottom: 16px;">
                            
                            <div style="display: flex; flex-wrap: wrap; gap: 8px; justify-content: flex-start; align-items: center;">
                                <button onclick="window.router.navigate('/services/add?customer_id=${c.id}')" style="background: #0ea5e9; border: none; color: white; border-radius: 6px; padding: 6px 12px; cursor: pointer; font-size: 12px; font-weight: 600;"><i class="fa-solid fa-plus" style="margin-right: 4px;"></i> Service</button>
                                <button onclick="window.router.navigate('/ac-units/add?customer_id=${c.id}')" style="background: #10b981; border: none; color: white; border-radius: 6px; padding: 6px 12px; cursor: pointer; font-size: 12px; font-weight: 600;"><i class="fa-solid fa-plus" style="margin-right: 4px;"></i> Add AC</button>
                                <button class="view-customer-btn" data-id="${c.id}" style="background: #3b82f6; border: none; color: white; border-radius: 6px; padding: 6px 12px; cursor: pointer; font-size: 12px; font-weight: 600;"><i class="fa-regular fa-eye" style="margin-right: 4px;"></i> View</button>
                                <button class="edit-customer-btn" data-id="${c.id}" style="background: #f59e0b; border: none; color: white; border-radius: 6px; padding: 6px 12px; cursor: pointer; font-size: 12px; font-weight: 600;"><i class="fa-solid fa-pencil" style="margin-right: 4px;"></i> Edit</button>
                                <button class="delete-customer-btn" data-id="${c.id}" style="background: #ef4444; border: none; color: white; border-radius: 6px; padding: 6px 12px; cursor: pointer; font-size: 12px; font-weight: 600;"><i class="fa-regular fa-trash-can" style="margin-right: 4px;"></i> Delete</button>
                            </div>
                        </div>
                    </td>
                </tr>
            `).join('');
        };

        const renderPagination = () => {
            if (!state.meta || state.meta.total === 0) return '';

            const start = (state.meta.current_page - 1) * state.meta.per_page + 1;
            const end = Math.min(state.meta.current_page * state.meta.per_page, state.meta.total);

            let pagesHTML = '';
            for (let i = 1; i <= state.meta.last_page; i++) {
                // Show first, last, current, and +/- 1 pages
                if (i === 1 || i === state.meta.last_page || (i >= state.meta.current_page - 1 && i <= state.meta.current_page + 1)) {
                    const isActive = i === state.meta.current_page;
                    pagesHTML += `<button class="page-btn" data-page="${i}" style="padding: 6px 12px; border-radius: 6px; border: 1px solid var(--border-glass); background: ${isActive ? '#0f172a' : 'transparent'}; color: ${isActive ? 'white' : 'var(--text-main)'}; cursor: pointer;">${i}</button>`;
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
                            <h1 style="font-size: 24px; margin-bottom: 4px; color: #0f172a;">Manage Customers</h1>
                            
                        </div>
                        <div style="display: flex; gap: 12px;">
                            <button onclick="window.router.navigate('/customers/add')" style="display: flex; align-items: center; gap: 8px; padding: 8px 16px; background: #0f172a; color: white; border: none; border-radius: 8px; cursor: pointer; font-weight: 600; font-size: 14px; white-space: nowrap;">
                                <i class="fa-solid fa-plus"></i> Customer
                            </button>
                        </div>
                    </div>

                    <div>
                        <div class="table-filter-row" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
                            <div style="display: flex; gap: 12px; align-items: center;">
                                <div style="position: relative;">
                                    <i class="fa-solid fa-search" style="position: absolute; left: 12px; top: 50%; transform: translateY(-50%); color: var(--text-muted); font-size: 14px;"></i>
                                    <input type="text" id="searchInput" value="${state.search}" placeholder="Search by name, phone no..." style="padding: 8px 12px 8px 36px; border-radius: 8px; border: 1px solid var(--border-glass); background: transparent; color: var(--text-main); outline: none; font-size: 14px; width: 250px;">
                                </div>

                            </div>
                            
                            <div style="display: flex; align-items: center; gap: 8px; color: var(--text-muted); font-size: 14px;">
                                Show per page: 
                                <select id="perPageSelect" style="padding: 4px 8px; border-radius: 6px; border: 1px solid var(--border-glass); background: transparent; color: var(--text-main); outline: none;">
                                    <option value="10" ${state.perPage == 10 ? 'selected' : ''}>10</option>
                                    <option value="25" ${state.perPage == 25 ? 'selected' : ''}>25</option>
                                    <option value="50" ${state.perPage == 50 ? 'selected' : ''}>50</option>
                                </select> 
                            </div>
                        </div>

                        <div style="overflow-x: auto;">
                            <table style="width: 100%; border-collapse: collapse; text-align: left;">
                                <thead>
                                    <tr style="border-bottom: 2px solid var(--border-glass); color: var(--text-muted); font-size: 12px; text-transform: uppercase; font-weight: 700;">
                                        <th style="padding: 12px 16px;">Customer Name</th>
                                        <th style="padding: 12px 16px;">Mobile</th>
                                        <th class="hide-on-mobile" style="padding: 12px 16px;">Address</th>
                                        <th class="hide-on-mobile" style="padding: 12px 16px;">Created At</th>
                                        <th style="padding: 12px 16px;">Actions</th>
                                    </tr>
                                </thead>
                                <tbody id="customerTableBody">
                                    ${renderTable()}
                                </tbody>
                            </table>
                        </div>
                        
                        <div id="customerPagination">
                            ${renderPagination()}
                        </div>
                    </div>
                </div>
            `;

            container.innerHTML = window.renderLayout(content);
            attachEvents();
        };

        const updateTable = () => {
            document.getElementById('customerTableBody').innerHTML = renderTable();
            document.getElementById('customerPagination').innerHTML = renderPagination();
            attachTableEvents(); // Re-attach edit/view/delete/page events
        };

        const attachTableEvents = () => {
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

            document.querySelectorAll('.edit-customer-btn').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    window.router.navigate('/customers/edit/' + e.currentTarget.dataset.id);
                });
            });

            document.querySelectorAll('.view-customer-btn').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    window.router.navigate('/customers/view/' + e.currentTarget.dataset.id);
                });
            });

            document.querySelectorAll('.delete-customer-btn').forEach(btn => {
                btn.addEventListener('click', async (e) => {
                    const id = e.currentTarget.dataset.id;
                    const result = await Swal.fire({
                        title: 'Are you sure?',
                        text: "You want to delete this customer?",
                        icon: 'warning',
                        showCancelButton: true,
                        confirmButtonColor: '#ef4444',
                        cancelButtonColor: '#64748b',
                        confirmButtonText: 'Yes, delete it!'
                    });

                    if (result.isConfirmed) {
                        const response = await window.api.delete('/customers/' + id);
                        if (response.success) {
                            Swal.fire('Deleted!', 'Customer has been deleted.', 'success');
                            await fetchCustomers();
                            updateTable();
                        } else {
                            Swal.fire('Error', response.message || 'Error deleting customer', 'error');
                        }
                    }
                });
            });

            document.querySelectorAll('.page-btn').forEach(btn => {
                btn.addEventListener('click', async (e) => {
                    const newPage = parseInt(e.currentTarget.dataset.page);
                    if (newPage && newPage !== state.page) {
                        state.page = newPage;
                        await fetchCustomers();
                        updateTable();
                    }
                });
            });
        };

        const attachEvents = () => {
            attachTableEvents();

            // Search Event (Debounced)
            let searchTimeout;
            const searchInput = document.getElementById('searchInput');
            if (searchInput) {
                searchInput.addEventListener('input', (e) => {
                    clearTimeout(searchTimeout);
                    searchTimeout = setTimeout(async () => {
                        state.search = e.target.value;
                        state.page = 1; // Reset to page 1 on search
                        await fetchCustomers();
                        updateTable();
                    }, 500);
                });
            }

            // Per Page Event
            const perPageSelect = document.getElementById('perPageSelect');
            if (perPageSelect) {
                perPageSelect.addEventListener('change', async (e) => {
                    state.perPage = parseInt(e.target.value);
                    state.page = 1; // Reset to page 1
                    await fetchCustomers();
                    updateTable();
                });
            }
        };

        // Initial Load
        await fetchCustomers();
        renderView();
    }
};
