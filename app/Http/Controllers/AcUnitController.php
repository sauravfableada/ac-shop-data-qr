<?php

namespace App\Http\Controllers;

use App\Models\AcUnit;
use App\Http\Requests\StoreAcUnitRequest;
use App\Http\Requests\UpdateAcUnitRequest;
use App\Traits\ApiResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class AcUnitController extends Controller
{
    use ApiResponse;

    public function getNextCode()
    {
        $lastAc = AcUnit::withTrashed()->orderBy('id', 'desc')->first();
        $nextId = $lastAc ? $lastAc->id + 1 : 1;
        $code = 'AC-' . date('Y') . '-' . str_pad($nextId, 6, '0', STR_PAD_LEFT);
        
        return response()->json([
            'success' => true,
            'code' => $code
        ]);
    }

    /**
     * Display a listing of the ac units.
     */
    public function index(Request $request)
    {
        $query = AcUnit::with(['customer', 'qrCode']);

        if ($request->has('search')) {
            $search = $request->input('search');
            $query->where('ac_code', 'like', "%{$search}%")
                  ->orWhere('brand', 'like', "%{$search}%")
                  ->orWhere('model', 'like', "%{$search}%");
        }

        if ($request->has('status')) {
            $query->where('status', $request->input('status'));
        }

        $user = $request->user();
        if (!$user->roles()->where('name', 'admin')->exists() && !$user->hasPermission('ac.view_all')) {
            $query->where(function ($q) use ($user) {
                $q->where('created_by', $user->id)
                  ->orWhere('assign_staff', $user->id);
            });
        }

        $query->orderBy('id', 'desc');
        
        $perPage = $request->input('per_page', 20);
        $acUnits = $query->paginate($perPage);

        return $this->success([
            'data' => $acUnits->items(),
            'meta' => [
                'current_page' => $acUnits->currentPage(),
                'per_page' => $acUnits->perPage(),
                'total' => $acUnits->total(),
                'last_page' => $acUnits->lastPage(),
            ]
        ], 'AC Units retrieved successfully.');
    }

    /**
     * Store a newly created ac unit.
     */
    public function store(StoreAcUnitRequest $request)
    {
        $data = $request->validated();
        
        $user = $request->user();
        $data['created_by'] = $user->id;
        $data['updated_by'] = $user->id;
        if (!$user->roles()->where('name', 'admin')->exists()) {
            $data['assign_staff'] = $user->id;
        }

        $acUnit = AcUnit::create($data);
        
        if ($user->roles()->where('name', 'admin')->exists() && isset($data['assign_staff'])) {
            $staff = \App\Models\User::find($data['assign_staff']);
            if ($staff) {
                $staff->notify(new \App\Notifications\StaffAssignedNotification('AC Unit', $acUnit->ac_code, '/ac-units'));
            }
        }
        
        // Generate secure QR token automatically in ac_qr_codes
        $acUnit->qrCode()->create([
            'token' => Str::uuid()->toString(),
        ]);

        \App\Models\UserLog::create([
            'user_id' => \Illuminate\Support\Facades\Auth::id() ?? 1,
            'module' => 'AC-Unit',
            'action' => 'CREATE',
            'message' => 'Created AC Unit with code: ' . $acUnit->ac_code
        ]);

        return $this->success($acUnit->load('qrCode'), 'AC Unit created successfully.', 201);
    }

    /**
     * Display the specified ac unit.
     */
    public function show(AcUnit $acUnit)
    {
        $acUnit->load(['customer', 'qrCode']);
        return $this->success($acUnit, 'AC Unit retrieved successfully.');
    }

    /**
     * Update the specified ac unit.
     */
    public function update(UpdateAcUnitRequest $request, AcUnit $acUnit)
    {
        $data = $request->validated();
        $data['updated_by'] = \Illuminate\Support\Facades\Auth::id();
        
        $oldStaffId = $acUnit->assign_staff;

        $acUnit->update($data);

        $user = $request->user();
        if ($user->roles()->where('name', 'admin')->exists() && isset($data['assign_staff']) && $data['assign_staff'] != $oldStaffId) {
            $staff = \App\Models\User::find($data['assign_staff']);
            if ($staff) {
                $staff->notify(new \App\Notifications\StaffAssignedNotification('AC Unit', $acUnit->ac_code, '/ac-units'));
            }
        }

        \App\Models\UserLog::create([
            'user_id' => \Illuminate\Support\Facades\Auth::id() ?? 1,
            'module' => 'AC-Unit',
            'action' => 'UPDATE',
            'message' => 'Updated AC Unit: ' . $acUnit->ac_code
        ]);

        return $this->success($acUnit, 'AC Unit updated successfully.');
    }

    /**
     * Remove the specified ac unit.
     */
    public function destroy(AcUnit $acUnit)
    {
        $acCode = $acUnit->ac_code;
        $acUnit->delete();

        \App\Models\UserLog::create([
            'user_id' => \Illuminate\Support\Facades\Auth::id() ?? 1,
            'module' => 'AC-Unit',
            'action' => 'DELETE',
            'message' => 'Deleted AC Unit: ' . $acCode
        ]);

        return $this->success(null, 'AC Unit deleted successfully.');
    }
}
