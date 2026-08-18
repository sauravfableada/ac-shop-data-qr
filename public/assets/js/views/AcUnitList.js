window.AcUnitList = {
    render: async (container) => {

        let state = {
            search: '',
            page: 1,
            perPage: 10,
            acUnits: [],
            meta: null
        };

        const fetchAcUnits = async () => {
            const query = new URLSearchParams({
                search: state.search,
                page: state.page,
                per_page: state.perPage
            }).toString();

            const response = await window.api.get('/ac-units?' + query);

            if (response.success) {
                state.acUnits = response.data.data;
                state.meta = response.data.meta;
            } else {
                state.acUnits = [];
                state.meta = null;
            }
        };

        const renderTable = () => {
            if (!state.acUnits.length) {
                return `<tr><td colspan="6" style="padding: 16px; text-align: center; color: var(--text-muted);">No AC Units found</td></tr>`;
            }

            return state.acUnits.map(ac => `
                <tr style="border-bottom: 1px solid var(--border-glass);">
                    <td style="padding: 16px; font-size: 14px; font-weight: 600; color: var(--text-main);">${ac.ac_code}</td>
                    <td class="hide-on-mobile" style="padding: 16px; font-size: 14px; color: var(--text-muted);">${ac.brand || '-'} ${ac.model || ''}</td>
                    <td class="hide-on-mobile" style="padding: 16px; font-size: 14px; color: var(--text-muted);">${ac.customer ? ac.customer.full_name : 'N/A'}</td>
                    <td class="hide-on-mobile" style="padding: 16px; font-size: 14px; color: var(--text-muted);">${ac.ac_type || '-'} · ${ac.capacity || '-'}</td>
                    <td class="hide-on-mobile" style="padding: 16px;">
                        <span style="padding: 4px 8px; border-radius: 4px; font-size: 12px; font-weight: 600; background: ${ac.status === 'active' ? 'rgba(16,185,129,0.1)' : 'rgba(244,63,94,0.1)'}; color: ${ac.status === 'active' ? '#10B981' : '#F43F5E'};">${ac.status ? ac.status.toUpperCase() : 'ACTIVE'}</span>
                    </td>
                    <td style="padding: 16px;">
                        <button class="mobile-expand-btn" onclick="window.AcUnitList.toggleMobileRow(${ac.id}, this)"><i class="fa-solid fa-plus"></i></button>
                        <div class="desktop-only" style="display: flex; gap: 8px; justify-content: flex-end;">
                            <button onclick="window.AcUnitList.printAcUnit(${ac.id})" title="Print QR" style="background: transparent; border: 1px solid #bfdbfe; color: #3b82f6; border-radius: 4px; padding: 6px 10px; cursor: pointer; transition: 0.2s;"><i class="fa-solid fa-print"></i></button>
                            <button onclick="window.router.navigate('/ac-units/view/${ac.id}')" title="View" style="background: transparent; border: 1px solid #bfdbfe; color: #3b82f6; border-radius: 4px; padding: 6px 10px; cursor: pointer; transition: 0.2s;"><i class="fa-solid fa-eye"></i></button>
                            <button onclick="window.router.navigate('/ac-units/edit/${ac.id}')" title="Edit" style="background: transparent; border: 1px solid #bfdbfe; color: #3b82f6; border-radius: 4px; padding: 6px 10px; cursor: pointer; transition: 0.2s;"><i class="fa-solid fa-pen-to-square"></i></button>
                            <button onclick="window.AcUnitList.deleteUnit(${ac.id})" title="Delete" style="background: transparent; border: 1px solid #fecaca; color: #ef4444; border-radius: 4px; padding: 6px 10px; cursor: pointer; transition: 0.2s;"><i class="fa-solid fa-trash"></i></button>
                        </div>
                    </td>
                </tr>
                <tr id="mobile-expand-${ac.id}" class="mobile-expanded-row">
                    <td colspan="2" style="padding: 16px; background: #f8fafc; border-bottom: 1px solid var(--border-glass);">
                        <div style="background: #ffffff; border-radius: 12px; border-left: 4px solid #0f172a; padding: 16px; box-shadow: 0 4px 6px rgba(0,0,0,0.02);">
                            <div style="display: flex; justify-content: space-between; margin-bottom: 12px; font-size: 12px; font-weight: 700; color: #0f172a;">
                                <div><i class="fa-solid fa-fan" style="margin-right: 8px;"></i> MODEL :</div>
                                <div style="font-weight: 400; color: #64748b;">${ac.brand || '-'} ${ac.model || ''}</div>
                            </div>
                            <div style="display: flex; justify-content: space-between; margin-bottom: 12px; font-size: 12px; font-weight: 700; color: #0f172a;">
                                <div><i class="fa-solid fa-user" style="margin-right: 8px;"></i> CUSTOMER :</div>
                                <div style="font-weight: 400; color: #64748b;">${ac.customer ? ac.customer.full_name : 'N/A'}</div>
                            </div>
                            <div style="display: flex; justify-content: space-between; margin-bottom: 12px; font-size: 12px; font-weight: 700; color: #0f172a;">
                                <div><i class="fa-solid fa-qrcode" style="margin-right: 8px;"></i> QR :</div>
                                <div style="font-weight: 400; color: #64748b;">${ac.qr_code && ac.qr_code.token ? 'Yes' : 'No'}</div>
                            </div>
                            <div style="display: flex; justify-content: space-between; margin-bottom: 16px; font-size: 12px; font-weight: 700; color: #0f172a;">
                                <div><i class="fa-solid fa-circle-check" style="margin-right: 8px;"></i> STATUS :</div>
                                <div style="font-weight: 400; color: #64748b;">${ac.status ? ac.status.toUpperCase() : 'ACTIVE'}</div>
                            </div>
                            
                            <hr style="border: 0; border-top: 1px solid #e2e8f0; margin-bottom: 16px;">
                            
                            <div style="display: flex; justify-content: space-between; align-items: center; font-size: 12px; font-weight: 700; color: #0f172a;">
                                <div><i class="fa-solid fa-gear" style="margin-right: 8px;"></i> ACTIONS :</div>
                                <div style="display: flex; gap: 8px;">
                                    <button onclick="window.router.navigate('/ac-units/view/${ac.id}')" style="background: #ffffff; border: 1px solid #e2e8f0; color: #3b82f6; border-radius: 6px; padding: 6px 10px; cursor: pointer;"><i class="fa-regular fa-eye"></i></button>
                                    <button onclick="window.router.navigate('/ac-units/edit/${ac.id}')" style="background: #ffffff; border: 1px solid #e2e8f0; color: #f59e0b; border-radius: 6px; padding: 6px 10px; cursor: pointer;"><i class="fa-solid fa-pencil"></i></button>
                                    <button onclick="window.AcUnitList.deleteUnit(${ac.id})" style="background: #ffffff; border: 1px solid #e2e8f0; color: #ef4444; border-radius: 6px; padding: 6px 10px; cursor: pointer;"><i class="fa-regular fa-trash-can"></i></button>
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
                <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 20px; font-size: 14px; color: var(--text-muted);">
                    <div>Showing ${start} to ${end} of ${state.meta.total} results</div>
                    <div style="display: flex; gap: 8px;">
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
                            <h1 style="font-size: 24px; margin-bottom: 4px; color: #0f172a;">AC Units</h1>
                            <p style="color: #64748b; font-size: 14px;">Manage all customer air conditioning units.</p>
                        </div>
                        <div style="display: flex; gap: 12px;">
                            <button onclick="window.router.navigate('/scanner')" style="display: flex; align-items: center; gap: 8px; padding: 8px 16px; background: transparent; color: #0f172a; border: 1px solid #e2e8f0; border-radius: 8px; cursor: pointer; font-weight: 600; font-size: 14px;">
                                <i class="fa-solid fa-qrcode"></i> Scan QR
                            </button>
                            <button onclick="window.router.navigate('/ac-units/add')" style="display: flex; align-items: center; gap: 8px; padding: 8px 16px; background: #0f172a; color: white; border: none; border-radius: 8px; cursor: pointer; font-weight: 600; font-size: 14px;">
                                <i class="fa-solid fa-plus"></i> Add AC Unit
                            </button>
                        </div>
                    </div>

                    <div>
                        <div class="table-filter-row" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
                            <div style="display: flex; gap: 12px; align-items: center;">
                                <div style="position: relative;">
                                    <i class="fa-solid fa-search" style="position: absolute; left: 12px; top: 50%; transform: translateY(-50%); color: var(--text-muted); font-size: 14px;"></i>
                                    <input type="text" id="searchInput" value="${state.search}" placeholder="Search AC code, brand..." style="padding: 8px 12px 8px 36px; border-radius: 8px; border: 1px solid var(--border-glass); background: transparent; color: var(--text-main); outline: none; font-size: 14px; width: 250px;">
                                </div>
                                <button style="display: flex; align-items: center; gap: 8px; padding: 8px 16px; background: transparent; color: var(--text-muted); border: 1px solid var(--border-glass); border-radius: 8px; cursor: pointer; font-size: 14px; font-weight: 500;">
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
                                        <th style="padding: 12px 16px;">Code</th>
                                        <th class="hide-on-mobile" style="padding: 12px 16px;">Brand/Model</th>
                                        <th class="hide-on-mobile" style="padding: 12px 16px;">Customer</th>
                                        <th class="hide-on-mobile" style="padding: 12px 16px;">AC Type & Capacity</th>
                                        <th class="hide-on-mobile" style="padding: 12px 16px;">Status</th>
                                        <th style="padding: 12px 16px; text-align: right;">Actions</th>
                                    </tr>
                                </thead>
                                <tbody id="acTableBody">
                                    ${renderTable()}
                                </tbody>
                            </table>
                        </div>
                        
                        <div id="acPagination">
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
                        state.page = 1; // Reset to page 1 on search
                        await fetchAcUnits();
                        updateDOM();
                    }, 500);
                });
            }

            const perPageSelect = document.getElementById('perPageSelect');
            if (perPageSelect) {
                perPageSelect.addEventListener('change', async (e) => {
                    state.perPage = parseInt(e.target.value);
                    state.page = 1;
                    await fetchAcUnits();
                    updateDOM();
                });
            }

            // Delegation for pagination clicks
            const paginationContainer = document.getElementById('acPagination');
            if (paginationContainer) {
                paginationContainer.addEventListener('click', async (e) => {
                    if (e.target.classList.contains('page-btn') && !e.target.disabled) {
                        state.page = parseInt(e.target.getAttribute('data-page'));
                        await fetchAcUnits();
                        updateDOM();
                    }
                });
            }
        };

        const updateDOM = () => {
            document.getElementById('acTableBody').innerHTML = renderTable();
            document.getElementById('acPagination').innerHTML = renderPagination();
            // Need to reattach any row-specific event listeners here if not using inline onclick
        };

        // Initial Load
        await fetchAcUnits();
        renderView();
        attachEventListeners();
    },

    deleteUnit: async (id) => {
        if (!confirm('Are you sure you want to delete this AC Unit? This will also remove its QR code.')) return;

        try {
            const res = await window.api.delete(`/ac-units/${id}`);
            if (res.success) {
                window.showToast('AC Unit deleted successfully', 'success');
                window.router.navigate('/ac-units');
            } else {
                window.showToast('Failed to delete AC Unit', 'error');
            }
        } catch (err) {
            window.showToast('Error deleting AC Unit', 'error');
        }
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
    },

    printAcUnit: async (id) => {
        try {
            const res = await window.api.get(`/ac-units/${id}`);
            if (!res.success) { window.showToast('Could not load AC Unit data', 'error'); return; }
            const ac = res.data;
            const token = ac.qr_code ? ac.qr_code.token : null;

            if (!token) {
                window.showToast('No QR code found for this AC Unit', 'error');
                return;
            }

            const qrImgUrl = `https://api.qrserver.com/v1/create-qr-code/?size=400x400&data=${token}`;

            const printWindow = window.open('', '_blank');
            printWindow.document.write(`
                <!DOCTYPE html>
                <html>
                <head>
                    <title>QR - ${ac.ac_code}</title>
                    <style>
                        * { margin: 0; padding: 0; box-sizing: border-box; }
                        body {
                            font-family: 'Segoe UI', sans-serif;
                            background: #fff;
                            display: flex;
                            justify-content: center;
                            align-items: center;
                            min-height: 100vh;
                        }
                        .card {
                            text-align: center;
                            border: 2px dashed #e2e8f0;
                            border-radius: 16px;
                            padding: 32px 40px;
                            width: 280px;
                        }
                        .card img {
                            width: 220px;
                            height: 220px;
                            display: block;
                            margin: 0 auto 16px;
                        }
                        .ac-code {
                            font-size: 20px;
                            font-weight: 800;
                            letter-spacing: 1px;
                            color: #0f172a;
                            margin-bottom: 6px;
                        }
                        .customer {
                            font-size: 13px;
                            color: #64748b;
                            margin-bottom: 4px;
                        }
                        .token {
                            font-size: 9px;
                            color: #94a3b8;
                            word-break: break-all;
                            margin-top: 10px;
                        }
                        @media print {
                            body { min-height: auto; }
                            .card { border: 1px dashed #ccc; }
                        }
                    </style>
                </head>
                <body>
                    <div class="card">
                        <img src="${qrImgUrl}" alt="QR Code">
                        <div class="ac-code">${ac.ac_code}</div>
                        <div class="customer">${ac.customer ? ac.customer.full_name : ''}</div>
                        ${ac.brand ? `<div class="customer">${ac.brand} ${ac.model || ''}</div>` : ''}
                        <div class="token">${token}</div>
                    </div>
                    <script>window.onload = function() { window.print(); }<\/script>
                </body>
                </html>
            `);
            printWindow.document.close();
        } catch (err) {
            window.showToast('Error generating print view', 'error');
        }
    }
};
