<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
    <meta name="robots" content="noindex, nofollow">
    <title>{{ $settings['company_name'] ?? 'Maimoon Sales' }} - AC Service Management</title>
    <link rel="icon" type="image/png" href="{{ $settings['company_favicon'] ?? '/public/assets/logos/crmfavicon.png' }}">
    <link rel="shortcut icon" type="image/png" href="{{ $settings['company_favicon'] ?? '/public/assets/logos/crmfavicon.png' }}">
    <script>
        window.appSettings = {!! json_encode($settings ?? []) !!};
    </script>
    
    <!-- Google Fonts for Premium Look -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <!-- FontAwesome for Icons -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    
    <!-- SweetAlert2 -->
    <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
    
    <!-- Choices.js for searchable dropdowns -->
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/choices.js/public/assets/styles/choices.min.css" />
    <script src="https://cdn.jsdelivr.net/npm/choices.js/public/assets/scripts/choices.min.js"></script>
    
    <!-- Chart.js -->
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>

    <!-- Custom Design System -->
    <link rel="stylesheet" href="{{ public_asset('assets/css/styles.css') }}?v={{ time() }}">
</head>
<body>
    
    <div id="app">
        <!-- SPA Mount Point -->
        <div class="glass-loader">
            <div class="spinner"></div>
            <p>Loading AC Service...</p>
        </div>
    </div>

    <!-- Core Scripts -->
    <script src="{{ public_asset('assets/js/api.js') }}?v={{ time() }}"></script>
    <script src="{{ public_asset('assets/js/router.js') }}?v={{ time() }}"></script>
    
    <!-- External Libraries -->
    <script src="https://unpkg.com/html5-qrcode"></script>

    <!-- Views -->
    <script src="{{ public_asset('assets/js/views/LoginView.js') }}?v={{ time() }}"></script>
    <script src="{{ public_asset('assets/js/views/AdminDashboard.js') }}?v={{ time() }}"></script>
    <script src="{{ public_asset('assets/js/views/CustomerList.js') }}?v={{ time() }}"></script>
    <script src="{{ public_asset('assets/js/views/CustomerForm.js') }}?v={{ time() }}"></script>
    <script src="{{ public_asset('assets/js/views/CustomerView.js') }}?v={{ time() }}"></script>
    <script src="{{ public_asset('assets/js/views/AcUnitList.js') }}?v={{ time() }}"></script>
    <script src="{{ public_asset('assets/js/views/AcUnitForm.js') }}?v={{ time() }}"></script>
    <script src="{{ public_asset('assets/js/views/AcUnitView.js') }}?v={{ time() }}"></script>
    <script src="{{ public_asset('assets/js/views/ServiceList.js') }}?v={{ time() }}"></script>
    <script src="{{ public_asset('assets/js/views/ServiceForm.js') }}?v={{ time() }}"></script>
    <script src="{{ public_asset('assets/js/views/ServiceView.js') }}?v={{ time() }}"></script>
    <script src="{{ public_asset('assets/js/views/QrScanner.js') }}?v={{ time() }}"></script>
    <script src="{{ public_asset('assets/js/views/StaffList.js') }}?v={{ time() }}"></script>
    <script src="{{ public_asset('assets/js/views/StaffForm.js') }}?v={{ time() }}"></script>
    <script src="{{ public_asset('assets/js/views/StaffView.js') }}?v={{ time() }}"></script>
    <script src="{{ public_asset('assets/js/views/ProfileView.js') }}?v={{ time() }}"></script>
    <script src="{{ public_asset('assets/js/views/UserLogs.js') }}?v={{ time() }}"></script>
    <script src="{{ public_asset('assets/js/views/Reports.js') }}?v={{ time() }}"></script>
    <script src="{{ public_asset('assets/js/views/NotificationList.js') }}?v={{ time() }}"></script>
    <script src="{{ public_asset('assets/js/views/MastersDashboard.js') }}?v={{ time() }}"></script>
    <script src="{{ public_asset('assets/js/views/MasterList.js') }}?v={{ time() }}"></script>
    <script src="{{ public_asset('assets/js/views/Settings.js') }}?v={{ time() }}"></script>
    
    <!-- App Entry -->
    <script src="{{ public_asset('assets/js/app.js') }}?v={{ time() }}"></script>
</body>
</html>
