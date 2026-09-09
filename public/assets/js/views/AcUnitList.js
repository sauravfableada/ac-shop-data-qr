window.AcUnitList = {
    render: async (container) => {

        let state = {
            selectAll: false,
            selectedIds: new Set(),
            excludedIds: new Set(),
            search: '',
            filterAcUnitId: '',
            filterCustomerId: '',
            filterStaffId: '',
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
            });
            if (state.filterAcUnitId) query.append('ac_unit_id', state.filterAcUnitId);
            if (state.filterCustomerId) query.append('customer_id', state.filterCustomerId);
            if (state.filterStaffId) query.append('created_by', state.filterStaffId);

            const response = await window.api.get('/ac-units?' + query.toString());

            if (response.success) {
                state.acUnits = response.data.data;
                state.meta = response.data.meta;
            } else {
                state.acUnits = [];
                state.meta = null;
            }
        };

        const isSelected = id => state.selectAll
            ? !state.excludedIds.has(String(id))
            : state.selectedIds.has(String(id));

        const updateSelection = () => {
            const checkbox = document.getElementById('selectAllAcUnits');
            checkbox.checked = state.selectAll && state.excludedIds.size === 0;
            checkbox.indeterminate = state.selectAll ? state.excludedIds.size > 0 : state.selectedIds.size > 0;
            document.querySelectorAll('.ac-select-row').forEach(input => {
                input.checked = isSelected(input.value);
            });
            const partial = state.selectAll ? state.excludedIds.size > 0 : state.selectedIds.size > 0;
            document.getElementById('printAcLabelsText').textContent = partial ? 'Print Selected' : 'Print All';
        };

        const renderTable = () => {
            const codeType = window.appSettings?.code_type || 'qr';
            const codeText = codeType === 'barcode' ? 'Barcode' : 'QR';
            
            if (!state.acUnits.length) {
                return `<tr><td colspan="8" style="padding: 16px; text-align: center; color: var(--text-muted);">No AC Units found</td></tr>`;
            }

            return state.acUnits.map(ac => `
                <tr style="border-bottom: 1px solid var(--border-glass);">
                    <td style="padding: 16px; width: 40px;"><input type="checkbox" class="ac-select-row" value="${ac.id}" aria-label="Select AC unit ${ac.id}" ${isSelected(ac.id) ? 'checked' : ''} style="width: 16px; height: 16px; cursor: pointer;"></td>
                    <td style="padding: 16px; font-size: 14px; font-weight: 600; color: var(--text-main);">${ac.ac_code}</td>
                    <td class="hide-on-mobile" style="padding: 16px; font-size: 14px; color: var(--text-muted);">${ac.brand || '-'} ${ac.model || ''}</td>
                    <td style="padding: 16px; font-size: 14px; color: var(--text-muted);">${ac.customer ? ac.customer.full_name : '--'}</td>
                    <td class="hide-on-mobile" style="padding: 16px; font-size: 14px; color: var(--text-muted);">${ac.ac_type || '-'} · ${ac.capacity || '-'}</td>
                    <td class="hide-on-mobile" style="padding: 16px; font-size: 14px; color: var(--text-muted);">${ac.creator ? ac.creator.name : '--'}</td>
                    <td class="hide-on-mobile" style="padding: 16px;">
                        <span style="padding: 4px 8px; border-radius: 4px; font-size: 12px; font-weight: 600; background: ${ac.status === 'active' ? 'rgba(16,185,129,0.1)' : 'rgba(244,63,94,0.1)'}; color: ${ac.status === 'active' ? '#10B981' : '#F43F5E'};">${ac.status ? ac.status.toUpperCase() : 'ACTIVE'}</span>
                    </td>
                    <td style="padding: 16px;">
                        <button class="mobile-expand-btn" onclick="window.AcUnitList.toggleMobileRow(${ac.id}, this)"><i class="fa-solid fa-plus"></i></button>
                        <div class="desktop-only" style="display: flex; gap: 8px; justify-content: flex-end;">
                            <button onclick="window.router.navigate('/services/add?ac_id=${ac.id}')" title="Add Service" style="background: #0ea5e9; border: none; color: white; border-radius: 4px; padding: 6px 10px; cursor: pointer; transition: 0.2s;"><i class="fa-solid fa-plus"></i> Service</button>
                            <button onclick="window.AcUnitList.downloadQrImage(${ac.id})" title="Save ${codeText}" style="background: #8b5cf6; border: none; color: white; border-radius: 4px; padding: 6px 10px; cursor: pointer; transition: 0.2s;"><i class="fa-solid fa-download"></i> Save ${codeText}</button>
                            <button onclick="window.AcUnitList.shareQrWhatsapp(${ac.id})" title="Share WhatsApp" style="background: #25D366; border: none; color: white; border-radius: 4px; padding: 6px 10px; cursor: pointer; transition: 0.2s;"><i class="fa-brands fa-whatsapp"></i> WhatsApp</button>
                            <button onclick="window.AcUnitList.printAcUnit(${ac.id})" title="Print ${codeText}" style="background: #0f172a; border: none; color: white; border-radius: 4px; padding: 6px 10px; cursor: pointer; transition: 0.2s;"><i class="fa-solid fa-print"></i> Print</button>
                            <button onclick="window.router.navigate('/ac-units/view/${ac.id}')" title="View" style="background: #3b82f6; border: none; color: white; border-radius: 4px; padding: 6px 10px; cursor: pointer; transition: 0.2s;"><i class="fa-solid fa-eye"></i> View</button>
                            <button onclick="window.router.navigate('/ac-units/edit/${ac.id}')" title="Edit" style="background: #f59e0b; border: none; color: white; border-radius: 4px; padding: 6px 10px; cursor: pointer; transition: 0.2s;"><i class="fa-solid fa-pen-to-square"></i> Edit</button>
                            <button onclick="window.AcUnitList.deleteUnit(${ac.id})" title="Delete" style="background: #ef4444; border: none; color: white; border-radius: 4px; padding: 6px 10px; cursor: pointer; transition: 0.2s;"><i class="fa-solid fa-trash"></i> Delete</button>
                        </div>
                    </td>
                </tr>
                <tr id="mobile-expand-${ac.id}" class="mobile-expanded-row">
                    <td colspan="8" style="padding: 16px; background: #f8fafc; border-bottom: 1px solid var(--border-glass);">
                        <div style="background: #ffffff; border-radius: 12px; border-left: 4px solid #0f172a; padding: 16px; box-shadow: 0 4px 6px rgba(0,0,0,0.02);">
                            <div style="display: flex; justify-content: space-between; margin-bottom: 12px; font-size: 12px; font-weight: 700; color: #0f172a;">
                                <div><i class="fa-solid fa-user-plus" style="margin-right: 8px;"></i> CREATED BY :</div>
                                <div style="font-weight: 400; color: #64748b; text-align: right; max-width: 60%;">${ac.creator ? ac.creator.name : '--'}</div>
                            </div>
                            <div style="display: flex; justify-content: space-between; margin-bottom: 12px; font-size: 12px; font-weight: 700; color: #0f172a;">
                                <div><i class="fa-solid fa-fan" style="margin-right: 8px;"></i> MODEL :</div>
                                <div style="font-weight: 400; color: #64748b;">${ac.brand || '-'} ${ac.model || ''}</div>
                            </div>
                            <div style="display: flex; justify-content: space-between; margin-bottom: 12px; font-size: 12px; font-weight: 700; color: #0f172a;">
                                <div><i class="fa-solid fa-user" style="margin-right: 8px;"></i> CUSTOMER :</div>
                                <div style="font-weight: 400; color: #64748b;">${ac.customer ? ac.customer.full_name : '--'}</div>
                            </div>
                            <div style="display: flex; justify-content: space-between; margin-bottom: 12px; font-size: 12px; font-weight: 700; color: #0f172a;">
                                <div><i class="fa-solid fa-${codeType === 'barcode' ? 'barcode' : 'qrcode'}" style="margin-right: 8px;"></i> ${codeText.toUpperCase()} :</div>
                                <div style="font-weight: 400; color: #64748b;">${ac.qr_code && ac.qr_code.token ? 'Yes' : 'No'}</div>
                            </div>
                            <div style="display: flex; justify-content: space-between; margin-bottom: 16px; font-size: 12px; font-weight: 700; color: #0f172a;">
                                <div><i class="fa-solid fa-circle-check" style="margin-right: 8px;"></i> STATUS :</div>
                                <div style="font-weight: 400; color: #64748b;">${ac.status ? ac.status.toUpperCase() : 'ACTIVE'}</div>
                            </div>
                            
                            <hr style="border: 0; border-top: 1px solid #e2e8f0; margin-bottom: 16px;">
                            
                            <div style="display: flex; flex-wrap: wrap; gap: 8px; justify-content: flex-start; align-items: center;">
                                <button onclick="window.router.navigate('/services/add?ac_id=${ac.id}')" style="background: #0ea5e9; border: none; color: white; border-radius: 6px; padding: 6px 12px; cursor: pointer; font-size: 12px; font-weight: 600;"><i class="fa-solid fa-plus" style="margin-right: 4px;"></i> Service</button>
                                <button onclick="window.AcUnitList.downloadQrImage(${ac.id})" style="background: #8b5cf6; border: none; color: white; border-radius: 6px; padding: 6px 12px; cursor: pointer; font-size: 12px; font-weight: 600;"><i class="fa-solid fa-download" style="margin-right: 4px;"></i> Save ${codeText}</button>
                                <button onclick="window.AcUnitList.shareQrWhatsapp(${ac.id})" style="background: #25D366; border: none; color: white; border-radius: 6px; padding: 6px 12px; cursor: pointer; font-size: 12px; font-weight: 600;"><i class="fa-brands fa-whatsapp" style="margin-right: 4px;"></i> WhatsApp</button>
                                <button onclick="window.AcUnitList.printAcUnit(${ac.id})" style="background: #0f172a; border: none; color: white; border-radius: 6px; padding: 6px 12px; cursor: pointer; font-size: 12px; font-weight: 600;"><i class="fa-solid fa-print" style="margin-right: 4px;"></i> Print</button>
                                <button onclick="window.router.navigate('/ac-units/view/${ac.id}')" style="background: #3b82f6; border: none; color: white; border-radius: 6px; padding: 6px 12px; cursor: pointer; font-size: 12px; font-weight: 600;"><i class="fa-regular fa-eye" style="margin-right: 4px;"></i> View</button>
                                <button onclick="window.router.navigate('/ac-units/edit/${ac.id}')" style="background: #f59e0b; border: none; color: white; border-radius: 6px; padding: 6px 12px; cursor: pointer; font-size: 12px; font-weight: 600;"><i class="fa-solid fa-pencil" style="margin-right: 4px;"></i> Edit</button>
                                <button onclick="window.AcUnitList.deleteUnit(${ac.id})" style="background: #ef4444; border: none; color: white; border-radius: 6px; padding: 6px 12px; cursor: pointer; font-size: 12px; font-weight: 600;"><i class="fa-regular fa-trash-can" style="margin-right: 4px;"></i> Delete</button>
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
            const codeType = window.appSettings?.code_type || 'qr';
            const codeIcon = codeType === 'barcode' ? 'fa-barcode' : 'fa-qrcode';
            
            const content = `
                <div class="glass-panel" style="padding: 24px; background: #ffffff;">
                    <div class="table-header-row" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px;">
                        <div>
                            <h1 style="font-size: 24px; margin-bottom: 4px; color: #0f172a;">AC Units</h1>
                            
                        </div>
                        <div style="display: flex; gap: 12px;">
                            <button id="printAcLabels" title="Print selected labels, or all labels when nothing is selected" style="display: flex; align-items: center; gap: 8px; padding: 8px 16px; background: #0f172a; color: white; border: none; border-radius: 8px; cursor: pointer; font-weight: 600; font-size: 14px; white-space: nowrap;">
                                <i class="fa-solid fa-print"></i> <span id="printAcLabelsText">Print All</span>
                            </button>
                            <button class="hide-on-mobile" onclick="window.router.navigate('/scanner')" style="display: flex; align-items: center; gap: 8px; padding: 8px 16px; background: transparent; color: #0f172a; border: 1px solid #e2e8f0; border-radius: 8px; cursor: pointer; font-weight: 600; font-size: 14px;">
                                <i class="fa-solid ${codeIcon}"></i> Scan ${codeType === 'barcode' ? 'Barcode' : 'QR'}
                            </button>
                            <button onclick="window.router.navigate('/ac-units/add')" style="display: flex; align-items: center; gap: 8px; padding: 8px 16px; background: #ff9f43; color: white; border: none; border-radius: 8px; cursor: pointer; font-weight: 600; font-size: 14px; white-space: nowrap;">
                                <i class="fa-solid fa-plus"></i> Add AC Unit
                            </button>
                        </div>
                    </div>

                    <div>
                        <div class="table-filter-row" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; gap: 12px; flex-wrap: wrap;">
                            <div style="display: flex; gap: 12px; flex-wrap: wrap; flex: 1;">
                                <!-- Search Input -->
                                <div style="position: relative; flex: 1 1 140px; min-width: 140px;">
                                    <i class="fa-solid fa-magnifying-glass" style="position: absolute; left: 12px; top: 50%; transform: translateY(-50%); color: #94a3b8; font-size: 14px; pointer-events: none; z-index: 1;"></i>
                                    <input type="text" id="searchInput" value="${state.search}" placeholder="Search Serial No..." style="width: 100%; padding: 9px 12px 9px 38px !important; border-radius: 8px; border: 1px solid var(--border-glass); background: transparent; color: var(--text-main); outline: none; font-size: 14px;">
                                </div>
                                
                                <!-- Code Filter -->
                                <div style="flex: 1 1 140px; min-width: 140px;">
                                    <select id="filterCodeSelect" class="choices-select" data-placeholder="All Serial Nos">
                                        <option value="">All Serial Nos</option>
                                    </select>
                                </div>
                                
                                <!-- Customer Filter -->
                                <div style="flex: 1 1 140px; min-width: 140px;">
                                    <select id="filterCustomerSelect" class="choices-select" data-placeholder="All Customers">
                                        <option value="">All Customers</option>
                                    </select>
                                </div>
                                
                                <!-- Staff Filter -->
                                <div style="flex: 1 1 140px; min-width: 140px;">
                                    <select id="filterStaffSelect" class="choices-select" data-placeholder="All Staff">
                                        <option value="">All Staff</option>
                                    </select>
                                </div>
                                
                                <!-- Per Page -->
                                <div style="flex: none; display: flex; align-items: center; gap: 8px; color: var(--text-muted); font-size: 14px; white-space: nowrap;">
                                    Show:
                                    <select id="perPageSelect" style="width: auto !important; height: auto !important; padding: 7px 10px; border-radius: 8px; border: 1px solid var(--border-glass); background: transparent; color: var(--text-main); outline: none; font-size: 14px; cursor: pointer;">
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
                                        <th style="padding: 12px 16px; width: 40px;"><input type="checkbox" id="selectAllAcUnits" aria-label="Select all AC units across all pages" title="Select all AC units across all pages" style="width: 16px; height: 16px; cursor: pointer;"></th>
                                        <th style="padding: 12px 16px;">Serial No</th>
                                        <th class="hide-on-mobile" style="padding: 12px 16px;">Brand/Model</th>
                                        <th style="padding: 12px 16px;">Customer</th>
                                        <th class="hide-on-mobile" style="padding: 12px 16px;">AC Type & Capacity</th>
                                        <th class="hide-on-mobile" style="padding: 12px 16px;">Created By</th>
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
            document.getElementById('selectAllAcUnits').addEventListener('change', e => {
                state.selectAll = e.target.checked;
                state.selectedIds.clear();
                state.excludedIds.clear();
                updateSelection();
            });
            document.getElementById('acTableBody').addEventListener('change', e => {
                if (!e.target.matches('.ac-select-row')) return;
                const id = e.target.value;
                if (state.selectAll) {
                    if (e.target.checked) state.excludedIds.delete(id);
                    else state.excludedIds.add(id);
                } else {
                    if (e.target.checked) state.selectedIds.add(id);
                    else state.selectedIds.delete(id);
                }
                updateSelection();
            });
            document.getElementById('printAcLabels').addEventListener('click', e => {
                window.AcUnitList.printAll(e.currentTarget, {
                    selectAll: state.selectAll,
                    selectedIds: new Set(state.selectedIds),
                    excludedIds: new Set(state.excludedIds)
                });
            });
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

            // Load filters data
            (async () => {
                try {
                    const acRes = await window.api.get('/ac-units?per_page=1000');
                    const codeSelect = document.getElementById('filterCodeSelect');
                    if (!codeSelect) return;

                    if (acRes.success) {
                        const units = acRes.data?.data || acRes.data || [];
                        units.forEach(u => {
                            const opt = document.createElement('option');
                            opt.value = u.id;
                            opt.textContent = u.ac_code + (u.brand ? ` - ${u.brand}` : '');
                            if (u.id == state.filterAcUnitId) opt.selected = true;
                            codeSelect.appendChild(opt);
                        });
                    }

                    const custRes = await window.api.get('/customers?per_page=1000');
                    const custSelect = document.getElementById('filterCustomerSelect');
                    if (!custSelect) return;

                    if (custRes.success) {
                        const customers = custRes.data?.data || custRes.data || [];
                        customers.forEach(c => {
                            const opt = document.createElement('option');
                            opt.value = c.id;
                            opt.textContent = c.full_name + (c.mobile ? ` (${c.mobile})` : '');
                            if (c.id == state.filterCustomerId) opt.selected = true;
                            custSelect.appendChild(opt);
                        });
                    }

                    const staffRes = await window.api.get('/admin/staff?per_page=1000');
                    const staffSelect = document.getElementById('filterStaffSelect');
                    if (!staffSelect) return;

                    if (staffRes.success) {
                        const staffList = staffRes.data || [];
                        staffList.forEach(s => {
                            const opt = document.createElement('option');
                            opt.value = s.id;
                            opt.textContent = s.name;
                            if (s.id == state.filterStaffId) opt.selected = true;
                            staffSelect.appendChild(opt);
                        });
                    }

                    if (window.Choices) {
                        const codeChoices = new Choices(codeSelect, { searchEnabled: true, itemSelectText: '', shouldSort: false });
                        const custChoices = new Choices(custSelect, { searchEnabled: true, itemSelectText: '', shouldSort: false });
                        const staffChoices = new Choices(staffSelect, { searchEnabled: true, itemSelectText: '', shouldSort: false });

                        codeSelect.addEventListener('change', async (e) => {
                            state.filterAcUnitId = e.target.value;
                            state.page = 1;
                            await fetchAcUnits();
                            updateDOM();
                        });

                        custSelect.addEventListener('change', async (e) => {
                            state.filterCustomerId = e.target.value;
                            state.page = 1;
                            await fetchAcUnits();
                            updateDOM();
                        });

                        staffSelect.addEventListener('change', async (e) => {
                            state.filterStaffId = e.target.value;
                            state.page = 1;
                            await fetchAcUnits();
                            updateDOM();
                        });
                    }
                } catch (e) { console.error("Failed to load filter dropdowns", e); }
            })();

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
            updateSelection();
        };

        // Initial Load
        await fetchAcUnits();
        renderView();
        attachEventListeners();
    },

    deleteUnit: async (id) => {
        const unit = state.acUnits.find(u => String(u.id) === String(id));
        const acCode = unit ? unit.ac_code : 'AC Unit';

        const result = await Swal.fire({
            title: 'Are you sure?',
            text: "This will delete the AC Unit and its QR code.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#ef4444',
            cancelButtonColor: '#64748b',
            confirmButtonText: 'Yes, delete it!'
        });
        
        if (!result.isConfirmed) return;

        try {
            const res = await window.api.delete(`/ac-units/${id}`);
            if (res.success) {
                if (window.addNotification) {
                    window.addNotification(
                        'AC Unit Deleted',
                        `AC Unit "${acCode}" was successfully deleted.`,
                        'ac-unit'
                    );
                }
                Swal.fire('Deleted!', 'AC Unit deleted successfully.', 'success');
                window.router.navigate('/ac-units');
            } else {
                Swal.fire('Error', 'Failed to delete AC Unit', 'error');
            }
        } catch (err) {
            Swal.fire('Error', 'Error deleting AC Unit', 'error');
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

    printAll: async (button, selection = null) => {
        const printWindow = window.open('', '_blank');
        if (!printWindow) {
            window.showToast('Please allow popups to print', 'warning');
            return;
        }
        if (button) button.disabled = true;
        printWindow.document.body.textContent = 'Preparing all labels...';
        try {
            let codeType = window.appSettings?.code_type || 'qr';
            const settings = await window.api.get('/settings');
            if (settings.success && settings.data) codeType = settings.data.code_type || codeType;

            const units = [];
            let page = 1;
            let lastPage = 1;
            do {
                if (printWindow.closed) return;
                const response = await window.api.get(`/ac-units?per_page=100&page=${page}`);
                if (!response.success || !Array.isArray(response.data?.data)) {
                    throw new Error('Could not load all AC units. Please try again.');
                }
                units.push(...response.data.data);
                lastPage = response.data.meta.last_page;
                page += 1;
            } while (page <= lastPage);

            let selectedUnits = selection?.selectAll
                ? units.filter(ac => !selection.excludedIds.has(String(ac.id)))
                : selection?.selectedIds.size
                    ? units.filter(ac => selection.selectedIds.has(String(ac.id)))
                    : units;
            // Unchecking every row has the same meaning as an empty selection.
            if (selection?.selectAll && !selectedUnits.length) selectedUnits = units;
            const printable = selectedUnits.filter(ac => ac.qr_code?.token);
            if (!printable.length) {
                printWindow.close();
                window.showToast('No labels available to print', 'warning');
                return;
            }
            const escapeHtml = value => String(value ?? '').replace(/[&<>"']/g, char => ({
                '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
            })[char]);
            const cards = printable.map(ac => {
                const token = ac.qr_code.token;
                const src = codeType === 'barcode'
                    ? `https://bwipjs-api.metafloor.com/?bcid=code128&text=${encodeURIComponent(ac.ac_code)}&includetext&guardwhitespace`
                    : `https://api.qrserver.com/v1/create-qr-code/?size=400x400&data=${encodeURIComponent(token)}`;
                return `<div class="slot"><div class="card">
                    <img src="${escapeHtml(src)}" alt="${escapeHtml(ac.ac_code)}">
                    <div class="ac-code">${escapeHtml(ac.ac_code)}</div>
                    ${ac.customer?.full_name ? `<div class="customer">${escapeHtml(ac.customer.full_name)}</div>` : ''}
                    ${ac.brand ? `<div class="brand">${escapeHtml(ac.brand)} ${escapeHtml(ac.model)}</div>` : ''}
                    <div class="message">Scan this code for AC service history &amp; support</div>
                    <div class="token">${escapeHtml(token)}</div>
                </div></div>`;
            });
            const sheets = [];
            for (let index = 0; index < cards.length; index += 9) {
                sheets.push(`<section class="sheet">${cards.slice(index, index + 9).join('')}</section>`);
            }
            if (printWindow.closed) return;
            printWindow.document.open();
            printWindow.document.write(`<!DOCTYPE html><html><head>
                <title>All ${codeType === 'barcode' ? 'Barcodes' : 'QR Codes'}</title>
                <style>
                    * { box-sizing: border-box; margin: 0; padding: 0; }
                    @page { size: A4 portrait; margin: 0; }
                    body { font-family: 'Segoe UI', sans-serif; background: white; }
                    .sheet { width: 210mm; height: 296mm; padding: 10mm; display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); grid-auto-rows: max-content; align-content: start; gap: 2mm; break-after: page; }
                    .sheet:last-child { break-after: auto; }
                    .slot { display: flex; justify-content: center; align-items: flex-start; min-height: 0; max-height: 90mm; break-inside: avoid; }
                    .card { width: 100%; padding: 5mm 4mm; border: 1px dashed #e2e8f0; border-radius: 4mm; text-align: center; overflow-wrap: anywhere; transform-origin: top center; }
                    img { display: block; width: ${codeType === 'barcode' ? '50mm' : '40mm'}; height: ${codeType === 'barcode' ? '20mm' : '40mm'}; max-width: 100%; object-fit: contain; margin: 0 auto 3mm; }
                    .ac-code { font-size: 14px; font-weight: 800; letter-spacing: .5px; color: #0f172a; margin-bottom: 1.5mm; }
                    .customer { font-size: 12px; font-weight: 700; color: #1e293b; }
                    .brand { font-size: 10px; color: #64748b; margin-top: 1mm; }
                    .message { border-top: 1px solid #e2e8f0; margin: 2mm auto 0; padding-top: 2mm; max-width: 40mm; font-size: 9px; line-height: 1.4; color: #475569; }
                    .token { font-size: 7px; color: #94a3b8; margin-top: 2mm; }
                    @media screen { body { padding: 10mm; background: #f1f5f9; } .sheet { background: white; margin: 0 auto 10mm; } }
                </style></head><body><style>
.print-toolbar{max-width:210mm;margin:0 auto 16px;display:flex;justify-content:flex-end;gap:10px}
.print-toolbar button{display:inline-flex;align-items:center;gap:8px;padding:10px 16px;border:1px solid #cbd5e1;border-radius:8px;background:white;font:600 14px 'Segoe UI',sans-serif;cursor:pointer}
.print-toolbar button:first-child{background:#2563eb;color:white;border-color:#2563eb}
.print-toolbar button:disabled{opacity:.6;cursor:wait}
@media print{.print-toolbar{display:none!important}}
</style><div class="print-toolbar"><button id="save-pdf" disabled><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6M12 11v7m-3-3 3 3 3-3"/></svg><span>Save as PDF</span></button><button id="print-labels" disabled>Print</button></div>${sheets.join('')}</body></html>`);
            printWindow.document.close();
            await Promise.all(Array.from(printWindow.document.images, img => new Promise((resolve, reject) => {
                const timeout = setTimeout(() => reject(new Error('Code images took too long to load. Please try again.')), 60000);
                const loaded = () => { clearTimeout(timeout); resolve(); };
                const failed = () => { clearTimeout(timeout); reject(new Error('A code image could not load. Please try again.')); };
                img.onload = loaded;
                img.onerror = failed;
                if (img.complete) img.naturalWidth ? loaded() : failed();
            })));
            if (printWindow.closed) return;
            // Keep unusually long customer/model text inside its label slot.
            printWindow.document.querySelectorAll('.slot').forEach(slot => {
                const card = slot.firstElementChild;
                const scale = Math.min(1, slot.clientHeight / card.offsetHeight);
                if (scale < 1) card.style.transform = `scale(${scale})`;
            });
            if (selectedUnits.length > printable.length) {
                window.showToast(`${selectedUnits.length - printable.length} AC units without codes were skipped`, 'warning');
            }
            const saveButton = printWindow.document.getElementById('save-pdf');
            const printButton = printWindow.document.getElementById('print-labels');
            saveButton.disabled = printButton.disabled = false;
            printButton.onclick = () => printWindow.print();
            saveButton.onclick = async () => {
                saveButton.disabled = printButton.disabled = true;
                const label = saveButton.querySelector('span');
                label.textContent = 'Preparing PDF...';
                try {
                    const loadScript = src => new Promise((resolve, reject) => {
                        const script = printWindow.document.createElement('script');
                        script.src = src;
                        const timer = setTimeout(() => { script.remove(); reject(new Error('PDF tools took too long to load. Please try again.')); }, 30000);
                        script.onload = () => { clearTimeout(timer); resolve(); };
                        script.onerror = () => { clearTimeout(timer); script.remove(); reject(new Error('Could not load PDF tools. Check your connection and try again.')); };
                        printWindow.document.head.appendChild(script);
                    });
                    await Promise.all([
                        printWindow.html2canvas ? Promise.resolve() : loadScript('https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js'),
                        printWindow.jspdf ? Promise.resolve() : loadScript('https://cdnjs.cloudflare.com/ajax/libs/jspdf/3.0.3/jspdf.umd.min.js')
                    ]);
                    // Embed images first so failed requests cannot silently omit QR codes.
                    for (const img of printWindow.document.images) {
                        if (img.src.startsWith('data:')) continue;
                        const response = await fetch(img.src, { signal: AbortSignal.timeout(30000) });
                        if (!response.ok) throw new Error('Could not load a code image for the PDF. Please try again.');
                        const blob = await response.blob();
                        img.src = await new Promise((resolve, reject) => {
                            const reader = new FileReader();
                            reader.onload = () => resolve(reader.result);
                            reader.onerror = reject;
                            reader.readAsDataURL(blob);
                        });
                        await img.decode();
                    }
                    const pdf = new printWindow.jspdf.jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4', compress: true });
                    const pages = printWindow.document.querySelectorAll('.sheet');
                    for (let pageIndex = 0; pageIndex < pages.length; pageIndex++) {
                        if (pageIndex) pdf.addPage();
                        const sheet = pages[pageIndex];
                        const bounds = sheet.getBoundingClientRect();
                        // Freeze the browser's grid positions for the canvas renderer.
                        const slots = Array.from(sheet.querySelectorAll('.slot'), slot => {
                            const rect = slot.getBoundingClientRect();
                            return { left: rect.left - bounds.left, top: rect.top - bounds.top, width: rect.width, height: rect.height };
                        });
                        const canvas = await printWindow.html2canvas(sheet, {
                            scale: 3,
                            backgroundColor: '#ffffff',
                            logging: false,
                            onclone: (document, clonedSheet) => {
                                Object.assign(clonedSheet.style, { display: 'block', position: 'relative' });
                                clonedSheet.querySelectorAll('.slot').forEach((slot, index) => {
                                    const rect = slots[index];
                                    Object.assign(slot.style, {
                                        position: 'absolute',
                                        left: `${rect.left}px`,
                                        top: `${rect.top}px`,
                                        width: `${rect.width}px`,
                                        height: `${rect.height}px`
                                    });
                                });
                            }
                        });
                        pdf.addImage(canvas, 'PNG', 0, 0, 210, bounds.height * 210 / bounds.width, undefined, 'FAST');
                        canvas.width = canvas.height = 0;
                    }
                    pdf.save(codeType === 'barcode' ? 'all-barcodes.pdf' : 'all-qr-codes.pdf');
                } catch (error) {
                    printWindow.alert(error.message || 'Could not save the PDF. Please try again.');
                } finally {
                    saveButton.disabled = printButton.disabled = false;
                    label.textContent = 'Save as PDF';
                }
            };
            printWindow.focus();
        } catch (err) {
            if (!printWindow.closed) printWindow.close();
            window.showToast(err.message || 'Could not prepare labels for printing', 'error');
        } finally {
            if (button) button.disabled = false;
        }
    },
    printAcUnit: async (id) => {
        // Open window synchronously to avoid iOS popup blocker
        const printWindow = window.open('', '_blank');
        if (!printWindow) {
            window.showToast('Please allow popups to print', 'error');
            return;
        }

        try {
            const res = await window.api.get(`/ac-units/${id}`);
            if (!res.success) { 
                printWindow.close();
                window.showToast('Could not load AC Unit data', 'error'); 
                return; 
            }
            const ac = res.data;
            const token = ac.qr_code ? ac.qr_code.token : null;

            if (!token) {
                printWindow.close();
                window.showToast('No QR code found for this AC Unit', 'error');
                return;
            }

            const codeType = window.appSettings?.code_type || 'qr';
            const qrImgUrl = codeType === 'barcode' 
                ? `https://bwipjs-api.metafloor.com/?bcid=code128&text=${ac.ac_code}`
                : `https://api.qrserver.com/v1/create-qr-code/?size=400x400&data=${token}`;

            printWindow.document.open();
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
                            max-width: 100%;
                            height: ${codeType === 'barcode' ? '80px' : '200px'};
                            object-fit: contain;
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
                            font-size: 18px;
                            color: #1e293b;
                            font-weight: 700;
                        }
                        .token {
                            font-size: 9px;
                            color: #94a3b8;
                            word-break: break-all;
                            margin-top: 10px;
                        }
                        @page { margin: 0; }
                        @media print {
                            body { display: block; width: fit-content; min-height: 0; margin: 0; padding: 12px; }
                            .card { break-inside: avoid; }
                        }
                    </style>
                </head>
                <body>
                    <div class="card">
                        <img src="${qrImgUrl}" alt="QR Code">
                        <div class="ac-code">${ac.ac_code}</div>
                        ${ac.customer?.full_name ? `<div class="customer">${ac.customer.full_name}</div>` : ''}
                        ${ac.brand ? `<div style="font-size: 12px; color: #64748b; margin-bottom: 8px;">${ac.brand} ${ac.model || ''}</div>` : ''}
                        <div style="border-top: 1px solid #e2e8f0; color: #475569; font-size: 11px; font-weight: 600; line-height: 1.4; margin-top: 8px; padding-top: 9px;">Scan this code for AC service history &amp; support</div>
                        <div class="token">${token}</div>
                    </div>
                    <script>window.onload = function() {
                            const card = document.querySelector('.card');
                            const bounds = card.getBoundingClientRect();
                            const pageWidth = Math.ceil(bounds.width) + 24;
                            const pageHeight = Math.ceil(bounds.height) + 24;
                            const pageStyle = document.createElement('style');
                            pageStyle.textContent = '@page { size: ' + pageWidth + 'px ' + pageHeight + 'px; margin: 0; }';
                            document.head.appendChild(pageStyle);
                            requestAnimationFrame(() => requestAnimationFrame(() => window.print()));
                        }<\/script>
                </body>
                </html>
            `);
            printWindow.document.close();
        } catch (err) {
            if (printWindow) printWindow.close();
            window.showToast('Error generating print view', 'error');
        }
    },

    downloadQrImage: async (id) => {
        try {
            const res = await window.api.get(`/ac-units/${id}`);
            if (!res.success) { window.showToast('Could not load AC Unit data', 'error'); return; }
            const ac = res.data;
            const token = ac.qr_code ? ac.qr_code.token : null;
            if (!token) { window.showToast('No QR code found', 'error'); return; }
            
            // Always fetch fresh settings to get latest code_type selection
            let codeType = 'qr';
            try {
                const settingsRes = await window.api.get('/settings');
                if (settingsRes.success && settingsRes.data) {
                    codeType = settingsRes.data.code_type || window.appSettings?.code_type || 'qr';
                } else {
                    codeType = window.appSettings?.code_type || 'qr';
                }
            } catch (e) {
                codeType = window.appSettings?.code_type || 'qr';
            }

            const qrImgUrl = codeType === 'barcode' 
                ? `https://bwipjs-api.metafloor.com/?bcid=code128&text=${encodeURIComponent(ac.ac_code)}&includetext&guardwhitespace`
                : `https://api.qrserver.com/v1/create-qr-code/?size=400x400&data=${token}`;

            // Fetch image as blob to bypass CORS canvas taint
            let blobUrl;
            try {
                const imgFetch = await fetch(qrImgUrl);
                const imgBlob = await imgFetch.blob();
                blobUrl = URL.createObjectURL(imgBlob);
            } catch (e) {
                window.showToast('Could not load image. Check internet connection.', 'error');
                return;
            }
            
            // Create canvas for the card
            const img = new Image();
            img.crossOrigin = 'Anonymous';
            await new Promise((resolve, reject) => {
                img.onload = resolve;
                img.onerror = reject;
                img.src = blobUrl;
            });
            URL.revokeObjectURL(blobUrl);

            // Size the saved card to its content, including the complete bottom border.
            const imageHeight = codeType === 'barcode' ? 120 : 220;
            const customer = ac.customer?.full_name || '';
            const brand = ac.brand ? `${ac.brand} ${ac.model || ''}`.trim() : '';
            const canvas = document.createElement('canvas');
            canvas.width = 340;
            canvas.height = 40 + imageHeight + 42 + (customer ? 26 : 0) + (brand ? 22 : 0) + 100;
            const ctx = canvas.getContext('2d');
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.strokeStyle = '#e2e8f0';
            ctx.lineWidth = 1;
            ctx.setLineDash([3, 3]);
            ctx.beginPath();
            ctx.roundRect(10, 10, 320, canvas.height - 20, 16);
            ctx.stroke();
            ctx.setLineDash([]);

            if (codeType === 'barcode') {
                ctx.drawImage(img, 30, 40, 280, imageHeight);
            } else {
                ctx.drawImage(img, 60, 40, 220, imageHeight);
            }
            ctx.textAlign = 'center';
            let textY = 40 + imageHeight + 32;
            ctx.font = 'bold 22px "Segoe UI", sans-serif';
            ctx.fillStyle = '#0f172a';
            ctx.fillText(ac.ac_code, 170, textY, 280);
            if (customer) {
                textY += 26;
                ctx.font = 'bold 18px "Segoe UI", sans-serif';
                ctx.fillStyle = '#1e293b';
                ctx.fillText(customer, 170, textY, 280);
            }
            if (brand) {
                textY += 22;
                ctx.font = '12px "Segoe UI", sans-serif';
                ctx.fillStyle = '#64748b';
                ctx.fillText(brand, 170, textY, 280);
            }

            const dividerY = textY + 14;
            ctx.strokeStyle = '#e2e8f0';
            ctx.beginPath();
            ctx.moveTo(60, dividerY);
            ctx.lineTo(280, dividerY);
            ctx.stroke();
            ctx.font = '11px "Segoe UI", sans-serif';
            ctx.fillStyle = '#475569';
            ctx.fillText('Scan this code for AC service history &', 170, dividerY + 19);
            ctx.fillText('support', 170, dividerY + 34);
            ctx.font = '9px "Segoe UI", sans-serif';
            ctx.fillStyle = '#94a3b8';
            ctx.fillText(token, 170, dividerY + 59, 280);

            const dataUrl = canvas.toDataURL('image/png');
            const a = document.createElement('a');
            a.style.display = 'none';
            a.href = dataUrl;
            a.download = `${codeType === 'barcode' ? 'Barcode' : 'QR'}_${ac.ac_code}.png`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            window.showToast('Downloaded successfully!', 'success');
        } catch (err) {
            console.error(err);
            window.showToast('Error downloading image', 'error');
        }
    },

    shareQrWhatsapp: async (id) => {
        try {
            const res = await window.api.get(`/ac-units/${id}`);
            if (!res.success) { window.showToast('Could not load AC Unit data', 'error'); return; }
            const ac = res.data;
            const token = ac.qr_code ? ac.qr_code.token : null;
            if (!token) { window.showToast('No QR code found', 'error'); return; }
            
            // Always fetch fresh settings to get latest code_type selection
            let codeType = 'qr';
            try {
                const settingsRes = await window.api.get('/settings');
                if (settingsRes.success && settingsRes.data) {
                    codeType = settingsRes.data.code_type || window.appSettings?.code_type || 'qr';
                } else {
                    codeType = window.appSettings?.code_type || 'qr';
                }
            } catch (e) {
                codeType = window.appSettings?.code_type || 'qr';
            }

            const qrImgUrl = codeType === 'barcode' 
                ? `https://bwipjs-api.metafloor.com/?bcid=code128&text=${encodeURIComponent(ac.ac_code)}&includetext&guardwhitespace`
                : `https://api.qrserver.com/v1/create-qr-code/?size=400x400&data=${token}`;

            // Build the share message - always include the card link
            const qrCardUrl = `${window.location.origin}/qr-card/${token}`;
            const messageText = `AC Serial No: ${ac.ac_code}\nCustomer: ${ac.customer ? ac.customer.full_name : 'Unknown'}\nQR Card/Barcode Link: ${qrCardUrl}`;
            
            let phoneToUse = null;
            if (ac.customer) {
                const phone = ac.customer.whatsapp_no || ac.customer.mobile;
                if (phone) {
                    phoneToUse = phone.replace(/[^\d+]/g, '');
                }
            }

            // Fetch image as blob to bypass CORS canvas taint
            let blobUrl;
            try {
                const imgFetch = await fetch(qrImgUrl);
                const imgBlob = await imgFetch.blob();
                blobUrl = URL.createObjectURL(imgBlob);
            } catch (e) {
                window.showToast('Could not load image. Check internet connection.', 'error');
                return;
            }

            // Always generate the card image
            const canvas = document.createElement('canvas');
            canvas.width = 340;
            canvas.height = 480;
            const ctx = canvas.getContext('2d');
            
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            
            ctx.strokeStyle = '#e2e8f0';
            ctx.lineWidth = 2;
            ctx.setLineDash([8, 8]);
            ctx.beginPath();
            ctx.roundRect(10, 10, 320, 460, 16);
            ctx.stroke();
            ctx.setLineDash([]);
            
            const img = new Image();
            img.src = blobUrl;
            await new Promise((resolve, reject) => {
                img.onload = resolve;
                img.onerror = reject;
            });
            URL.revokeObjectURL(blobUrl);

            // Draw code image with correct dimensions for barcode vs QR
            if (codeType === 'barcode') {
                ctx.drawImage(img, 20, 60, 300, 120);
            } else {
                ctx.drawImage(img, 60, 40, 220, 220);
            }
            
            ctx.textAlign = 'center';
            ctx.font = 'bold 22px "Segoe UI", sans-serif';
            ctx.fillStyle = '#0f172a';
            ctx.fillText(ac.ac_code, 170, codeType === 'barcode' ? 210 : 300);
            
            ctx.font = '14px "Segoe UI", sans-serif';
            ctx.fillStyle = '#64748b';
            ctx.fillText(ac.customer ? ac.customer.full_name : '', 170, codeType === 'barcode' ? 235 : 330);
            
            if (ac.brand) {
                ctx.fillText(`${ac.brand} ${ac.model || ''}`, 170, codeType === 'barcode' ? 258 : 355);
            }

            const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/png'));
            
            if (phoneToUse) {
                // We have a direct chat. Try to copy image to clipboard so they can paste it.
                if (navigator.clipboard && window.ClipboardItem) {
                    try {
                        const item = new ClipboardItem({ 'image/png': blob });
                        await navigator.clipboard.write([item]);
                        window.showToast('Image copied! Just PASTE it in the chat.', 'success');
                    } catch (clipErr) {
                        console.log('Clipboard write failed', clipErr);
                    }
                }
                const whatsappUrl = `https://wa.me/${phoneToUse}?text=${encodeURIComponent(messageText)}`;
                window.location.href = whatsappUrl;
                return;
            }

            // If no specific phone, fallback to native Web Share API
            const label = codeType === 'barcode' ? 'Barcode' : 'QR';
            const file = new File([blob], `${label}_${ac.ac_code}.png`, { type: 'image/png' });
            if (navigator.canShare && navigator.canShare({ files: [file] })) {
                try {
                    await navigator.share({
                        files: [file],
                        title: `${codeType === 'barcode' ? 'Barcode' : 'QR Code'} - ${ac.ac_code}`,
                        text: messageText
                    });
                    return; 
                } catch (shareErr) {
                    if (shareErr.name === 'AbortError') return; 
                }
            }

            // Absolute fallback
            const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(messageText)}`;
            window.location.href = whatsappUrl;
        } catch (err) {
            window.showToast('Error sharing QR', 'error');
        }
    }
};
