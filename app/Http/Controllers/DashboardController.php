<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Customer;
use App\Models\AcUnit;
use App\Models\ServiceRecord;
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
            'total_services' => ServiceRecord::count(),
            'pending_services' => ServiceRecord::where('status', 'pending')->count(),
            'completed_services' => ServiceRecord::where('status', 'completed')->count(),
            'today_services' => ServiceRecord::whereDate('service_date', $today)->count(),
            'upcoming_services' => ServiceRecord::where('service_date', '>', $today)->count(),
            'total_revenue' => ServiceRecord::where('payment_status', 'paid')->sum('total_amount'),
            'staff_count' => User::count(), // Adjust this if filtering by 'staff' role
        ];

        return $this->success($data, 'Admin dashboard statistics retrieved successfully.');
    }

    public function staffDashboard(Request $request)
    {
        $user = $request->user();
        $today = Carbon::today();

        $data = [
            'assigned_services' => ServiceRecord::where('assign_staff', $user->id)->count(),
            'today_services' => ServiceRecord::where('assign_staff', $user->id)->whereDate('service_date', $today)->count(),
            'pending_services' => ServiceRecord::where('assign_staff', $user->id)->where('status', 'pending')->count(),
            'completed_services' => ServiceRecord::where('assign_staff', $user->id)->where('status', 'completed')->count(),
            'upcoming_services' => ServiceRecord::where('assign_staff', $user->id)->where('service_date', '>', $today)->count(),
        ];

        return $this->success($data, 'Staff dashboard statistics retrieved successfully.');
    }
}
