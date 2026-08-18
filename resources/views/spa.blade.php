<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>AC Service Premium</title>
    
    <!-- Google Fonts for Premium Look -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <!-- FontAwesome for Icons -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    
    <!-- Custom Design System -->
    <link rel="stylesheet" href="/assets/css/styles.css">
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
    <script src="/assets/js/api.js"></script>
    <script src="/assets/js/router.js"></script>
    
    <!-- External Libraries -->
    <script src="https://unpkg.com/html5-qrcode"></script>

    <!-- Views -->
    <script src="/assets/js/views/LoginView.js"></script>
    <script src="/assets/js/views/AdminDashboard.js"></script>
    <script src="/assets/js/views/CustomerList.js"></script>
    <script src="/assets/js/views/CustomerForm.js"></script>
    <script src="/assets/js/views/CustomerView.js"></script>
    <script src="/assets/js/views/AcUnitList.js"></script>
    <script src="/assets/js/views/AcUnitForm.js"></script>
    <script src="/assets/js/views/AcUnitView.js"></script>
    <script src="/assets/js/views/ServiceList.js"></script>
    <script src="/assets/js/views/ServiceForm.js"></script>
    <script src="/assets/js/views/ServiceView.js"></script>
    <script src="/assets/js/views/QrScanner.js"></script>
    <script src="/assets/js/views/ProfileView.js"></script>
    <script src="/assets/js/views/UserLogs.js"></script>
    
    <!-- App Entry -->
    <script src="/assets/js/app.js"></script>
</body>
</html>
