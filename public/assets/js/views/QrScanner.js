window.QrScanner = {
    render: async (container) => {
        const content = `
            <style>
                /* Minimal overrides for html5-qrcode UI */
                #reader { border: none !important; background: transparent !important; }
                #reader__header_message { display: none !important; }

                /* Swap link (Camera <-> File) */
                #reader__dashboard_section_swaplink {
                    display: inline-block !important;
                    margin: 12px 0;
                    color: #3b82f6;
                    text-decoration: underline;
                    cursor: pointer;
                }

                /* Camera select dropdown styling */
                #reader select {
                    padding: 8px 12px;
                    border-radius: 8px;
                    border: 1px solid #e2e8f0;
                    margin-bottom: 12px;
                    font-size: 13px;
                    color: #475569;
                    background: white;
                    outline: none;
                }
                #reader select:disabled {
                    background: #f1f5f9;
                    cursor: not-allowed;
                    opacity: 0.7;
                }
                /* Override the library button */
                #reader button {
                    background: transparent !important;
                    border: 1.5px solid #3b82f6 !important;
                    color: #3b82f6 !important;
                    padding: 10px 20px !important;
                    border-radius: 8px !important;
                    font-weight: 600 !important;
                    cursor: pointer !important;
                    font-family: inherit !important;
                    font-size: 14px !important;
                    display: inline-flex !important;
                    align-items: center !important;
                    justify-content: center !important;
                    gap: 8px !important;
                    margin: 4px !important;
                }
                #reader button::before {
                    content: "\\f093";
                    font-family: "Font Awesome 6 Free";
                    font-weight: 900;
                }
                #reader a { display: none !important; }
                #reader__dashboard { padding: 0 !important; }
                #reader__dashboard_section { padding: 0 !important; }
                #reader__scan_region {
                    background: transparent !important;
                    border: none !important;
                    border-radius: 12px !important;
                    overflow: hidden !important;
                }
                #reader__scan_region img { display: none !important; }

                /* ── Scanner frame corners ── */
                .scanner-frame {
                    position: relative;
                    border-radius: 16px;
                    background: #f8fafc;
                    padding: 32px;
                    min-height: 300px;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    margin-bottom: 24px;
                    overflow: hidden;
                }
                .scanner-frame::before,
                .scanner-frame::after,
                .scanner-frame .corner-br,
                .scanner-frame .corner-bl {
                    content: '';
                    position: absolute;
                    width: 32px;
                    height: 32px;
                    border-color: #ff9f43;
                    border-style: solid;
                }
                .scanner-frame::before { top: 16px; left: 16px; border-width: 3px 0 0 3px; border-radius: 4px 0 0 0; }
                .scanner-frame::after  { top: 16px; right: 16px; border-width: 3px 3px 0 0; border-radius: 0 4px 0 0; }
                .scanner-frame .corner-br { bottom: 16px; right: 16px; border-width: 0 3px 3px 0; border-radius: 0 0 4px 0; }
                .scanner-frame .corner-bl { bottom: 16px; left: 16px; border-width: 0 0 3px 3px; border-radius: 0 0 0 4px; }

                .scanner-idle-icon {
                    width: 64px; height: 64px;
                    border-radius: 50%;
                    background: rgba(255, 159, 67, 0.1);
                    display: flex; align-items: center; justify-content: center;
                    font-size: 28px;
                    color: #ff9f43;
                    margin: 0 auto 16px auto;
                }
                .scanner-or-divider {
                    display: flex; align-items: center; gap: 12px;
                    color: #94a3b8; font-size: 13px; margin: 16px 0;
                    width: 100%; max-width: 300px;
                }
                .scanner-or-divider::before,
                .scanner-or-divider::after {
                    content: ''; flex: 1;
                    border-top: 1px solid #e2e8f0;
                }

                /* Service history table */
                .history-table th { font-size: 11px; text-transform: uppercase; color: #94a3b8; font-weight: 700; padding: 10px 16px; text-align: left; background: #f8fafc; }
                .history-table td { padding: 14px 16px; font-size: 13px; border-bottom: 1px solid #f1f5f9; vertical-align: middle; }
                .history-table tr:last-child td { border-bottom: none; }
                .history-table tr:hover td { background: #fafafa; }
            </style>

            <div>
                <!-- Header -->
                <div style="display: flex; align-items: center; gap: 16px; margin-bottom: 15px;">
                    <div style="width: 40px; height: 40px; border-radius: 12px; background: rgba(255, 159, 67, 0.1); display: flex; align-items: center; justify-content: center; font-size: 22px; color: #ff9f43; flex-shrink: 0;">
                        <i class="fa-solid fa-qrcode"></i>
                    </div>
                    <div>
                        <h1 style="font-size: 22px; font-weight: 800; color: #0f172a; margin-bottom: 2px;">Scanner Mode</h1>
                    </div>
                </div>

                <div style="margin: 0 auto;">
                    <!-- Scanner card -->
                    <div id="scannerCard" class="glass-panel" style="padding: 0; border-radius: 16px; overflow: hidden; margin-bottom: 24px;">
                        <div class="scanner-frame" id="scannerIdleState">
                            <div class="corner-br"></div>
                            <div class="corner-bl"></div>
                            <!-- Idle state shown when no camera active -->
                            <div id="readerIdleOverlay">
                                <div style="text-align: center;">
                                    <div class="scanner-idle-icon"><i class="fa-solid fa-qrcode"></i></div>
                                    <div style="font-size: 18px; font-weight: 700; color: #0f172a; margin-bottom: 6px;">Ready to Scan</div>
                                    <div style="font-size: 13px; color: #64748b; margin-bottom: 4px;">Follow the prompts below</div>
                                </div>
                            </div>
                            <div id="reader" style="width: 100%; max-width: 360px;"></div>
                        </div>
                    </div>

                    <!-- Scan result -->
                    <div id="scanResult"></div>
                </div>
            </div>
        `;

        container.innerHTML = window.renderLayout(content);

        if (typeof Html5QrcodeScanner === 'undefined') {
            document.getElementById('reader').innerHTML = '<p style="color: red; text-align: center;">Scanner library not loaded.</p>';
            return;
        }

        const getStatusBadge = (status) => {
            const map = {
                'completed': { bg: 'rgba(16,185,129,0.12)', color: '#10B981' },
                'in_progress': { bg: 'rgba(59,130,246,0.12)', color: '#3b82f6' },
                'pending': { bg: 'rgba(245,158,11,0.12)', color: '#f59e0b' },
            };
            const s = map[status] || { bg: 'rgba(148,163,184,0.12)', color: '#94a3b8' };
            return `<span style="padding: 4px 10px; border-radius: 6px; font-size: 11px; font-weight: 700; background: ${s.bg}; color: ${s.color}; letter-spacing: 0.5px;">${(status || 'PENDING').toUpperCase()}</span>`;
        };

        const onScanSuccess = async (decodedText) => {
            scanner.clear();
            // Hide the scanner frame completely after scan
            const scannerCard = document.getElementById('scannerCard');
            if (scannerCard) scannerCard.style.display = 'none';

            const resultDiv = document.getElementById('scanResult');
            resultDiv.innerHTML = `
                <div style="text-align: center; padding: 32px; color: #64748b;">
                    <i class="fa-solid fa-circle-notch fa-spin" style="font-size: 28px; color: #ff9f43; margin-bottom: 12px; display: block;"></i>
                    Looking up AC Unit...
                </div>`;

            const response = await window.api.get(`/qr/${decodedText}`);

            if (response.success) {
                const ac = response.data.ac;
                const services = ac.service_records || [];

                const serviceRows = services.length
                    ? services.map(s => `
                        <tr>
                            <td style="font-weight: 700; color: #ff9f43; cursor: pointer;" onclick="window.router.navigate('/services/view/${s.id}')">${s.service_number || '#' + s.id}</td>
                            <td style="color: #ff9f43; cursor: pointer;" onclick="window.router.navigate('/services/view/${s.id}')"><i class="fa-regular fa-calendar" style="margin-right: 6px; color: #94a3b8;"></i>${s.service_date ? new Date(s.service_date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : '—'}</td>
                            <td class="hide-on-mobile" style="color: #64748b;">${s.service_type || '—'}</td>
                            <td class="hide-on-mobile">${getStatusBadge(s.status)}</td>
                            <td style="text-align: right;">
                                <button class="mobile-expand-btn hide-on-desktop" data-id="qr-srv-${s.id}" style="background: transparent; border: none; color: #ff9f43; font-size: 16px; cursor: pointer;"><i class="fa-solid fa-plus"></i></button>
                                <div class="hide-on-mobile">
                                    <button onclick="window.router.navigate('/services/view/${s.id}')" style="background: transparent; border: none; color: #ff9f43; cursor: pointer; font-size: 18px;" title="View"><i class="fa-solid fa-eye"></i></button>
                                </div>
                            </td>
                        </tr>
                        <tr id="mobile-expand-qr-srv-${s.id}" class="mobile-expanded-row">
                            <td colspan="5" style="padding: 16px; background: #f8fafc; border-bottom: 1px solid var(--border-glass);">
                                <div style="background: #ffffff; border-radius: 12px; border-left: 4px solid #0f172a; padding: 16px; box-shadow: 0 4px 6px rgba(0,0,0,0.02);">
                                    <div style="display: flex; justify-content: space-between; margin-bottom: 12px; font-size: 12px; font-weight: 700; color: #0f172a;">
                                        <div><i class="fa-solid fa-circle-check" style="margin-right: 8px;"></i> STATUS :</div>
                                        <div style="font-weight: 400; text-align: right; max-width: 60%;">${getStatusBadge(s.status)}</div>
                                    </div>
                                    <div style="display: flex; justify-content: space-between; margin-bottom: 12px; font-size: 12px; font-weight: 700; color: #0f172a;">
                                        <div><i class="fa-solid fa-wrench" style="margin-right: 8px;"></i> TYPE :</div>
                                        <div style="font-weight: 400; color: #64748b; text-align: right; max-width: 60%;">${s.service_type || '—'}</div>
                                    </div>
                                    <div style="display: flex; flex-wrap: wrap; gap: 8px; justify-content: flex-start; align-items: center; margin-top: 16px; border-top: 1px solid #e2e8f0; padding-top: 16px;">
                                        <button onclick="window.router.navigate('/services/view/${s.id}')" style="background: #ff9f43; border: none; color: white; border-radius: 6px; padding: 6px 12px; cursor: pointer; font-size: 12px; font-weight: 600;"><i class="fa-solid fa-eye" style="margin-right: 4px;"></i> View Details</button>
                                    </div>
                                </div>
                            </td>
                        </tr>
                    `).join('')
                    : `<tr><td colspan="5" style="padding: 24px; text-align: center; color: #94a3b8; font-size: 13px;">No service records found for this unit.</td></tr>`;

                resultDiv.innerHTML = `
                    <!-- Scan Again button -->
                    <div style="margin-bottom: 16px; text-align: right;">
                        <button onclick="window.router.navigate('/scanner')" style="padding: 8px 18px; background: transparent; color: #64748b; border: 1px solid #e2e8f0; border-radius: 8px; font-weight: 600; cursor: pointer; font-size: 13px; display: inline-flex; align-items: center; gap: 8px;">
                            <i class="fa-solid fa-rotate-right"></i> Scan Again
                        </button>
                    </div>

                    <!-- AC Found Card -->
                    <div style="background: rgba(16,185,129,0.07); border: 1.5px solid #10B981; padding: 24px; border-radius: 16px; margin-bottom: 20px;">
                        <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 20px;">
                            <div style="width: 38px; height: 38px; border-radius: 50%; background: #10B981; display: flex; align-items: center; justify-content: center; flex-shrink: 0; box-shadow: 0 4px 12px rgba(16,185,129,0.3);">
                                <i class="fa-solid fa-check" style="color: white; font-size: 15px;"></i>
                            </div>
                            <div>
                                <div style="font-size: 16px; font-weight: 800; color: #0f172a;">AC Unit Found!</div>
                                <div style="font-size: 12px; color: #64748b;">QR Code matched successfully</div>
                            </div>
                        </div>

                        <!-- AC Info Inner Card -->
                        <div style="background: white; border-radius: 12px; padding: 16px 20px; margin-bottom: 16px; border: 1px solid #e2e8f0; display: flex; align-items: center; justify-content: space-between; gap: 16px;">
                            <div style="display: flex; align-items: center; gap: 14px;">
                                <div style="width: 48px; height: 48px; border-radius: 10px; background: #f1f5f9; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
                                    <i class="fa-solid fa-wind" style="font-size: 20px; color: #94a3b8;"></i>
                                </div>
                                <div>
                                    <div style="font-size: 20px; font-weight: 800; color: #0f172a; margin-bottom: 3px;">${ac.ac_code}</div>
                                    <div style="font-size: 13px; color: #64748b;">${ac.brand || ''} ${ac.model || ''}${ac.ac_type ? ' • ' + ac.ac_type : ''}</div>
                                    ${ac.customer ? `<div style="font-size: 13px; color: #64748b; margin-top: 3px;"><i class="fa-solid fa-user" style="margin-right: 5px; color: #94a3b8;"></i>${ac.customer.full_name}</div>` : ''}
                                </div>
                            </div>
                            <div style="flex-shrink: 0; opacity: 0.15; font-size: 52px; color: #10B981;">
                                <i class="fa-solid fa-fan"></i>
                            </div>
                        </div>

                        <!-- Action Buttons -->
                        <div style="display: flex; gap: 12px;">
                            <button onclick="window.router.navigate('/ac-units/view/${ac.id}')" style="flex: 1; padding: 13px; background: #0f172a; color: white; border: none; border-radius: 10px; font-weight: 700; cursor: pointer; font-size: 14px; display: flex; align-items: center; justify-content: center; gap: 8px; transition: background 0.2s;" onmouseover="this.style.background='#1e293b'" onmouseout="this.style.background='#0f172a'">
                                <i class="fa-solid fa-eye"></i> View AC Unit
                            </button>
                            <button onclick="window.router.navigate('/services/add?ac_id=${ac.id}')" style="flex: 1; padding: 13px; background: #10B981; color: white; border: none; border-radius: 10px; font-weight: 700; cursor: pointer; font-size: 14px; display: flex; align-items: center; justify-content: center; gap: 8px; transition: background 0.2s;" onmouseover="this.style.background='#059669'" onmouseout="this.style.background='#10B981'">
                                <i class="fa-solid fa-plus"></i> New Service
                            </button>
                        </div>
                    </div>

                    <!-- Service History -->
                    <div class="glass-panel" style="border-radius: 16px; padding: 0; overflow: hidden;">
                        <div style="padding: 18px 20px; display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #f1f5f9;">
                            <div style="font-size: 15px; font-weight: 700; color: #0f172a; display: flex; align-items: center; gap: 8px;">
                                <i class="fa-regular fa-clock" style="color: #64748b;"></i> Service History
                            </div>
                            <span style="font-size: 12px; color: #94a3b8; font-weight: 600;">${services.length} record${services.length !== 1 ? 's' : ''}</span>
                        </div>
                        <div style="overflow-x: auto;">
                            <table class="history-table" style="width: 100%; border-collapse: collapse;">
                                <thead>
                                    <tr>
                                        <th>Service #</th>
                                        <th>Date</th>
                                        <th class="hide-on-mobile">Type</th>
                                        <th class="hide-on-mobile">Status</th>
                                        <th></th>
                                    </tr>
                                </thead>
                                <tbody>${serviceRows}</tbody>
                            </table>
                        </div>
                    </div>
                `;
                
                // Add accordion toggle logic after rendering
                setTimeout(() => {
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
                }, 0);
            } else {
                resultDiv.innerHTML = `
                    <div style="background: rgba(244,63,94,0.07); border: 1.5px solid #F43F5E; padding: 28px; border-radius: 16px; text-align: center;">
                        <i class="fa-solid fa-circle-xmark" style="font-size: 36px; color: #F43F5E; margin-bottom: 12px; display: block;"></i>
                        <div style="font-size: 16px; font-weight: 700; color: #F43F5E; margin-bottom: 4px;">Invalid QR Code</div>
                        <div style="font-size: 13px; color: #94a3b8; margin-bottom: 20px;">This QR code does not match any registered AC unit.</div>
                        <button onclick="window.router.navigate('/scanner')" style="padding: 10px 24px; background: #0f172a; color: white; border: none; border-radius: 8px; font-weight: 600; cursor: pointer; font-size: 14px;"><i class="fa-solid fa-rotate-right" style="margin-right: 8px;"></i>Scan Again</button>
                    </div>
                `;
            }
        };

        const scanner = new Html5QrcodeScanner("reader", {
            fps: 10,
            qrbox: { width: 220, height: 220 },
            rememberLastUsedCamera: true,
            videoConstraints: {
                facingMode: "environment"
            }
        }, false);
        scanner.render(onScanSuccess);
    }
};
