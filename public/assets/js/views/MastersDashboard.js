window.MastersDashboard = {
    render: (container) => {
        const content = `
            <div>
                <div class="table-header-row" style="margin-bottom: 24px;">
                    <div>
                        <h1 style="font-size: 24px; color: #0f172a; margin-bottom: 4px;">Masters Dashboard</h1>
                        <p style="color: #64748b; font-size: 14px;">Manage all master data from one place.</p>
                    </div>
                </div>

                <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(250px, 1fr)); gap: 24px;">
                    <!-- AC Type Master -->
                    <div class="glass-panel master-card" onclick="window.router.navigate('/masters/ac_type')" style="background: #ffffff; padding: 32px; border-radius: 12px; text-align: center; cursor: pointer; transition: transform 0.2s, box-shadow 0.2s; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);">
                        <div style="width: 64px; height: 64px; margin: 0 auto 16px auto; border-radius: 50%; background: rgba(59, 130, 246, 0.1); display: flex; align-items: center; justify-content: center; color: #3b82f6; font-size: 28px;">
                            <i class="fa-solid fa-wind"></i>
                        </div>
                        <h3 style="font-size: 18px; color: #0f172a; margin-bottom: 8px;">AC Type Master</h3>
                        <p style="color: #64748b; font-size: 13px;">Manage AC types</p>
                    </div>

                    <!-- Inverter Type Master -->
                    <div class="glass-panel master-card" onclick="window.router.navigate('/masters/inverter_type')" style="background: #ffffff; padding: 32px; border-radius: 12px; text-align: center; cursor: pointer; transition: transform 0.2s, box-shadow 0.2s; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);">
                        <div style="width: 64px; height: 64px; margin: 0 auto 16px auto; border-radius: 50%; background: rgba(16, 185, 129, 0.1); display: flex; align-items: center; justify-content: center; color: #10b981; font-size: 28px;">
                            <i class="fa-solid fa-bolt"></i>
                        </div>
                        <h3 style="font-size: 18px; color: #0f172a; margin-bottom: 8px;">Inverter Type Master</h3>
                        <p style="color: #64748b; font-size: 13px;">Manage Inverter types</p>
                    </div>

                    <!-- Service Type Master -->
                    <div class="glass-panel master-card" onclick="window.router.navigate('/masters/service_type')" style="background: #ffffff; padding: 32px; border-radius: 12px; text-align: center; cursor: pointer; transition: transform 0.2s, box-shadow 0.2s; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);">
                        <div style="width: 64px; height: 64px; margin: 0 auto 16px auto; border-radius: 50%; background: rgba(245, 158, 11, 0.1); display: flex; align-items: center; justify-content: center; color: #f59e0b; font-size: 28px;">
                            <i class="fa-solid fa-screwdriver-wrench"></i>
                        </div>
                        <h3 style="font-size: 18px; color: #0f172a; margin-bottom: 8px;">Service Type Master</h3>
                        <p style="color: #64748b; font-size: 13px;">Manage service types</p>
                    </div>
                </div>
            </div>
        `;

        container.innerHTML = window.renderLayout(content);
        
        container.querySelectorAll('.master-card').forEach(panel => {
            panel.addEventListener('mouseenter', () => {
                panel.style.transform = 'translateY(-5px)';
                panel.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)';
            });
            panel.addEventListener('mouseleave', () => {
                panel.style.transform = 'none';
                panel.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)';
            });
        });
    }
};
