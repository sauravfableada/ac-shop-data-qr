<?php

namespace App\Http\Controllers;

use App\Models\SparePart;
use App\Http\Requests\StoreSparePartRequest;
use App\Http\Requests\UpdateSparePartRequest;
use App\Traits\ApiResponse;
use Illuminate\Http\Request;

class SparePartController extends Controller
{
    use ApiResponse;

    /**
     * Display a listing of the spare parts.
     */
    public function index(Request $request)
    {
        $query = SparePart::query();

        if ($request->has('search')) {
            $search = $request->input('search');
            $query->where('name', 'like', "%{$search}%")
                  ->orWhere('part_code', 'like', "%{$search}%");
        }

        $perPage = $request->input('per_page', 20);
        $spareParts = $query->paginate($perPage);

        return $this->success([
            'data' => $spareParts->items(),
            'meta' => [
                'current_page' => $spareParts->currentPage(),
                'per_page' => $spareParts->perPage(),
                'total' => $spareParts->total(),
                'last_page' => $spareParts->lastPage(),
            ]
        ], 'Spare Parts retrieved successfully.');
    }

    /**
     * Store a newly created spare part.
     */
    public function store(StoreSparePartRequest $request)
    {
        $sparePart = SparePart::create($request->validated());
        return $this->success($sparePart, 'Spare Part created successfully.', 201);
    }

    /**
     * Display the specified spare part.
     */
    public function show(SparePart $sparePart)
    {
        return $this->success($sparePart, 'Spare Part retrieved successfully.');
    }

    /**
     * Update the specified spare part.
     */
    public function update(UpdateSparePartRequest $request, SparePart $sparePart)
    {
        $sparePart->update($request->validated());
        return $this->success($sparePart, 'Spare Part updated successfully.');
    }

    /**
     * Remove the specified spare part.
     */
    public function destroy(SparePart $sparePart)
    {
        $sparePart->delete();
        return $this->success(null, 'Spare Part deleted successfully.');
    }
}
