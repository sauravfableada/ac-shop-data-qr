window.QrScanner = {
    render: async (container) => {
        const content = `
            <div>
                <div style="margin-bottom: 32px;">
                    <h1 style="font-size: 32px;">Scan QR Code</h1>
                    <p style="color: var(--text-muted);">Point your camera at the AC Unit's QR code</p>
                </div>
                
                <div class="glass-panel" style="padding: 40px; text-align: center; max-width: 500px; margin: 0 auto;">
                    <div id="reader" style="width: 100%; border-radius: 12px; overflow: hidden; margin-bottom: 24px;"></div>
                    <div id="scanResult" style="margin-top: 24px;"></div>
                </div>
            </div>
        `;

        container.innerHTML = window.renderLayout(content);

        // Check if library is loaded
        if (typeof Html5QrcodeScanner !== 'undefined') {
            const onScanSuccess = async (decodedText, decodedResult) => {
                // decodedText should be the token
                scanner.clear();
                const resultDiv = document.getElementById('scanResult');
                resultDiv.innerHTML = `<div class="glass-loader" style="position:relative; transform:none; left:0; top:0;"><div class="spinner"></div></div>`;
                
                const response = await window.api.get(`/qr/${decodedText}`);
                if (response.success) {
                    const ac = response.data.ac;
                    resultDiv.innerHTML = `
                        <div style="background: rgba(16,185,129,0.1); border: 1px solid #10B981; padding: 20px; border-radius: 8px;">
                            <h3 style="color: #10B981; margin-bottom: 12px;">Match Found!</h3>
                            <p style="margin-bottom: 8px;"><strong>Brand:</strong> ${ac.brand} ${ac.model}</p>
                            <p style="margin-bottom: 8px;"><strong>Customer:</strong> ${ac.customer ? ac.customer.full_name : 'N/A'}</p>
                            <a href="#/services/new?ac_id=${ac.id}" class="btn btn-primary" style="margin-top: 16px;">Create Service Request</a>
                        </div>
                    `;
                } else {
                    resultDiv.innerHTML = `
                        <div style="background: rgba(244,63,94,0.1); border: 1px solid #F43F5E; padding: 20px; border-radius: 8px; color: #F43F5E;">
                            Invalid or unrecognized QR Code.
                        </div>
                    `;
                }
            };

            const scanner = new Html5QrcodeScanner("reader", { fps: 10, qrbox: {width: 250, height: 250} }, false);
            scanner.render(onScanSuccess);
        } else {
            document.getElementById('reader').innerHTML = '<p style="color: var(--accent);">Scanner library not loaded.</p>';
        }
    }
};
