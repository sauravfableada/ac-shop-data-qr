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

    /**
     * Display a listing of the ac units.
     */
    public function index(Request $request)
    {
        $query = AcUnit::with('customer');

        if ($request->has('search')) {
            $search = $request->input('search');
            $query->where('ac_code', 'like', "%{$search}%")
                  ->orWhere('brand', 'like', "%{$search}%")
                  ->orWhere('model', 'like', "%{$search}%");
        }

        if ($request->has('status')) {
            $query->where('status', $request->input('status'));
        }

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
        // Generate secure QR token automatically
        $data['qr_token'] = Str::uuid()->toString();

        $acUnit = AcUnit::create($data);
        return $this->success($acUnit, 'AC Unit created successfully.', 201);
    }

    /**
     * Display the specified ac unit.
     */
    public function show(AcUnit $acUnit)
    {
        $acUnit->load('customer');
        return $this->success($acUnit, 'AC Unit retrieved successfully.');
    }

    /**
     * Update the specified ac unit.
     */
    public function update(UpdateAcUnitRequest $request, AcUnit $acUnit)
    {
        $acUnit->update($request->validated());
        return $this->success($acUnit, 'AC Unit updated successfully.');
    }

    /**
     * Remove the specified ac unit.
     */
    public function destroy(AcUnit $acUnit)
    {
        $acUnit->delete();
        return $this->success(null, 'AC Unit deleted successfully.');
    }
}
