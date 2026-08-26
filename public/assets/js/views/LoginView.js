window.LoginView = {
    render: async (container) => {
        container.innerHTML = `
            <div class="auth-layout">
                <div class="glass-panel auth-box">

                    <!-- Logo -->
                    <div style="text-align: center; margin-bottom: 20px;">
                        <img src="/assets/logos/E3GM7yErLBb7Iuzpw9EjTUPjaIEcdWahr2GIaI6n.png" alt="Fablead Logo" style="max-width: 200px; height: auto; border-radius: 8px;">
                    </div>


                    <p style="color: var(--text-muted); margin-bottom: 24px; font-size: 14px;">Sign in to Maimoon Sales &mdash; AC Service Management</p>
                    
                    <form id="loginForm">
                        <div class="input-group" style="text-align: left;">
                            <label for="email">Email Address</label>
                            <input type="email" id="email" class="input-glass" required placeholder="Enter your email address">
                        </div>
                        <div class="input-group" style="text-align: left;">
                            <label for="password">Password</label>
                            <div style="position: relative;">
                                <input type="password" id="password" class="input-glass" required placeholder="Enter your password" style="padding-right: 40px; width: 100%;">
                                <i class="fa-regular fa-eye" id="toggleLoginPwd" style="position: absolute; right: 12px; top: 50%; transform: translateY(-50%); color: #94a3b8; cursor: pointer; font-size: 16px;"></i>
                            </div>
                        </div>
                        
                        <div id="loginError" style="color: var(--accent); margin-bottom: 16px; display: none; font-size: 14px;"></div>
                        
                        <button type="submit" class="btn btn-primary" style="width: 100%; padding: 14px; font-size: 16px; margin-top: 16px;" id="loginBtn">
                            Sign In
                        </button>
                    </form>

                    <!-- Footer -->
                    <div style="margin-top: 28px; padding-top: 16px; border-top: 1px solid var(--border-glass); text-align: center; font-size: 13px; font-weight: 500; color: #0f172a;">
                        &copy; ${new Date().getFullYear()} Copyright -
                        <a href="https://www.fableadtechnolabs.com/" target="_blank" rel="noopener noreferrer"
                           style="color: #0f172a; font-weight: 600; text-decoration: none; transition: color 0.2s;" onmouseover="this.style.color='#3b82f6'" onmouseout="this.style.color='#0f172a'">
                           Fablead Developers Technolab
                        </a>
                    </div>
               </div>
               <style>
                .body {
    overflow-y:hidden !important;
}
    .glass-panel {
    padding: 20px !important;
    }
               </style>
            </div>
        `;

        // Toggle password visibility
        const togglePwd = document.getElementById('toggleLoginPwd');
        const pwdInput = document.getElementById('password');
        if (togglePwd && pwdInput) {
            togglePwd.addEventListener('click', () => {
                const type = pwdInput.getAttribute('type') === 'password' ? 'text' : 'password';
                pwdInput.setAttribute('type', type);
                togglePwd.classList.toggle('fa-eye');
                togglePwd.classList.toggle('fa-eye-slash');
            });
        }

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
                window.appUser = response.data.user;
                window.router.navigate('/customers');
            } else {
                errorDiv.innerText = response.message || 'Invalid credentials';
                errorDiv.style.display = 'block';
                btn.innerHTML = 'Sign In';
                btn.disabled = false;
            }
        });
    }
};
