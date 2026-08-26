window.AcUnitList = {
    render: async (container) => {

        let state = {
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

        const renderTable = () => {
            const codeType = window.appSettings?.code_type || 'qr';
            const codeText = codeType === 'barcode' ? 'Barcode' : 'QR';
            
            if (!state.acUnits.length) {
                return `<tr><td colspan="6" style="padding: 16px; text-align: center; color: var(--text-muted);">No AC Units found</td></tr>`;
            }

            return state.acUnits.map(ac => `
                <tr style="border-bottom: 1px solid var(--border-glass);">
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
                    <td colspan="7" style="padding: 16px; background: #f8fafc; border-bottom: 1px solid var(--border-glass);">
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
            // Need to reattach any row-specific event listeners here if not using inline onclick
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
            const canvas = document.createElement('canvas');
            canvas.width = 340;
            canvas.height = 480;
            const ctx = canvas.getContext('2d');
            
            // White background
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            
            // Dashed border
            ctx.strokeStyle = '#e2e8f0';
            ctx.lineWidth = 2;
            ctx.setLineDash([8, 8]);
            ctx.beginPath();
            ctx.roundRect(10, 10, 320, 460, 16);
            ctx.stroke();
            ctx.setLineDash([]);
            
            // Load image from blob URL
            const img = new Image();
            img.src = blobUrl;
            await new Promise((resolve, reject) => {
                img.onload = resolve;
                img.onerror = reject;
            });
            URL.revokeObjectURL(blobUrl);
            
            // Draw Code
            if (codeType === 'barcode') {
                ctx.drawImage(img, 20, 60, 300, 120);
            } else {
                ctx.drawImage(img, 60, 40, 220, 220);
            }
            
            // Draw Texts
            ctx.textAlign = 'center';
            
            // AC Code
            ctx.font = 'bold 22px "Segoe UI", sans-serif';
            ctx.fillStyle = '#0f172a';
            ctx.fillText(ac.ac_code, 170, codeType === 'barcode' ? 210 : 300);
            
            // Customer Name
            ctx.font = '14px "Segoe UI", sans-serif';
            ctx.fillStyle = '#64748b';
            ctx.fillText(ac.customer ? ac.customer.full_name : '', 170, codeType === 'barcode' ? 235 : 330);
            
            // Brand/Model
            if (ac.brand) {
                ctx.fillText(`${ac.brand} ${ac.model || ''}`, 170, codeType === 'barcode' ? 258 : 355);
            }
            
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
