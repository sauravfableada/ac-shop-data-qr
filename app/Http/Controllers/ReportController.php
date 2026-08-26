<?php

namespace App\Http\Controllers;

use App\Models\ServiceRecord;
use App\Traits\ApiResponse;
use Illuminate\Http\Request;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class ReportController extends Controller
{
    use ApiResponse;

    public function income(Request $request)
    {
        $user = $request->user();
        if (!$user->roles()->where('name', 'admin')->exists()) {
            return $this->error('Unauthorized', 403);
        }

        $query = ServiceRecord::with(['customer', 'acUnit', 'technician']);

        // Filters
        if ($request->filled('customer_id')) {
            $query->where('customer_id', $request->customer_id);
        }
        if ($request->filled('ac_unit_id')) {
            $query->where('ac_unit_id', $request->ac_unit_id);
        }
        if ($request->filled('staff_id')) {
            $query->where('assign_staff', $request->staff_id);
        }

        // Date Range Logic
        $dateRange = $request->input('date_range', 'all'); // daily, weekly, monthly, yearly, custom, all
        $startDate = null;
        $endDate = Carbon::now()->endOfDay();

        if ($dateRange === 'daily') {
            $startDate = Carbon::now()->subDays(15)->startOfDay();
            $groupBy = 'date'; // Group by day
        } elseif ($dateRange === 'weekly') {
            $startDate = Carbon::now()->subWeeks(12)->startOfDay();
            $groupBy = 'week';
        } elseif ($dateRange === 'yearly') {
            $startDate = Carbon::now()->startOfYear();
            $groupBy = 'month';
        } elseif ($dateRange === 'custom') {
            if ($request->filled('start_date')) {
                $startDate = Carbon::parse($request->start_date)->startOfDay();
            }
            if ($request->filled('end_date')) {
                $endDate = Carbon::parse($request->end_date)->endOfDay();
            }
            $groupBy = 'date'; // Default for custom to day
        } elseif ($dateRange === 'all') {
            $startDate = null;
            $endDate = null;
            $groupBy = 'month';
        } else {
            // Default to All if unrecognized
            $startDate = null;
            $endDate = null;
            $groupBy = 'month';
        }

        if ($startDate) {
            $query->where('service_date', '>=', $startDate);
        }
        if ($endDate) {
            $query->where('service_date', '<=', $endDate);
        }

        // Summary Totals from the filtered query
        // We need to clone to run multiple aggregates
        $totalBilled = (clone $query)->sum('total_amount');
        $totalPaid = (clone $query)->where('payment_status', 'paid')->sum('total_amount');
        $totalPending = $totalBilled - $totalPaid;

        // Chart Data Query
        $chartQuery = clone $query;
        
        if ($groupBy === 'date') {
            $chartRecords = $chartQuery->select(
                DB::raw('DATE(service_date) as label_val'),
                DB::raw('SUM(total_amount) as total_income'),
                DB::raw('SUM(CASE WHEN payment_status = "paid" THEN total_amount ELSE 0 END) as total_paid')
            )->groupBy('label_val')->orderBy('label_val', 'asc')->get();
        } elseif ($groupBy === 'week') {
            $chartRecords = $chartQuery->select(
                DB::raw('YEARWEEK(service_date, 1) as label_val'),
                DB::raw('MIN(DATE(service_date)) as week_start'),
                DB::raw('SUM(total_amount) as total_income'),
                DB::raw('SUM(CASE WHEN payment_status = "paid" THEN total_amount ELSE 0 END) as total_paid')
            )->groupBy('label_val')->orderBy('label_val', 'asc')->get();
        } else { // month
            $chartRecords = $chartQuery->select(
                DB::raw('DATE_FORMAT(service_date, "%Y-%m") as label_val'),
                DB::raw('SUM(total_amount) as total_income'),
                DB::raw('SUM(CASE WHEN payment_status = "paid" THEN total_amount ELSE 0 END) as total_paid')
            )->groupBy('label_val')->orderBy('label_val', 'asc')->get();
        }

        $chartLabels = [];
        $chartTotalData = [];
        $chartPaidData = [];

        foreach ($chartRecords as $record) {
            if ($groupBy === 'date') {
                $chartLabels[] = Carbon::parse($record->label_val)->format('M d');
            } elseif ($groupBy === 'week') {
                $chartLabels[] = 'Wk ' . Carbon::parse($record->week_start)->format('M d');
            } else {
                $chartLabels[] = Carbon::createFromFormat('Y-m', $record->label_val)->format('M Y');
            }
            $chartTotalData[] = $record->total_income;
            $chartPaidData[] = $record->total_paid;
        }

        // Paginated Table Data
        $perPage = $request->input('per_page', 10);
        $paginatedRecords = $query->orderBy('id', 'desc')->paginate($perPage);

        return $this->success([
            'chart' => [
                'labels' => $chartLabels,
                'total' => $chartTotalData,
                'paid' => $chartPaidData,
            ],
            'summary' => [
                'total_billed' => $totalBilled,
                'total_paid' => $totalPaid,
                'total_pending' => $totalPending
            ],
            'table' => [
                'data' => $paginatedRecords->items(),
                'meta' => [
                    'current_page' => $paginatedRecords->currentPage(),
                    'last_page' => $paginatedRecords->lastPage(),
                    'total' => $paginatedRecords->total(),
                    'per_page' => $paginatedRecords->perPage()
                ]
            ]
        ], 'Income reports retrieved successfully.');
    }

    public function export(Request $request)
    {
        $user = $request->user();
        if (!$user->roles()->where('name', 'admin')->exists()) {
            return $this->error('Unauthorized', 403);
        }

        $query = ServiceRecord::with(['customer', 'acUnit']);

        // Filters (Same as income method)
        if ($request->filled('customer_id')) {
            $query->where('customer_id', $request->customer_id);
        }
        if ($request->filled('ac_unit_id')) {
            $query->where('ac_unit_id', $request->ac_unit_id);
        }
        if ($request->filled('staff_id')) {
            $query->where('assign_staff', $request->staff_id);
        }

        $dateRange = $request->input('date_range', 'all');
        $startDate = null;
        $endDate = Carbon::now()->endOfDay();

        if ($dateRange === 'daily') {
            $startDate = Carbon::now()->subDays(15)->startOfDay();
        } elseif ($dateRange === 'weekly') {
            $startDate = Carbon::now()->subWeeks(12)->startOfDay();
        } elseif ($dateRange === 'yearly') {
            $startDate = Carbon::now()->startOfYear();
        } elseif ($dateRange === 'custom') {
            if ($request->filled('start_date')) {
                $startDate = Carbon::parse($request->start_date)->startOfDay();
            }
            if ($request->filled('end_date')) {
                $endDate = Carbon::parse($request->end_date)->endOfDay();
            }
        } elseif ($dateRange === 'all') {
            $startDate = null;
            $endDate = null;
        } else {
            $startDate = null;
            $endDate = null;
        }

        if ($startDate) {
            $query->where('service_date', '>=', $startDate);
        }
        if ($endDate) {
            $query->where('service_date', '<=', $endDate);
        }

        $records = $query->orderBy('id', 'desc')->get();
        $totalBilled = $records->sum('total_amount');
        $totalPaid = $records->where('payment_status', 'paid')->sum('total_amount');
        $totalPending = $totalBilled - $totalPaid;

        $format = $request->input('format', 'csv');

        if ($format === 'pdf') {
            $pdf = \Barryvdh\DomPDF\Facade\Pdf::loadView('reports.pdf', compact('records', 'totalBilled', 'totalPaid', 'totalPending', 'startDate', 'endDate'));
            return $pdf->download('Service_Income_Report.pdf');
        }

        // CSV Export
        $fileName = 'Service_Income_Report.csv';
        $headers = [
            "Content-type"        => "text/csv",
            "Content-Disposition" => "attachment; filename=$fileName",
            "Pragma"              => "no-cache",
            "Cache-Control"       => "must-revalidate, post-check=0, pre-check=0",
            "Expires"             => "0"
        ];

        $columns = ['Service #', 'Customer', 'AC Unit', 'Date', 'Total Billed', 'Status', 'Payment Status'];

        $callback = function() use($records, $columns) {
            $file = fopen('php://output', 'w');
            fputcsv($file, $columns);

            foreach ($records as $row) {
                fputcsv($file, [
                    $row->service_number,
                    $row->customer ? $row->customer->name : 'N/A',
                    $row->acUnit ? $row->acUnit->ac_code : 'N/A',
                    Carbon::parse($row->service_date)->format('Y-m-d'),
                    $row->total_amount,
                    $row->status,
                    $row->payment_status
                ]);
            }
            fclose($file);
        };

        return response()->stream($callback, 200, $headers);
    }
}
