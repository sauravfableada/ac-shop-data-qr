<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Dashboard Layout</title>
    
    <!-- Google Fonts -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    
    <!-- FontAwesome for icons -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
            font-family: 'Outfit', sans-serif;
        }
        body {
            display: flex;
            background-color: #f4f6f9;
            height: 100vh;
            overflow: hidden;
        }
        
        /* Sidebar Styles */
        .sidebar {
            width: 250px;
            background-color: #0f172a; /* Dark blue/black */
            color: #fff;
            display: flex;
            flex-direction: column;
            transition: width 0.3s ease;
            height: 100%;
            overflow-y: auto;
            overflow-x: hidden;
        }
        .sidebar.collapsed {
            width: 70px;
        }
        
        .sidebar-header {
            padding: 20px;
            display: flex;
            align-items: center;
            justify-content: center;
            border-bottom: 1px solid rgba(255, 255, 255, 0.05);
            min-height: 70px;
            background-color: #fff;
            color: #333;
            margin: 10px;
            border-radius: 8px;
        }
        
        .sidebar-profile {
            display: flex;
            align-items: center;
            padding: 10px;
            margin: 0 10px 10px 10px;
            background-color: #1e293b;
            border-radius: 8px;
            transition: all 0.3s;
            border: 1px solid rgba(255, 255, 255, 0.1);
        }
        .sidebar-profile img {
            width: 35px;
            height: 35px;
            border-radius: 5px;
        }
        .sidebar.collapsed .sidebar-profile {
            justify-content: center;
            padding: 10px 0;
        }
        
        .nav-items {
            list-style: none;
            padding: 10px 0;
            flex-grow: 1;
        }
        .nav-item {
            padding: 12px 20px;
            display: flex;
            align-items: center;
            cursor: pointer;
            color: #94a3b8;
            text-decoration: none;
            transition: background 0.2s, color 0.2s;
            margin: 2px 10px;
            border-radius: 8px;
        }
        .nav-item:hover, .nav-item.active {
            background-color: #1e293b;
            color: #fff;
        }
        .nav-item.active {
            border-left: 3px solid #3b82f6;
        }
        
        .nav-item i {
            font-size: 18px;
            min-width: 30px;
            text-align: center;
        }
        .nav-text {
            margin-left: 10px;
            white-space: nowrap;
            transition: opacity 0.3s ease;
            font-size: 14px;
        }
        .sidebar.collapsed .nav-text {
            opacity: 0;
            display: none;
        }
        .sidebar.collapsed .sidebar-header .nav-text {
            display: none;
        }
        
        /* Main Content Area */
        .main-content {
            flex-grow: 1;
            display: flex;
            flex-direction: column;
            overflow-y: auto;
        }
        
        /* Header Styles */
        .top-header {
            background-color: #fff;
            height: 70px;
            padding: 0 20px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            box-shadow: 0 1px 3px rgba(0,0,0,0.05);
        }
        
        .toggle-btn {
            background: none;
            border: 1px solid #e2e8f0;
            font-size: 20px;
            cursor: pointer;
            color: #64748b;
            padding: 8px 12px;
            border-radius: 5px;
            transition: all 0.2s;
        }
        .toggle-btn:hover {
            background-color: #f1f5f9;
            color: #0f172a;
        }
        
        .header-search input {
            padding: 10px 15px;
            border: none;
            background-color: #f1f5f9;
            border-radius: 5px;
            width: 300px;
            outline: none;
        }
        
        .header-right {
            display: flex;
            align-items: center;
            gap: 20px;
        }
        .profile-sec {
            display: flex;
            align-items: center;
            gap: 10px;
            border-left: 1px solid #e2e8f0;
            padding-left: 20px;
        }
        .profile-sec img {
            width: 40px;
            height: 40px;
            border-radius: 50%;
        }
        .profile-name {
            font-weight: 600;
            font-size: 14px;
            color: #0f172a;
        }
        .profile-role {
            font-size: 12px;
            color: #64748b;
        }
        
        .content-area {
            padding: 24px;
        }
        
        /* Toast Notification Styles */
        .toast-container {
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 9999;
            display: flex;
            flex-direction: column;
            gap: 10px;
        }
        
        .toast {
            min-width: 300px;
            background: rgba(255, 255, 255, 0.9);
            backdrop-filter: blur(10px);
            border-left: 4px solid #3b82f6;
            border-radius: 8px;
            padding: 16px 20px;
            box-shadow: 0 10px 25px rgba(0,0,0,0.1);
            display: flex;
            align-items: center;
            gap: 12px;
            transform: translateX(120%);
            transition: transform 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55), opacity 0.3s;
            opacity: 0;
            color: #0f172a;
        }
        
        .toast.show {
            transform: translateX(0);
            opacity: 1;
        }
        
        .toast.success {
            border-left-color: #10b981;
        }
        .toast.success .toast-icon {
            color: #10b981;
        }
        
        .toast.error {
            border-left-color: #ef4444;
        }
        .toast.error .toast-icon {
            color: #ef4444;
        }
        
        .toast-icon {
            font-size: 20px;
        }
        
        .toast-message {
            font-size: 14px;
            font-weight: 500;
            flex-grow: 1;
        }
    </style>
