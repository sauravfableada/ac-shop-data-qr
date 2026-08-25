window.AcUnitView = {
    render: async (container) => {
        const urlSegments = window.location.pathname.split('/');
        const acId = urlSegments[urlSegments.length - 1];

        // Fetch AC details
        let ac = null;
        try {
            const res = await window.api.get(`/ac-units/${acId}`);
            if (res.success) {
                ac = res.data;
            } else {
                container.innerHTML = window.renderLayout(`<div class="glass-panel" style="padding: 24px;">Failed to load AC Unit details.</div>`);
                return;
            }
        } catch (e) {
            container.innerHTML = window.renderLayout(`<div class="glass-panel" style="padding: 24px;">Error loading data.</div>`);
            return;
        }

        // Fetch Service History (Maintenance)
        let historyHtml = `<tr><td colspan="7" style="padding: 16px; text-align: center; color: #64748b;">No maintenance history found for this AC.</td></tr>`;
        try {
            const histRes = await window.api.get(`/ac-units/${acId}/service-history`);
            if (histRes.success && histRes.data.length > 0) {
                historyHtml = histRes.data.map(record => `
                    <tr style="border-bottom: 1px solid var(--border-glass);">
                        <td style="padding: 16px; font-weight: 500; cursor: pointer; color: #3b82f6;" onclick="window.router.navigate('/services/view/${record.id}')">${new Date(record.service_date).toLocaleDateString()}</td>
                        <td class="hide-on-mobile" style="padding: 16px;">${record.service_type || 'Regular Maintenance'}</td>
                        <td class="hide-on-mobile" style="padding: 16px;">${record.creator ? record.creator.name : '--'}</td>
                        <td class="hide-on-mobile" style="padding: 16px;">${record.complaint || '-'}</td>
                        <td class="hide-on-mobile" style="padding: 16px; font-weight: 600; color: #0f172a;">₹${record.total_amount || '0.00'}</td>
                        <td class="hide-on-mobile" style="padding: 16px; cursor: pointer;" onclick="window.router.navigate('/services/view/${record.id}')">
                            <span style="padding: 4px 8px; border-radius: 4px; font-size: 12px; font-weight: 600; background: ${record.status === 'completed' ? 'rgba(16,185,129,0.1)' : 'rgba(244,63,94,0.1)'}; color: ${record.status === 'completed' ? '#10B981' : '#F43F5E'};">${(record.status || 'pending').toUpperCase()}</span>
                        </td>
                        <td style="padding: 16px; text-align: right;">
                            <button class="mobile-expand-btn" data-id="${record.id}"><i class="fa-solid fa-plus"></i></button>
                            <div class="desktop-only" style="display: flex; gap: 8px; justify-content: flex-end;">
                                <button onclick="event.stopPropagation(); window.router.navigate('/services/view/${record.id}')" style="background: #3b82f6; border: none; color: white; border-radius: 4px; padding: 6px 10px; cursor: pointer; transition: 0.2s;" title="View Details"><i class="fa-solid fa-eye"></i> View</button>
                            </div>
                        </td>
                    </tr>
                    <tr id="mobile-expand-${record.id}" class="mobile-expanded-row">
                        <td colspan="7" style="padding: 16px; background: #f8fafc; border-bottom: 1px solid var(--border-glass);">
                            <div style="background: #ffffff; border-radius: 12px; border-left: 4px solid #0f172a; padding: 16px; box-shadow: 0 4px 6px rgba(0,0,0,0.02);">
                                <div style="display: flex; justify-content: space-between; margin-bottom: 12px; font-size: 12px; font-weight: 700; color: #0f172a;">
                                    <div><i class="fa-solid fa-circle-check" style="margin-right: 8px;"></i> STATUS :</div>
                                    <div style="font-weight: 400; text-align: right; max-width: 60%;">
                                        <span style="padding: 4px 8px; border-radius: 4px; font-size: 12px; font-weight: 600; background: ${record.status === 'completed' ? 'rgba(16,185,129,0.1)' : 'rgba(244,63,94,0.1)'}; color: ${record.status === 'completed' ? '#10B981' : '#F43F5E'};">${(record.status || 'pending').toUpperCase()}</span>
                                    </div>
                                </div>
                                <div style="display: flex; justify-content: space-between; margin-bottom: 12px; font-size: 12px; font-weight: 700; color: #0f172a;">
                                    <div><i class="fa-solid fa-wrench" style="margin-right: 8px;"></i> TYPE :</div>
                                    <div style="font-weight: 400; color: #64748b; text-align: right; max-width: 60%;">${record.service_type || 'Regular Maintenance'}</div>
                                </div>
                                <div style="display: flex; justify-content: space-between; margin-bottom: 12px; font-size: 12px; font-weight: 700; color: #0f172a;">
                                    <div><i class="fa-solid fa-user-plus" style="margin-right: 8px;"></i> CREATED BY :</div>
                                    <div style="font-weight: 400; color: #64748b; text-align: right; max-width: 60%;">${record.creator ? record.creator.name : '--'}</div>
                                </div>
                                <div style="display: flex; justify-content: space-between; margin-bottom: 12px; font-size: 12px; font-weight: 700; color: #0f172a;">
                                    <div><i class="fa-solid fa-comment-dots" style="margin-right: 8px;"></i> COMPLAINT :</div>
                                    <div style="font-weight: 400; color: #64748b; text-align: right; max-width: 60%;">${record.complaint || '-'}</div>
                                </div>
                                <div style="display: flex; justify-content: space-between; margin-bottom: 16px; font-size: 12px; font-weight: 700; color: #0f172a;">
                                    <div><i class="fa-solid fa-indian-rupee-sign" style="margin-right: 8px;"></i> AMOUNT :</div>
                                    <div style="font-weight: 600; color: #0f172a;">₹${record.total_amount || '0.00'}</div>
                                </div>
                                
                                <hr style="border: 0; border-top: 1px solid #e2e8f0; margin-bottom: 16px;">
                                
                                <div style="display: flex; flex-wrap: wrap; gap: 8px; justify-content: flex-start; align-items: center;">
                                    <button onclick="window.router.navigate('/services/view/${record.id}')" style="background: #3b82f6; border: none; color: white; border-radius: 6px; padding: 6px 12px; cursor: pointer; font-size: 12px; font-weight: 600;"><i class="fa-solid fa-eye" style="margin-right: 4px;"></i> View Details</button>
                                </div>
                            </div>
                        </td>
                    </tr>
                `).join('');
            }
        } catch (e) {
            console.error(e);
        }

        const content = `
            <div>
                <div class="table-header-row" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px;">
                    <div>
                        <h1 style="font-size: 24px; margin-bottom: 4px; color: #0f172a;">AC Unit Profile: ${ac.ac_code}</h1>
                        <p style="color: #64748b; font-size: 14px;">Customer: ${ac.customer ? ac.customer.full_name : 'Unknown'}</p>
                    </div>
                    <div style="display: flex; gap: 12px;">
                        <button onclick="window.history.back()" style="display: flex; align-items: center; gap: 8px; padding: 8px 16px; background: #ffffff; color: #0f172a; border: 1px solid #e2e8f0; border-radius: 8px; cursor: pointer; font-weight: 600; font-size: 14px;">
                            <i class="fa-solid fa-arrow-left"></i> <span class="hide-on-mobile">Back</span>
                        </button>
                        <button onclick="window.router.navigate('/ac-units/edit/${ac.id}')" style="display: flex; align-items: center; gap: 8px; padding: 8px 16px; background: #f59e0b; color: white; border: none; border-radius: 8px; cursor: pointer; font-weight: 600; font-size: 14px;">
                            <i class="fa-solid fa-pencil"></i> <span class="hide-on-mobile">Edit Unit</span>
                        </button>
                        <button onclick="window.router.navigate('/services/add?ac_id=${ac.id}')" class="btn" style="padding: 8px 16px; background: #16b981; color: white; border: none; border-radius: 8px; cursor: pointer; font-weight: 600; font-size: 14px;">
                            <i class="fa-solid fa-plus"></i> <span class="hide-on-mobile">Add Maintenance</span>
                        </button>
                    </div>
                </div>

                <!-- Specs Card -->
                <div class="responsive-grid glass-panel" style="background: #ffffff; padding: 32px; border-radius: 12px; margin-bottom: 24px; display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px;">
                    <div>
                        <p style="font-size: 12px; color: #64748b; text-transform: uppercase; font-weight: 600;">Brand & Model</p>
                        <p style="font-size: 16px; color: #0f172a; font-weight: 500; margin-top: 4px;">${ac.brand || '-'} ${ac.model || ''}</p>
                    </div>
                    <div>
                        <p style="font-size: 12px; color: #64748b; text-transform: uppercase; font-weight: 600;">AC Type & Capacity</p>
                        <p style="font-size: 16px; color: #0f172a; font-weight: 500; margin-top: 4px;">${ac.ac_type || '-'} - ${ac.capacity || '-'}</p>
                    </div>
                    <div>
                        <p style="font-size: 12px; color: #64748b; text-transform: uppercase; font-weight: 600;">Serial Number</p>
                        <p style="font-size: 16px; color: #0f172a; font-weight: 500; margin-top: 4px;">${ac.serial_number || '--'}</p>
                    </div>
                    <div>
                        <p style="font-size: 12px; color: #64748b; text-transform: uppercase; font-weight: 600;">Installation Date</p>
                        <p style="font-size: 16px; color: #0f172a; font-weight: 500; margin-top: 4px;">${ac.installation_date ? new Date(ac.installation_date).toLocaleDateString() : '--'}</p>
                    </div>
                    <div>
                        <p style="font-size: 12px; color: #64748b; text-transform: uppercase; font-weight: 600;">Location/Room</p>
                        <p style="font-size: 16px; color: #0f172a; font-weight: 500; margin-top: 4px;">${ac.room || '--'}</p>
                    </div>
                    <div>
                        <p style="font-size: 12px; color: #64748b; text-transform: uppercase; font-weight: 600;">Created By</p>
                        <p style="font-size: 16px; color: #0f172a; font-weight: 500; margin-top: 4px;">${ac.creator ? ac.creator.name : '--'}</p>
                    </div>
                    <div>
                        <div style="font-size: 12px; color: #64748b; font-weight: 600; text-transform: uppercase; margin-bottom: 8px;">QR Code</div>
                        ${ac.qr_code
                ? `<img src="https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=${ac.qr_code.token}" alt="QR Code" style="border-radius: 8px; border: 1px solid var(--border-glass); padding: 4px; background: white; margin-bottom: 8px;">
                               <div style="font-size: 11px; color: #64748b; word-break: break-all;">${ac.qr_code.token}</div>
                               <div style="display: flex; gap: 8px; margin-top: 12px;">
                                   <button onclick="window.AcUnitView.downloadQrImage(${ac.id})" title="Save QR" style="background: #8b5cf6; border: none; color: white; border-radius: 4px; padding: 6px 12px; cursor: pointer; transition: 0.2s;"><i class="fa-solid fa-download"></i> Save QR</button>
                                   <button onclick="window.AcUnitView.shareQrWhatsapp(${ac.id})" title="Share WhatsApp" style="background: #25D366; border: none; color: white; border-radius: 4px; padding: 6px 12px; cursor: pointer; transition: 0.2s;"><i class="fa-brands fa-whatsapp"></i> WhatsApp</button>
                               </div>`
                : `<div style="font-size: 14px; color: #64748b;">None generated</div>`}
                    </div>
                </div>

                <!-- Maintenance History Table -->
                <div class="glass-panel" style="padding: 24px; background: #ffffff;">
                    <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 24px;">
                        <h2 style="font-size: 18px; color: #0f172a; font-weight: 600;">Maintenance History</h2>
                    </div>
                    <div style="overflow-x: auto;">
                        <table style="width: 100%; border-collapse: collapse; text-align: left;">
                            <thead style="background: #f8fafc; border-bottom: 1px solid #e2e8f0; border-radius: 8px;">
                                <tr>
                                    <th style="padding: 12px 16px; font-weight: 600; font-size: 13px; color: #64748b; text-transform: uppercase;">Date</th>
                                    <th class="hide-on-mobile" style="padding: 12px 16px; font-weight: 600; font-size: 13px; color: #64748b; text-transform: uppercase;">Type</th>
                                    <th class="hide-on-mobile" style="padding: 12px 16px; font-weight: 600; font-size: 13px; color: #64748b; text-transform: uppercase;">Created By</th>
                                    <th class="hide-on-mobile" style="padding: 12px 16px; font-weight: 600; font-size: 13px; color: #64748b; text-transform: uppercase;">Complaint</th>
                                    <th class="hide-on-mobile" style="padding: 12px 16px; font-weight: 600; font-size: 13px; color: #64748b; text-transform: uppercase;">Amount</th>
                                    <th class="hide-on-mobile" style="padding: 12px 16px; font-weight: 600; font-size: 13px; color: #64748b; text-transform: uppercase;">Status</th>
                                    <th style="padding: 12px 16px; font-weight: 600; font-size: 13px; color: #64748b; text-transform: uppercase; text-align: right;">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${historyHtml}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        `;

        container.innerHTML = window.renderLayout(content);
        
        // Attach mobile expand events
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
    },

    downloadQrImage: async (id) => {
        try {
            const res = await window.api.get(`/ac-units/${id}`);
            if (!res.success) { window.showToast('Could not load AC Unit data', 'error'); return; }
            const ac = res.data;
            const token = ac.qr_code ? ac.qr_code.token : null;
            if (!token) { window.showToast('No QR code found', 'error'); return; }
            
            const qrImgUrl = `https://api.qrserver.com/v1/create-qr-code/?size=400x400&data=${token}`;
            
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
            img.crossOrigin = 'Anonymous';
            img.src = qrImgUrl;
            await new Promise((resolve, reject) => {
                img.onload = resolve;
                img.onerror = reject;
            });
            
            ctx.drawImage(img, 60, 40, 220, 220);
            
            ctx.textAlign = 'center';
            ctx.font = 'bold 22px "Segoe UI", sans-serif';
            ctx.fillStyle = '#0f172a';
            ctx.fillText(ac.ac_code, 170, 300);
            
            ctx.font = '14px "Segoe UI", sans-serif';
            ctx.fillStyle = '#64748b';
            ctx.fillText(ac.customer ? ac.customer.full_name : '', 170, 330);
            
            if (ac.brand) {
                ctx.fillText(`${ac.brand} ${ac.model || ''}`, 170, 355);
            }
            
            ctx.font = '10px "Segoe UI", sans-serif';
            ctx.fillStyle = '#94a3b8';
            ctx.fillText(token, 170, 400);
            
            const dataUrl = canvas.toDataURL('image/png');
            const a = document.createElement('a');
            a.style.display = 'none';
            a.href = dataUrl;
            a.download = `QR_Card_${ac.ac_code}.png`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
        } catch (err) {
            window.showToast('Error downloading QR', 'error');
        }
    },

    shareQrWhatsapp: async (id) => {
        try {
            const res = await window.api.get(`/ac-units/${id}`);
            if (!res.success) { window.showToast('Could not load AC Unit data', 'error'); return; }
            const ac = res.data;
            const token = ac.qr_code ? ac.qr_code.token : null;
            if (!token) { window.showToast('No QR code found', 'error'); return; }
            
            const qrImgUrl = `https://api.qrserver.com/v1/create-qr-code/?size=400x400&data=${token}`;
            const qrCardUrl = `${window.location.origin}/qr-card/${token}`;
            const messageText = `AC Code: ${ac.ac_code}\nCustomer: ${ac.customer ? ac.customer.full_name : 'Unknown'}\nQR Card Link: ${qrCardUrl}`;
            
            let phoneToUse = null;
            if (ac.customer) {
                const phone = ac.customer.whatsapp_no || ac.customer.mobile;
                if (phone) {
                    phoneToUse = phone.replace(/[^\d+]/g, '');
                }
            }

            // If we have a specific phone number, prioritize opening a direct chat!
            if (phoneToUse) {
                // Try to copy image to clipboard so they can paste it.
                if (navigator.clipboard && window.ClipboardItem) {
                    try {
                        // Generate canvas only if needed for clipboard
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
                        img.crossOrigin = 'Anonymous';
                        img.src = qrImgUrl;
                        await new Promise((resolve, reject) => {
                            img.onload = resolve;
                            img.onerror = reject;
                        });
                        
                        ctx.drawImage(img, 60, 40, 220, 220);
                        
                        ctx.textAlign = 'center';
                        ctx.font = 'bold 22px "Segoe UI", sans-serif';
                        ctx.fillStyle = '#0f172a';
                        ctx.fillText(ac.ac_code, 170, 300);
                        
                        ctx.font = '14px "Segoe UI", sans-serif';
                        ctx.fillStyle = '#64748b';
                        ctx.fillText(ac.customer ? ac.customer.full_name : '', 170, 330);
                        
                        if (ac.brand) {
                            ctx.fillText(`${ac.brand} ${ac.model || ''}`, 170, 355);
                        }
                        
                        ctx.font = '10px "Segoe UI", sans-serif';
                        ctx.fillStyle = '#94a3b8';
                        ctx.fillText(token, 170, 400);

                        const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/png'));
                        
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
            
            // If no specific phone, try to share the generated image via native Web Share API
            try {
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
                img.crossOrigin = 'Anonymous';
                img.src = qrImgUrl;
                await new Promise((resolve, reject) => {
                    img.onload = resolve;
                    img.onerror = reject;
                });
                
                ctx.drawImage(img, 60, 40, 220, 220);
                
                ctx.textAlign = 'center';
                ctx.font = 'bold 22px "Segoe UI", sans-serif';
                ctx.fillStyle = '#0f172a';
                ctx.fillText(ac.ac_code, 170, 300);
                
                ctx.font = '14px "Segoe UI", sans-serif';
                ctx.fillStyle = '#64748b';
                ctx.fillText(ac.customer ? ac.customer.full_name : '', 170, 330);
                
                if (ac.brand) {
                    ctx.fillText(`${ac.brand} ${ac.model || ''}`, 170, 355);
                }
                
                ctx.font = '10px "Segoe UI", sans-serif';
                ctx.fillStyle = '#94a3b8';
                ctx.fillText(token, 170, 400);

                const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/png'));
                const file = new File([blob], `QR_Card_${ac.ac_code}.png`, { type: 'image/png' });

                if (navigator.canShare && navigator.canShare({ files: [file] })) {
                    await navigator.share({
                        files: [file],
                        title: `QR Code - ${ac.ac_code}`,
                        text: messageText
                    });
                    return; 
                }
            } catch (shareErr) {
                if (shareErr.name === 'AbortError') return; 
                console.log('Native share failed, falling back to URL...', shareErr);
            }

            // Fallback: generic share
            const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(messageText)}`;
            window.location.href = whatsappUrl;
        } catch (err) {
            window.showToast('Error sharing QR', 'error');
        }
    }
};
