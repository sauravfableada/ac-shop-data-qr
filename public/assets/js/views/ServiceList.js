window.ServiceList = {
    render: async (container) => {

        let state = {
            search: '',
            page: 1,
            perPage: 10,
            services: [],
            meta: null
        };

        const fetchServices = async () => {
            const query = new URLSearchParams({
                search: state.search,
                page: state.page,
                per_page: state.perPage
            }).toString();

            const response = await window.api.get('/services?' + query);

            if (response.success) {
                state.services = response.data.data;
                state.meta = response.data.meta;
            } else {
                state.services = [];
                state.meta = null;
            }
        };

        const renderTable = () => {
            if (!state.services.length) {
                return `<tr><td colspan="6" style="padding: 16px; text-align: center; color: var(--text-muted);">No services found</td></tr>`;
            }

            return state.services.map(s => `
                <tr style="border-bottom: 1px solid var(--border-glass);">
                    <td style="padding: 16px; font-size: 14px; font-weight: 600; color: var(--text-main);">${s.service_number}</td>
                    <td style="padding: 16px; font-size: 14px; color: var(--text-muted);">${s.customer ? s.customer.full_name : 'N/A'}</td>
                    <td class="hide-on-mobile" style="padding: 16px; font-size: 14px; color: var(--text-muted);">${s.ac_unit ? s.ac_unit.ac_code : 'N/A'}</td>
                    <td class="hide-on-mobile" style="padding: 16px; font-size: 14px; color: var(--text-muted);">${new Date(s.service_date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</td>
                    <td class="hide-on-mobile" style="padding: 16px;">
                        <span style="padding: 4px 8px; border-radius: 4px; font-size: 12px; font-weight: 600; background: ${s.status === 'completed' ? 'rgba(16,185,129,0.1)' : 'rgba(244,63,94,0.1)'}; color: ${s.status === 'completed' ? '#10B981' : '#F43F5E'};">${s.status ? s.status.toUpperCase() : 'PENDING'}</span>
                    </td>
                    <td style="padding: 16px;">
                        <button class="mobile-expand-btn" onclick="window.ServiceList.toggleMobileRow(${s.id}, this)"><i class="fa-solid fa-plus"></i></button>
                        <div class="desktop-only" style="display: flex; gap: 8px; justify-content: flex-end;">
                            <button onclick="window.router.navigate('/services/view/${s.id}')" title="View" style="background: #3b82f6; border: none; color: white; border-radius: 4px; padding: 6px 10px; cursor: pointer; transition: 0.2s;"><i class="fa-solid fa-eye"></i> View</button>
                            <button onclick="window.router.navigate('/services/edit/${s.id}')" title="Edit" style="background: #f59e0b; border: none; color: white; border-radius: 4px; padding: 6px 10px; cursor: pointer; transition: 0.2s;"><i class="fa-solid fa-pen-to-square"></i> Edit</button>
                        </div>
                    </td>
                </tr>
                <tr id="mobile-expand-${s.id}" class="mobile-expanded-row">
                    <td colspan="2" style="padding: 16px; background: #f8fafc; border-bottom: 1px solid var(--border-glass);">
                        <div style="background: #ffffff; border-radius: 12px; border-left: 4px solid #0f172a; padding: 16px; box-shadow: 0 4px 6px rgba(0,0,0,0.02);">
                            <div style="display: flex; justify-content: space-between; margin-bottom: 12px; font-size: 12px; font-weight: 700; color: #0f172a;">
                                <div><i class="fa-solid fa-user" style="margin-right: 8px;"></i> CUSTOMER :</div>
                                <div style="font-weight: 400; color: #64748b;">${s.customer ? s.customer.full_name : 'N/A'}</div>
                            </div>
                            <div style="display: flex; justify-content: space-between; margin-bottom: 12px; font-size: 12px; font-weight: 700; color: #0f172a;">
                                <div><i class="fa-solid fa-fan" style="margin-right: 8px;"></i> AC CODE :</div>
                                <div style="font-weight: 400; color: #64748b;">${s.ac_unit ? s.ac_unit.ac_code : 'N/A'}</div>
                            </div>
                            <div style="display: flex; justify-content: space-between; margin-bottom: 12px; font-size: 12px; font-weight: 700; color: #0f172a;">
                                <div><i class="fa-solid fa-calendar-days" style="margin-right: 8px;"></i> DATE :</div>
                                <div style="font-weight: 400; color: #64748b;">${new Date(s.service_date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</div>
                            </div>
                            <div style="display: flex; justify-content: space-between; margin-bottom: 16px; font-size: 12px; font-weight: 700; color: #0f172a;">
                                <div><i class="fa-solid fa-circle-check" style="margin-right: 8px;"></i> STATUS :</div>
                                <div style="font-weight: 400; color: #64748b;">${s.status ? s.status.toUpperCase() : 'PENDING'}</div>
                            </div>
                            
                            <hr style="border: 0; border-top: 1px solid #e2e8f0; margin-bottom: 16px;">
                            
                            <div style="display: flex; justify-content: space-between; align-items: center; font-size: 12px; font-weight: 700; color: #0f172a;">
                                <div><i class="fa-solid fa-gear" style="margin-right: 8px;"></i> ACTIONS :</div>
                                <div style="display: flex; gap: 8px;">
                                    <button onclick="window.router.navigate('/services/view/${s.id}')" style="background: #3b82f6; border: none; color: white; border-radius: 6px; padding: 6px 10px; cursor: pointer;"><i class="fa-solid fa-eye"></i></button>
                                    <button onclick="window.router.navigate('/services/edit/${s.id}')" style="background: #f59e0b; border: none; color: white; border-radius: 6px; padding: 6px 10px; cursor: pointer;"><i class="fa-solid fa-pencil"></i></button>
                                </div>
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
                            <h1 style="font-size: 24px; margin-bottom: 4px; color: #0f172a;">Maintenance Services</h1>
                            
                        </div>
                        <div style="display: flex; gap: 12px;">
                            <button onclick="window.router.navigate('/services/add')" style="display: flex; align-items: center; gap: 8px; padding: 8px 16px; background: #0f172a; color: white; border: none; border-radius: 8px; cursor: pointer; font-weight: 600; font-size: 14px;">
                                <i class="fa-solid fa-plus"></i> Create Service
                            </button>
                        </div>
                    </div>

                    <div>
                        <div class="table-filter-row" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
                            <div style="display: flex; gap: 12px; align-items: center;">
                                <div style="position: relative;">
                                    <i class="fa-solid fa-search" style="position: absolute; left: 12px; top: 50%; transform: translateY(-50%); color: var(--text-muted); font-size: 14px;"></i>
                                    <input type="text" id="searchInput" value="${state.search}" placeholder="Search service #, customer..." style="padding: 8px 12px 8px 36px; border-radius: 8px; border: 1px solid var(--border-glass); background: transparent; color: var(--text-main); outline: none; font-size: 14px; width: 250px;">
                                </div>
                                <button class="hide-on-mobile" style="display: flex; align-items: center; gap: 8px; padding: 8px 16px; background: transparent; color: var(--text-muted); border: 1px solid var(--border-glass); border-radius: 8px; cursor: pointer; font-size: 14px; font-weight: 500;">
                                    <i class="fa-solid fa-filter"></i> Filters
                                </button>
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
                                        <th style="padding: 12px 16px;">Service #</th>
                                        <th style="padding: 12px 16px;">Customer</th>
                                        <th class="hide-on-mobile" style="padding: 12px 16px;">AC Code</th>
                                        <th class="hide-on-mobile" style="padding: 12px 16px;">Date</th>
                                        <th class="hide-on-mobile" style="padding: 12px 16px;">Status</th>
                                        <th style="padding: 12px 16px; text-align: right;">Actions</th>
                                    </tr>
                                </thead>
                                <tbody id="serviceTableBody">
                                    ${renderTable()}
                                </tbody>
                            </table>
                        </div>
                        
                        <div id="servicePagination">
                            ${renderPagination()}
                        </div>
                    </div>
                </div>
            `;
            container.innerHTML = window.renderLayout(content);
        };

        const attachEventListeners = () => {
            const searchInput = document.getElementById('searchInput');
            let searchTimeout;
            if (searchInput) {
                searchInput.addEventListener('input', (e) => {
                    clearTimeout(searchTimeout);
                    searchTimeout = setTimeout(async () => {
                        state.search = e.target.value;
                        state.page = 1;
                        await fetchServices();
                        updateDOM();
                    }, 500);
                });
            }

            const perPageSelect = document.getElementById('perPageSelect');
            if (perPageSelect) {
                perPageSelect.addEventListener('change', async (e) => {
                    state.perPage = parseInt(e.target.value);
                    state.page = 1;
                    await fetchServices();
                    updateDOM();
                });
            }

            // Delegation for pagination clicks
            const paginationContainer = document.getElementById('servicePagination');
            if (paginationContainer) {
                paginationContainer.addEventListener('click', async (e) => {
                    if (e.target.classList.contains('page-btn') && !e.target.disabled) {
                        state.page = parseInt(e.target.getAttribute('data-page'));
                        await fetchServices();
                        updateDOM();
                    }
                });
            }
        };

        const updateDOM = () => {
            document.getElementById('serviceTableBody').innerHTML = renderTable();
            document.getElementById('servicePagination').innerHTML = renderPagination();
        };

        // Initial Load
        await fetchServices();
        renderView();
        attachEventListeners();
    },

    toggleMobileRow: (id, btnElement) => {
        const row = document.getElementById(`mobile-expand-${id}`);
        const icon = btnElement.querySelector('i');
        if (row.classList.contains('show')) {
            row.classList.remove('show');
            icon.className = 'fa-solid fa-plus';
        } else {
            row.classList.add('show');
            icon.className = 'fa-solid fa-minus';
        }
    }
};