</head>
<body>

    <!-- Sidebar -->
    <div class="sidebar" id="sidebar">
        <!-- Logo Area -->
        <div class="sidebar-header" style="background-color: transparent; border-bottom: none; color: white;">
            <i class="fa-solid fa-shield-halved" style="color: #3b82f6; font-size: 24px; margin-right: 8px;"></i>
            <span class="nav-text" style="font-weight: 700; color: white; font-size: 18px;">AC Service Pro</span>
        </div>
        
        <!-- Profile Area -->
        <div class="sidebar-profile" style="background-color: #1e293b; color: white; border: none; margin: 0 16px 20px 16px; padding: 12px; border-radius: 8px;">
            <div style="width: 35px; height: 35px; border-radius: 8px; background: #10b981; display: flex; align-items: center; justify-content: center; font-weight: bold; color: white;">AU</div>
            <span class="nav-text" style="font-size: 13px; font-weight: 600; margin-left: 10px;">Admin User</span>
        </div>

        <!-- Navigation Links -->
        <ul class="nav-items" style="padding: 0 12px;">
            <li>
                <a href="#" onclick="window.router.navigate('/dashboard')" class="nav-item">
                    <i class="fa-solid fa-desktop" style="width: 24px;"></i>
                    <span class="nav-text">Dashboard</span>
                </a>
            </li>
            <li>
                <a href="#" onclick="window.router.navigate('/customers')" class="nav-item">
                    <i class="fa-solid fa-users" style="width: 24px;"></i>
                    <span class="nav-text">Customers</span>
                </a>
            </li>
            <li>
                <a href="#" onclick="window.router.navigate('/ac-units')" class="nav-item">
                    <i class="fa-solid fa-fan" style="width: 24px;"></i>
                    <span class="nav-text">AC Units</span>
                </a>
            </li>
            <li>
                <a href="#" onclick="window.router.navigate('/services')" class="nav-item">
                    <i class="fa-solid fa-clipboard-list" style="width: 24px;"></i>
                    <span class="nav-text">Services</span>
                </a>
            </li>
            
            <li style="margin-top: 40px;">
                <a href="#" class="nav-item" style="color: #ef4444;">
                    <i class="fa-solid fa-right-from-bracket" style="width: 24px;"></i>
                    <span class="nav-text">Logout</span>
                </a>
            </li>
        </ul>
    </div>

    <!-- Main Content -->
    <div class="main-content">
        <!-- Top Header -->
        <div class="top-header">
            <div class="header-left" style="display: flex; align-items: center; gap: 15px;">
                <button class="toggle-btn" id="sidebarToggle" style="border: none; background: transparent; font-size: 20px; color: #64748b; cursor: pointer;">
                    <i class="fa-solid fa-bars"></i>
                </button>
                <div class="header-search" style="position: relative; display: flex; align-items: center;">
                    <i class="fa-solid fa-search" style="position: absolute; left: 15px; color: #94a3b8;"></i>
                    <input type="text" placeholder="Search anything..." style="padding: 10px 15px 10px 40px; border: none; background-color: #f8fafc; border-radius: 20px; width: 300px; outline: none; font-size: 14px;">
                </div>
            </div>
            
            <div class="header-right" style="display: flex; align-items: center; gap: 15px;">
                <!-- Basic Plan Button -->
                <button style="display: flex; align-items: center; gap: 8px; padding: 6px 15px; background: #e87a17; color: white; border: none; border-radius: 6px; cursor: pointer;">
                    <i class="fa-solid fa-crown" style="font-size: 20px;"></i>
                    <div style="text-align: left; line-height: 1.2;">
                        <div style="font-weight: 700; font-size: 14px;">Basic Plan</div>
                        <div style="font-size: 10px; font-weight: 500;">Expires: 31-12-2026</div>
                    </div>
                </button>

                <!-- Policies Button -->
                <button style="display: flex; align-items: center; gap: 8px; padding: 10px 15px; background: #0f172a; color: white; border: none; border-radius: 6px; cursor: pointer; font-weight: 600; font-size: 14px;">
                    <i class="fa-solid fa-shield-halved"></i> Policies <i class="fa-solid fa-chevron-down" style="font-size: 12px; margin-left: 5px;"></i>
                </button>

                <!-- Upload via AI Button -->
                <button style="display: flex; align-items: center; gap: 8px; padding: 10px 15px; background: #0f172a; color: white; border: none; border-radius: 6px; cursor: pointer; font-weight: 600; font-size: 14px;">
                    <i class="fa-solid fa-wand-magic-sparkles"></i> Upload via AI
                </button>

                <!-- Tutorials Button -->
                <button style="display: flex; align-items: center; gap: 8px; padding: 10px 15px; background: #0f172a; color: white; border: none; border-radius: 6px; cursor: pointer; font-weight: 600; font-size: 14px;">
                    <i class="fa-solid fa-circle-play"></i> Tutorials
                </button>
                
                <div class="profile-sec" style="display: flex; align-items: center; gap: 15px; border-left: 1px solid #e2e8f0; padding-left: 15px; height: 40px;">
                    <!-- Notification Bell with Badge -->
                    <div style="position: relative; cursor: pointer;">
                        <i class="fa-regular fa-bell" style="font-size: 20px; color: #64748b;"></i>
                        <span style="position: absolute; top: -5px; right: -5px; background: #ef4444; color: white; font-size: 10px; font-weight: bold; padding: 2px 5px; border-radius: 10px; border: 2px solid #fff;">16</span>
                    </div>
                    
                    <!-- Dark Mode Toggle -->
                    <i class="fa-regular fa-moon" style="font-size: 20px; color: #64748b; cursor: pointer;"></i>
                    
                    <!-- Profile Info -->
                    <div style="display: flex; align-items: center; gap: 10px; cursor: pointer;">
                        <img src="https://ui-avatars.com/api/?name=MITULL+A+BHAVSAR&background=random" alt="Profile" style="width: 36px; height: 36px; border-radius: 50%;">
                        <div>
                            <div style="font-weight: 700; font-size: 13px; color: #0f172a;">MITULL A BHAVSAR</div>
                            <div style="font-size: 11px; color: #64748b;">Administrator</div>
                        </div>
                        <i class="fa-solid fa-chevron-down" style="font-size: 12px; color: #64748b;"></i>
                    </div>
                </div>
            </div>
        </div>

        <!-- Dynamic Page Content -->
        <div class="content-area">
            @yield('content')
        </div>
    </div>

    <!-- jQuery CDN -->
    <script src="https://code.jquery.com/jquery-3.7.1.min.js"></script>
    <script>
        // Global Toast Notification System
        window.showToast = (message, type = 'success') => {
            let container = document.getElementById('toast-container');
            if (!container) {
                container = document.createElement('div');
                container.id = 'toast-container';
                container.className = 'toast-container';
                document.body.appendChild(container);
            }
            
            const toast = document.createElement('div');
            toast.className = `toast ${type}`;
            
            const iconClass = type === 'success' ? 'fa-solid fa-circle-check' : 'fa-solid fa-circle-exclamation';
            
            toast.innerHTML = `
                <i class="${iconClass} toast-icon"></i>
                <div class="toast-message">${message}</div>
            `;
            
            container.appendChild(toast);
            
            // Trigger animation
            setTimeout(() => toast.classList.add('show'), 10);
            
            // Remove after 3 seconds
            setTimeout(() => {
                toast.classList.remove('show');
                setTimeout(() => toast.remove(), 300);
            }, 3000);
        };

        $(document).ready(function() {
            // Toggle sidebar on hamburger menu click
            $('#sidebarToggle').click(function() {
                $('#sidebar').toggleClass('collapsed');
            });
        });
    </script>
</body>
</html>
