<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Customer;
use App\Models\AcUnit;
use App\Models\Service;
use App\Models\User;
use App\Traits\ApiResponse;
use Carbon\Carbon;

class DashboardController extends Controller
{
    use ApiResponse;

    public function adminDashboard()
    {
        $today = Carbon::today();
        
        $data = [
            'total_customers' => Customer::count(),
            'total_acs' => AcUnit::count(),
            'total_services' => Service::count(),
            'pending_services' => Service::where('status', 'pending')->count(),
            'completed_services' => Service::where('status', 'completed')->count(),
            'today_services' => Service::whereDate('service_date', $today)->count(),
            'upcoming_services' => Service::where('service_date', '>', $today)->count(),
            'total_revenue' => Service::where('payment_status', 'paid')->sum('total'),
            'staff_count' => User::count(), // Adjust this if filtering by 'staff' role
        ];

        return $this->success($data, 'Admin dashboard statistics retrieved successfully.');
    }

    public function staffDashboard(Request $request)
    {
        $user = $request->user();
        $today = Carbon::today();

        $data = [
            'assigned_services' => Service::where('technician_id', $user->id)->count(),
            'today_services' => Service::where('technician_id', $user->id)->whereDate('service_date', $today)->count(),
            'pending_services' => Service::where('technician_id', $user->id)->where('status', 'pending')->count(),
            'completed_services' => Service::where('technician_id', $user->id)->where('status', 'completed')->count(),
            'upcoming_services' => Service::where('technician_id', $user->id)->where('service_date', '>', $today)->count(),
        ];

        return $this->success($data, 'Staff dashboard statistics retrieved successfully.');
    }
}
