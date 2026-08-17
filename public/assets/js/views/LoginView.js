window.LoginView = {
    render: async (container) => {
        container.innerHTML = `
            <div class="auth-layout">
                <div class="glass-panel auth-box">
                    <h1 class="gradient-text" style="font-size: 2.5rem; margin-bottom: 8px;">Welcome Back</h1>
                    <p style="color: var(--text-muted); margin-bottom: 32px;">Sign in to AC Service Pro</p>
                    
                    <form id="loginForm">
                        <div class="input-group" style="text-align: left;">
                            <label for="email">Email Address</label>
                            <input type="email" id="email" class="input-glass" required placeholder="admin@example.com">
                        </div>
                        <div class="input-group" style="text-align: left;">
                            <label for="password">Password</label>
                            <input type="password" id="password" class="input-glass" required placeholder="••••••••">
                        </div>
                        
                        <div id="loginError" style="color: var(--accent); margin-bottom: 16px; display: none; font-size: 14px;"></div>
                        
                        <button type="submit" class="btn btn-primary" style="width: 100%; padding: 14px; font-size: 16px; margin-top: 16px;" id="loginBtn">
                            Sign In
                        </button>
                    </form>
                </div>
            </div>
        `;

        // Attach event listener
        document.getElementById('loginForm').addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            const btn = document.getElementById('loginBtn');
            const errorDiv = document.getElementById('loginError');
            
            btn.innerHTML = '<div class="spinner" style="width: 20px; height: 20px; border-width: 2px;"></div>';
            btn.disabled = true;
            errorDiv.style.display = 'none';

            const response = await window.api.post('/auth/login', { email, password });
            
            if (response.success) {
                localStorage.setItem('auth_token', response.data.token);
                window.router.navigate('/');
            } else {
                errorDiv.innerText = response.message || 'Invalid credentials';
                errorDiv.style.display = 'block';
                btn.innerHTML = 'Sign In';
                btn.disabled = false;
            }
        });
    }
};
