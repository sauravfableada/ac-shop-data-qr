window.Reports = {
    state: {
        dateRange: 'all',
        serviceId: '',
        customerId: '',
        acUnitId: '',
        startDate: '',
        endDate: '',
        page: 1,
        perPage: 10
    },
    
    customers: [],
    acUnits: [],
    chartInstance: null,

    render: async (container) => {
        // Initial setup for the layout skeleton
        container.innerHTML = window.renderLayout(`
            <div class="glass-panel" style="padding: 24px; background: #ffffff;">
                <div class="table-header-row" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px;">
                    <div>
                        <h1 style="font-size: 24px; margin-bottom: 4px; color: #0f172a;">Service & Income Report</h1>
                    </div>
                </div>

                <!-- Filters and Totals Container -->
                <div style="margin-bottom: 24px;">
                    
                    <!-- Filters Row -->
                    <div style="display: flex; flex-wrap: wrap; gap: 16px; margin-bottom: 20px; align-items: center;">
                        <div style="flex: 1 1 140px; min-width: 140px;">
                            <select id="reportServiceSelect" onchange="window.Reports.applyFilters()" style="padding: 8px 12px; border: 1px solid #d1d5db; border-radius: 4px; outline: none; font-size: 13px; color: #374151; background: white; width: 100%;">
                                <option value="">All Services</option>
                            </select>
                        </div>

                        <div style="flex: 1 1 140px; min-width: 140px;">
                            <select id="reportCustomerSelect" onchange="window.Reports.applyFilters()" style="padding: 8px 12px; border: 1px solid #d1d5db; border-radius: 4px; outline: none; font-size: 13px; color: #374151; background: white; width: 100%;">
                                <option value="">All Customers</option>
                            </select>
                        </div>
                        
                        <div style="flex: 1 1 140px; min-width: 140px;">
                            <select id="reportAcSelect" onchange="window.Reports.applyFilters()" style="padding: 8px 12px; border: 1px solid #d1d5db; border-radius: 4px; outline: none; font-size: 13px; color: #374151; background: white; width: 100%;">
                                <option value="">All AC Units</option>
                            </select>
                        </div>

                        <select id="reportDateRange" onchange="window.Reports.handleDateRangeChange()" style="padding: 8px 12px; border: 1px solid #d1d5db; border-radius: 4px; outline: none; font-size: 13px; color: #374151; background: white; flex: 1 1 140px; min-width: 140px;">
                            <option value="all" selected>select filter</option>
                            <option value="daily">Daily</option>
                            <option value="weekly">Weekly</option>
                            <option value="monthly">Monthly</option>
                            <option value="yearly">Yearly</option>
                            <option value="custom">Custom Range</option>
                        </select>

                        <div id="customStartWrapper" style="display: none; flex: 1 1 140px; min-width: 140px;">
                            <input type="date" id="reportStartDate" onchange="window.Reports.applyFilters()" style="width: 100%; padding: 7px 12px; border: 1px solid #d1d5db; border-radius: 4px; outline: none; font-size: 13px; color: #374151; background: white;">
                        </div>
                        <div id="customEndWrapper" style="display: none; flex: 1 1 140px; min-width: 140px;">
                            <input type="date" id="reportEndDate" onchange="window.Reports.applyFilters()" style="width: 100%; padding: 7px 12px; border: 1px solid #d1d5db; border-radius: 4px; outline: none; font-size: 13px; color: #374151; background: white;">
                        </div>

                        <div style="flex: 1 1 140px; min-width: 140px; display: flex; align-items: center; gap: 8px; color: #64748b; font-size: 13px; white-space: nowrap;">
                            Show:
                            <select id="reportPerPage" onchange="window.Reports.applyFilters()" style="padding: 7px 10px; border-radius: 4px; border: 1px solid #d1d5db; background: white; color: #374151; outline: none; font-size: 13px; cursor: pointer;">
                                <option value="10" selected>10</option>
                                <option value="25">25</option>
                                <option value="50">50</option>
                                <option value="100">100</option>
                            </select>
                            per page
                        </div>
                    </div>

                    <!-- Totals Row and Action Buttons -->
                    <div style="display: flex; flex-wrap: wrap; gap: 12px; align-items: center; justify-content: space-between;">
                        
                        <div style="display: flex; flex-wrap: wrap; gap: 12px; align-items: center;">
                            <div style="padding: 8px 16px; border-radius: 4px; font-weight: 700; font-size: 14px; border: 1px solid #fecaca; background: #fef2f2; color: #ef4444;">
                                Total Pending: <span id="metricTotalPending">₹0.00</span>
                            </div>
                            <div style="padding: 8px 16px; border-radius: 4px; font-weight: 700; font-size: 14px; border: 1px solid #bbf7d0; background: #f0fdf4; color: #10b981;">
                                Total Paid: <span id="metricTotalReceived">₹0.00</span>
                            </div>
                            <div style="padding: 8px 16px; border-radius: 4px; font-weight: 700; font-size: 14px; border: 1px solid #fde68a; background: #fffbeb; color: #d97706;">
                                Total: <span id="metricTotalBilled">₹0.00</span>
                            </div>
                        </div>

                        <div style="display: flex; gap: 12px; align-items: center;">
                            <button onclick="window.Reports.exportExcel()" style="padding: 8px 16px; border-radius: 4px; font-weight: 600; font-size: 14px; border: none; background: #16a34a; color: white; cursor: pointer; display: flex; align-items: center; gap: 6px; box-shadow: 0 1px 2px rgba(0,0,0,0.1);">
                                <i class="fa-solid fa-file-excel"></i> Excel
                            </button>
                            <button onclick="window.Reports.exportPDF()" style="padding: 8px 16px; border-radius: 4px; font-weight: 600; font-size: 14px; border: none; background: #dc2626; color: white; cursor: pointer; display: flex; align-items: center; gap: 6px; box-shadow: 0 1px 2px rgba(0,0,0,0.1);">
                                <i class="fa-solid fa-file-pdf"></i> PDF
                            </button>
                        </div>
                    </div>
                </div>

                <!-- Data Table Section -->
                <div>
                <div style="overflow-x: auto;">
                    <table style="width: 100%; border-collapse: collapse;" id="reportsTable">
                        <thead>
                            <tr style="background: #f8fafc; border-bottom: 1px solid #e2e8f0;">
                                <th style="padding: 16px; text-align: left; font-size: 12px; font-weight: 700; color: #64748b; text-transform: uppercase;">Service #</th>
                                <th style="padding: 16px; text-align: left; font-size: 12px; font-weight: 700; color: #64748b; text-transform: uppercase;">Customer</th>
                                <th class="hide-on-mobile" style="padding: 16px; text-align: left; font-size: 12px; font-weight: 700; color: #64748b; text-transform: uppercase;">AC Unit</th>
                                <th class="hide-on-mobile" style="padding: 16px; text-align: left; font-size: 12px; font-weight: 700; color: #64748b; text-transform: uppercase;">Date</th>
                                <th class="hide-on-mobile" style="padding: 16px; text-align: right; font-size: 12px; font-weight: 700; color: #64748b; text-transform: uppercase;">Total Billed</th>
                                <th class="hide-on-mobile" style="padding: 16px; text-align: center; font-size: 12px; font-weight: 700; color: #64748b; text-transform: uppercase;">Status</th>
                                <th style="padding: 16px; text-align: right; font-size: 12px; font-weight: 700; color: #64748b; text-transform: uppercase;">Action</th>
                            </tr>
                        </thead>
                        <tbody id="reportsTableBody">
                            <tr>
                                <td colspan="6" style="padding: 32px; text-align: center; color: #94a3b8;"><i class="fa-solid fa-circle-notch fa-spin"></i> Loading data...</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                
                <!-- Pagination -->
                <div id="reportsPagination" style="padding: 16px 0 0 0; display: flex; justify-content: flex-end; align-items: center; gap: 8px; margin-top: 20px;">
                </div>
            </div>
        `);

        // Load Customers and AC Units for filters
        window.Reports.loadDropdowns();



        // Initial Data Load
        window.Reports.fetchData();
    },

    loadDropdowns: async () => {
        try {
            // Fetch Services
            const srvRes = await window.api.get('/services?per_page=1000');
            const srvSelect = document.getElementById('reportServiceSelect');
            if (srvRes.success) {
                const services = srvRes.data?.data || srvRes.data || [];
                services.forEach(s => {
                    const opt = document.createElement('option');
                    opt.value = s.id;
                    opt.textContent = s.service_number;
                    srvSelect.appendChild(opt);
                });
            }

            // Fetch customers
            const custRes = await window.api.get('/customers?per_page=1000');
            const custSelect = document.getElementById('reportCustomerSelect');
            if (custRes.success) {
                window.Reports.customers = custRes.data?.data || custRes.data || [];
                window.Reports.customers.forEach(c => {
                    const opt = document.createElement('option');
                    opt.value = c.id;
                    opt.textContent = c.full_name + (c.mobile ? ` (${c.mobile})` : '');
                    custSelect.appendChild(opt);
                });
            }

            // Fetch AC Units
            const acRes = await window.api.get('/ac-units?per_page=1000');
            const acSelect = document.getElementById('reportAcSelect');
            if (acRes.success) {
                window.Reports.acUnits = acRes.data?.data || acRes.data || [];
                window.Reports.acUnits.forEach(ac => {
                    const opt = document.createElement('option');
                    opt.value = ac.id;
                    opt.textContent = ac.ac_code + (ac.customer ? ` - ${ac.customer.full_name}` : '');
                    acSelect.appendChild(opt);
                });
            }

            // Initialize Choices.js
            if (window.Choices) {
                if (window.reportServiceChoices) window.reportServiceChoices.destroy();
                window.reportServiceChoices = new Choices(srvSelect, {
                    searchEnabled: true,
                    itemSelectText: '',
                    shouldSort: false
                });

                if (window.reportCustomerChoices) window.reportCustomerChoices.destroy();
                window.reportCustomerChoices = new Choices(custSelect, {
                    searchEnabled: true,
                    itemSelectText: '',
                    shouldSort: false
                });

                if (window.reportAcChoices) window.reportAcChoices.destroy();
                window.reportAcChoices = new Choices(acSelect, {
                    searchEnabled: true,
                    itemSelectText: '',
                    shouldSort: false
                });

                // Ensure the change event triggers applyFilters
                srvSelect.addEventListener('change', () => { window.Reports.applyFilters(); }, { once: false });
                custSelect.addEventListener('change', () => { window.Reports.applyFilters(); }, { once: false });
                acSelect.addEventListener('change', () => { window.Reports.applyFilters(); }, { once: false });
            }
        } catch (e) {
            console.error("Failed to load filter dropdowns", e);
        }
    },

    handleDateRangeChange: () => {
        const val = document.getElementById('reportDateRange').value;
        const startWrap = document.getElementById('customStartWrapper');
        const endWrap = document.getElementById('customEndWrapper');
        const startInput = document.getElementById('reportStartDate');
        const endInput = document.getElementById('reportEndDate');
        
        if (val === 'custom') {
            startWrap.style.display = 'block';
            endWrap.style.display = 'block';
        } else {
            startWrap.style.display = 'none';
            endWrap.style.display = 'none';
            startInput.value = '';
            endInput.value = '';
        }
        window.Reports.applyFilters();
    },

    applyFilters: () => {
        window.Reports.state.serviceId = document.getElementById('reportServiceSelect').value;
        window.Reports.state.customerId = document.getElementById('reportCustomerSelect').value;
        window.Reports.state.acUnitId = document.getElementById('reportAcSelect').value;
        window.Reports.state.dateRange = document.getElementById('reportDateRange').value;
        window.Reports.state.startDate = document.getElementById('reportStartDate').value;
        window.Reports.state.endDate = document.getElementById('reportEndDate').value;
        window.Reports.state.perPage = document.getElementById('reportPerPage').value;
        window.Reports.state.page = 1; // Reset to page 1 on filter
        window.Reports.fetchData();
    },

    downloadExport: async (format) => {
        const token = localStorage.getItem('auth_token');
        if (!token) return;

        let url = `/api/reports/export?format=${format}`;
        if (window.Reports.state.serviceId) url += `&service_id=${window.Reports.state.serviceId}`;
        if (window.Reports.state.customerId) url += `&customer_id=${window.Reports.state.customerId}`;
        if (window.Reports.state.acUnitId) url += `&ac_unit_id=${window.Reports.state.acUnitId}`;
        if (window.Reports.state.dateRange) url += `&date_range=${window.Reports.state.dateRange}`;
        if (window.Reports.state.startDate) url += `&start_date=${window.Reports.state.startDate}`;
        if (window.Reports.state.endDate) url += `&end_date=${window.Reports.state.endDate}`;

        try {
            window.showToast(`Generating ${format.toUpperCase()}...`, 'success');
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json'
                }
            });

            if (!response.ok) throw new Error('Failed to export');

            const blob = await response.blob();
            const downloadUrl = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = downloadUrl;
            a.download = `Service_Income_Report.${format}`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(downloadUrl);
            a.remove();
        } catch (error) {
            console.error('Export Error:', error);
            window.showToast('Failed to export report.', 'error');
        }
    },

    exportExcel: () => {
        window.Reports.downloadExport('csv');
    },

    exportPDF: () => {
        window.Reports.downloadExport('pdf');
    },

    goToPage: (page) => {
        window.Reports.state.page = page;
        window.Reports.fetchData();
    },

    fetchData: async () => {
        // Show loading in table
        document.getElementById('reportsTableBody').innerHTML = '<tr><td colspan="6" style="padding: 32px; text-align: center; color: #94a3b8;"><i class="fa-solid fa-circle-notch fa-spin"></i> Fetching records...</td></tr>';
        
        let url = `/reports/income?page=${window.Reports.state.page}&per_page=${window.Reports.state.perPage}`;
        if (window.Reports.state.serviceId) url += `&service_id=${window.Reports.state.serviceId}`;
        if (window.Reports.state.customerId) url += `&customer_id=${window.Reports.state.customerId}`;
        if (window.Reports.state.acUnitId) url += `&ac_unit_id=${window.Reports.state.acUnitId}`;
        if (window.Reports.state.dateRange) url += `&date_range=${window.Reports.state.dateRange}`;
        if (window.Reports.state.dateRange === 'custom') {
            if (window.Reports.state.startDate) url += `&start_date=${window.Reports.state.startDate}`;
            if (window.Reports.state.endDate) url += `&end_date=${window.Reports.state.endDate}`;
        }

        try {
            const res = await window.api.get(url);
            if (res.success) {
                const data = res.data;
                window.Reports.updateMetrics(data.summary);
                window.Reports.updateTable(data.table);
            }
        } catch (e) {
            console.error(e);
            document.getElementById('reportsTableBody').innerHTML = '<tr><td colspan="6" style="padding: 32px; text-align: center; color: red;">Error loading data.</td></tr>';
        }
    },

    updateMetrics: (summary) => {
        document.getElementById('metricTotalBilled').textContent = `₹${parseFloat(summary.total_billed || 0).toFixed(2)}`;
        document.getElementById('metricTotalReceived').textContent = `₹${parseFloat(summary.total_paid || 0).toFixed(2)}`;
        document.getElementById('metricTotalPending').textContent = `₹${parseFloat(summary.total_pending || 0).toFixed(2)}`;
    },



    updateTable: (tableData) => {
        const tbody = document.getElementById('reportsTableBody');
        const getStatusBadge = (status) => {
            if (status === 'completed') return `<span style="padding: 4px 10px; border-radius: 6px; font-size: 11px; font-weight: 700; background: rgba(16,185,129,0.1); color: #10B981;">COMPLETED</span>`;
            if (status === 'in_progress') return `<span style="padding: 4px 10px; border-radius: 6px; font-size: 11px; font-weight: 700; background: rgba(59,130,246,0.1); color: #3b82f6;">IN PROGRESS</span>`;
            return `<span style="padding: 4px 10px; border-radius: 6px; font-size: 11px; font-weight: 700; background: rgba(245,158,11,0.1); color: #f59e0b;">PENDING</span>`;
        };

        if (!tableData.data || tableData.data.length === 0) {
            tbody.innerHTML = '<tr><td colspan="6" style="padding: 32px; text-align: center; color: #94a3b8;">No records found for the selected filters.</td></tr>';
        } else {
            tbody.innerHTML = tableData.data.map(s => `
                <tr style="border-bottom: 1px solid #f1f5f9; background: #ffffff;">
                    <td style="padding: 16px; font-size: 13px; font-weight: 600; color: #0f172a;">${s.service_number || ('#' + s.id)}</td>
                    <td style="padding: 16px; font-size: 13px; color: #475569;">${s.customer ? s.customer.full_name : '—'}</td>
                    <td class="hide-on-mobile" style="padding: 16px; font-size: 13px; color: #475569;">${s.ac_unit ? s.ac_unit.ac_code : '—'}</td>
                    <td class="hide-on-mobile" style="padding: 16px; font-size: 13px; color: #475569;">${s.service_date ? new Date(s.service_date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : '—'}</td>
                    <td class="hide-on-mobile" style="padding: 16px; font-size: 13px; font-weight: 700; color: #0f172a; text-align: right;">₹${parseFloat(s.total_amount || 0).toFixed(2)}</td>
                    <td class="hide-on-mobile" style="padding: 16px; text-align: center;">${getStatusBadge(s.status)}</td>
                    <td style="padding: 16px; text-align: right;">
                        <button class="mobile-expand-btn" data-id="${s.id}"><i class="fa-solid fa-plus"></i></button>
                        <div class="desktop-only" style="display: flex; gap: 8px; justify-content: flex-end;">
                            <button onclick="window.router.navigate('/services/view/${s.id}')" style="background: #3b82f6; border: none; color: white; border-radius: 4px; padding: 6px 10px; cursor: pointer; transition: 0.2s;" title="View Details"><i class="fa-solid fa-eye"></i> View</button>
                        </div>
                    </td>
                </tr>
                <tr id="mobile-expand-${s.id}" class="mobile-expanded-row">
                    <td colspan="7" style="padding: 16px; background: #f8fafc; border-bottom: 1px solid var(--border-glass);">
                        <div style="background: #ffffff; border-radius: 12px; border-left: 4px solid #0f172a; padding: 16px; box-shadow: 0 4px 6px rgba(0,0,0,0.02);">
                            <div style="display: flex; justify-content: space-between; margin-bottom: 12px; font-size: 12px; font-weight: 700; color: #0f172a;">
                                <div><i class="fa-solid fa-user" style="margin-right: 8px;"></i> CUSTOMER :</div>
                                <div style="font-weight: 400; text-align: right; max-width: 60%; color: #64748b;">${s.customer ? s.customer.full_name : '—'}</div>
                            </div>
                            <div style="display: flex; justify-content: space-between; margin-bottom: 12px; font-size: 12px; font-weight: 700; color: #0f172a;">
                                <div><i class="fa-solid fa-snowflake" style="margin-right: 8px;"></i> AC UNIT :</div>
                                <div style="font-weight: 400; text-align: right; max-width: 60%; color: #64748b;">${s.ac_unit ? s.ac_unit.ac_code : '—'}</div>
                            </div>
                            <div style="display: flex; justify-content: space-between; margin-bottom: 12px; font-size: 12px; font-weight: 700; color: #0f172a;">
                                <div><i class="fa-solid fa-calendar" style="margin-right: 8px;"></i> DATE :</div>
                                <div style="font-weight: 400; text-align: right; max-width: 60%; color: #64748b;">${s.service_date ? new Date(s.service_date).toLocaleDateString('en-GB') : '—'}</div>
                            </div>
                            <div style="display: flex; justify-content: space-between; margin-bottom: 12px; font-size: 12px; font-weight: 700; color: #0f172a;">
                                <div><i class="fa-solid fa-indian-rupee-sign" style="margin-right: 8px;"></i> TOTAL BILLED :</div>
                                <div style="font-weight: 700; text-align: right; max-width: 60%; color: #0f172a;">₹${parseFloat(s.total_amount || 0).toFixed(2)}</div>
                            </div>
                            <div style="display: flex; justify-content: space-between; margin-bottom: 12px; font-size: 12px; font-weight: 700; color: #0f172a;">
                                <div><i class="fa-solid fa-circle-check" style="margin-right: 8px;"></i> STATUS :</div>
                                <div style="font-weight: 400; text-align: right; max-width: 60%;">${getStatusBadge(s.status)}</div>
                            </div>
                            
                            <hr style="border: 0; border-top: 1px solid #e2e8f0; margin-bottom: 16px;">
                            
                            <div style="display: flex; flex-wrap: wrap; gap: 8px; justify-content: flex-start; align-items: center;">
                                <button onclick="window.router.navigate('/services/view/${s.id}')" style="background: #3b82f6; border: none; color: white; border-radius: 6px; padding: 6px 12px; cursor: pointer; font-size: 12px; font-weight: 600;"><i class="fa-solid fa-eye" style="margin-right: 4px;"></i> View Details</button>
                            </div>
                        </div>
                    </td>
                </tr>
            `).join('');
            
            // Attach mobile expand events
            document.querySelectorAll('#reportsTableBody .mobile-expand-btn').forEach(btn => {
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
        }

        // Build Pagination
        const pagContainer = document.getElementById('reportsPagination');
        const meta = tableData.meta;
        
        let pagHtml = ``;
        
        pagHtml += `<div style="display: flex; flex-wrap: wrap; gap: 8px;">`;
        
        // Previous Button
        if (meta.current_page > 1) {
            pagHtml += `<button class="page-btn" onclick="window.Reports.goToPage(${meta.current_page - 1})" style="padding: 6px 12px; border-radius: 6px; border: 1px solid #e2e8f0; background: transparent; color: #475569; cursor: pointer; font-size: 14px; font-family: inherit;">Previous</button>`;
        } else {
            pagHtml += `<button class="page-btn" disabled style="padding: 6px 12px; border-radius: 6px; border: 1px solid #e2e8f0; background: transparent; color: #cbd5e1; cursor: not-allowed; font-size: 14px; font-family: inherit;">Previous</button>`;
        }

        // Page Numbers
        let startPage = Math.max(1, meta.current_page - 2);
        let endPage = Math.min(meta.last_page, startPage + 4);
        
        if (endPage - startPage < 4 && startPage > 1) {
            startPage = Math.max(1, endPage - 4);
        }

        for (let i = startPage; i <= endPage; i++) {
            if (i === meta.current_page) {
                pagHtml += `<button class="page-btn" style="padding: 6px 14px; border: 1px solid #ff9f43; background: #ff9f43; border-radius: 6px; font-size: 14px; color: white; cursor: default; font-family: inherit;">${i}</button>`;
            } else {
                pagHtml += `<button class="page-btn" onclick="window.Reports.goToPage(${i})" style="padding: 6px 14px; border: 1px solid #e2e8f0; background: transparent; border-radius: 6px; cursor: pointer; font-size: 14px; color: #475569; font-family: inherit;">${i}</button>`;
            }
        }

        if (endPage < meta.last_page) {
            if (endPage < meta.last_page - 1) {
                pagHtml += `<span style="padding: 6px 4px; font-size: 14px; color: #64748b;">...</span>`;
            }
            pagHtml += `<button class="page-btn" onclick="window.Reports.goToPage(${meta.last_page})" style="padding: 6px 14px; border: 1px solid #e2e8f0; background: transparent; border-radius: 6px; cursor: pointer; font-size: 14px; color: #475569; font-family: inherit;">${meta.last_page}</button>`;
        }

        // Next Button
        if (meta.current_page < meta.last_page) {
            pagHtml += `<button class="page-btn" onclick="window.Reports.goToPage(${meta.current_page + 1})" style="padding: 6px 12px; border-radius: 6px; border: 1px solid #e2e8f0; background: transparent; color: #475569; cursor: pointer; font-size: 14px; font-family: inherit;">Next</button>`;
        } else {
            pagHtml += `<button class="page-btn" disabled style="padding: 6px 12px; border-radius: 6px; border: 1px solid #e2e8f0; background: transparent; color: #cbd5e1; cursor: not-allowed; font-size: 14px; font-family: inherit;">Next</button>`;
        }
        
        pagHtml += `</div>`;

        pagContainer.innerHTML = `<div style="display: flex; flex-wrap: wrap; gap: 16px; justify-content: space-between; align-items: center; width: 100%; border-top: 1px solid #e2e8f0; padding-top: 16px;">
            <div style="font-size: 13px; color: #64748b; font-weight: 500;">Showing ${tableData.data?.length > 0 ? (meta.current_page - 1) * meta.per_page + 1 : 0} to ${Math.min(meta.current_page * meta.per_page, meta.total)} of ${meta.total} results</div>
            ${pagHtml}
        </div>`;
    }
};
