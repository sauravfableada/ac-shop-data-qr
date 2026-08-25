<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;

// Public Auth Routes
Route::post('/auth/login', [AuthController::class, 'login']);

// Protected Routes
Route::middleware('auth:api')->group(function () {
    
    // Auth
    Route::post('/auth/logout', [AuthController::class, 'logout']);
    Route::get('/auth/me', [AuthController::class, 'me']);
    Route::put('/auth/me', [AuthController::class, 'updateProfile']);
    Route::post('/auth/me/avatar', [AuthController::class, 'uploadAvatar']);

    // Customers
    Route::get('/customers/next-code', [\App\Http\Controllers\CustomerController::class, 'getNextCode']);
    Route::get('/customers', [\App\Http\Controllers\CustomerController::class, 'index'])->middleware('permission:customer.view');
    Route::post('/customers', [\App\Http\Controllers\CustomerController::class, 'store'])->middleware('permission:customer.create');
    Route::get('/customers/{customer}', [\App\Http\Controllers\CustomerController::class, 'show'])->middleware('permission:customer.view');
    Route::put('/customers/{customer}', [\App\Http\Controllers\CustomerController::class, 'update'])->middleware('permission:customer.edit');
    Route::delete('/customers/{customer}', [\App\Http\Controllers\CustomerController::class, 'destroy'])->middleware('permission:customer.delete');

    // AC Units
    Route::get('/ac-units/next-code', [\App\Http\Controllers\AcUnitController::class, 'getNextCode']);
    Route::get('/ac-units', [\App\Http\Controllers\AcUnitController::class, 'index'])->middleware('permission:ac.view');
    Route::post('/ac-units', [\App\Http\Controllers\AcUnitController::class, 'store'])->middleware('permission:ac.create');
    Route::get('/ac-units/{ac_unit}', [\App\Http\Controllers\AcUnitController::class, 'show'])->middleware('permission:ac.view');
    Route::put('/ac-units/{ac_unit}', [\App\Http\Controllers\AcUnitController::class, 'update'])->middleware('permission:ac.edit');
    Route::delete('/ac-units/{ac_unit}', [\App\Http\Controllers\AcUnitController::class, 'destroy'])->middleware('permission:ac.delete');

    // Spare Parts
    Route::get('/spare-parts', [\App\Http\Controllers\SparePartController::class, 'index'])->middleware('permission:spare_parts.view');
    Route::post('/spare-parts', [\App\Http\Controllers\SparePartController::class, 'store'])->middleware('permission:spare_parts.create');
    Route::get('/spare-parts/{spare_part}', [\App\Http\Controllers\SparePartController::class, 'show'])->middleware('permission:spare_parts.view');
    Route::put('/spare-parts/{spare_part}', [\App\Http\Controllers\SparePartController::class, 'update'])->middleware('permission:spare_parts.edit');
    Route::delete('/spare-parts/{spare_part}', [\App\Http\Controllers\SparePartController::class, 'destroy'])->middleware('permission:spare_parts.delete');

    // Services (and /maintenance aliases for cached JS)
    Route::get('/services', [\App\Http\Controllers\ServiceController::class, 'index'])->middleware('permission:service.view');
    Route::post('/services', [\App\Http\Controllers\ServiceController::class, 'store'])->middleware('permission:service.create');
    Route::get('/services/{service}', [\App\Http\Controllers\ServiceController::class, 'show'])->middleware('permission:service.view');
    Route::put('/services/{service}', [\App\Http\Controllers\ServiceController::class, 'update'])->middleware('permission:service.edit');
    Route::delete('/services/{service}', [\App\Http\Controllers\ServiceController::class, 'destroy'])->middleware('permission:service.delete');

    Route::post('/maintenance', [\App\Http\Controllers\ServiceController::class, 'store'])->middleware('permission:service.create');
    Route::put('/maintenance/{service}', [\App\Http\Controllers\ServiceController::class, 'update'])->middleware('permission:service.edit');
    
    // Service specialized routes
    Route::patch('/services/{service}/status', [\App\Http\Controllers\ServiceController::class, 'updateStatus'])->middleware('permission:service.edit');
    Route::post('/services/{service}/assign-staff', [\App\Http\Controllers\ServiceController::class, 'assignStaff'])->middleware('permission:service.assign');
    Route::post('/services/{service}/images', [\App\Http\Controllers\ServiceController::class, 'uploadImages'])->middleware('permission:service.edit');
    Route::get('/ac-units/{id}/service-history', [\App\Http\Controllers\ServiceController::class, 'acServiceHistory'])->middleware('permission:service.view');
    Route::get('/customers/{id}/service-history', [\App\Http\Controllers\ServiceController::class, 'customerServiceHistory'])->middleware('permission:service.view');
    // Dashboards & Reports
    Route::get('/admin/dashboard', [\App\Http\Controllers\DashboardController::class, 'adminDashboard'])->middleware('permission:dashboard.admin');
    Route::get('/staff/dashboard', [\App\Http\Controllers\DashboardController::class, 'staffDashboard'])->middleware('permission:dashboard.staff');
    Route::get('/reports/income', [\App\Http\Controllers\ReportController::class, 'income'])->middleware('permission:dashboard.admin');
    Route::get('/reports/export', [\App\Http\Controllers\ReportController::class, 'export'])->middleware('permission:dashboard.admin');

    // Masters
    Route::get('/masters', [\App\Http\Controllers\MasterController::class, 'index']);
    Route::post('/masters', [\App\Http\Controllers\MasterController::class, 'store'])->middleware('permission:dashboard.admin|staff'); // Allow staff to create to trigger notification, or just let both
    Route::put('/masters/{id}', [\App\Http\Controllers\MasterController::class, 'update'])->middleware('permission:dashboard.admin');
    Route::delete('/masters/{id}', [\App\Http\Controllers\MasterController::class, 'destroy'])->middleware('permission:dashboard.admin');

    // Admin Staff Permissions
    Route::get('/admin/staff', [\App\Http\Controllers\AdminController::class, 'index']);
    Route::post('/admin/staff', [\App\Http\Controllers\AdminController::class, 'store']);
    Route::get('/admin/staff/{id}', [\App\Http\Controllers\AdminController::class, 'show']);
    Route::put('/admin/staff/{id}', [\App\Http\Controllers\AdminController::class, 'update']);
    Route::delete('/admin/staff/{id}', [\App\Http\Controllers\AdminController::class, 'destroy']);
    Route::put('/admin/staff/{id}/permissions', [\App\Http\Controllers\AdminController::class, 'assignPermissions'])->middleware('permission:staff.edit');

    // QR Scan API (Token based)
    Route::get('/qr/{token}', function ($token) {
        $qrCode = \App\Models\AcQrCode::where('token', $token)->first();
        if (!$qrCode) return response()->json(['success' => false, 'message' => 'Invalid QR token'], 404);
        
        $acUnit = \App\Models\AcUnit::with([
            'customer',
            'qrCode',
            'serviceRecords' => function($q) { $q->orderBy('id', 'desc'); }
        ])->find($qrCode->ac_unit_id);
        if (!$acUnit) return response()->json(['success' => false, 'message' => 'AC Unit not found'], 404);
        
        return response()->json(['success' => true, 'data' => ['ac' => $acUnit, 'customer' => $acUnit->customer]]);
    })->middleware('permission:qr.view');

    // User Logs
    Route::get('/user-logs', [\App\Http\Controllers\UserLogController::class, 'index']);
    Route::delete('/user-logs/clear', [\App\Http\Controllers\UserLogController::class, 'clearAll']);
    Route::delete('/user-logs/{id}', [\App\Http\Controllers\UserLogController::class, 'destroy']);

    // Notifications
    Route::get('/notifications', [\App\Http\Controllers\NotificationController::class, 'index']);
    Route::post('/notifications/read-all', [\App\Http\Controllers\NotificationController::class, 'markAllAsRead']);
    Route::post('/notifications/{id}/read', [\App\Http\Controllers\NotificationController::class, 'markAsRead']);
});
