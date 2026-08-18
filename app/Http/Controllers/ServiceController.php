<?php

namespace App\Http\Controllers;

use App\Models\ServiceRecord;
use App\Models\ServiceImage;
use App\Models\ServicePart;
use App\Models\AcUnit;
use App\Http\Requests\StoreServiceRequest;
use App\Http\Requests\UpdateServiceRequest;
use App\Traits\ApiResponse;
use Illuminate\Http\Request;

class ServiceController extends Controller
{
    use ApiResponse;

    public function index(Request $request)
    {
        $query = ServiceRecord::with(['customer', 'acUnit', 'technician']);

        if ($request->has('status')) {
            $query->where('status', $request->input('status'));
        }

        if ($request->has('search')) {
            $search = $request->input('search');
            $query->where(function ($q) use ($search) {
                $q->where('service_number', 'like', "%{$search}%")
                  ->orWhere('service_type', 'like', "%{$search}%")
                  ->orWhere('complaint', 'like', "%{$search}%")
                  ->orWhereHas('customer', function ($cq) use ($search) {
                      $cq->where('full_name', 'like', "%{$search}%");
                  });
            });
        }
        
        // If logged-in user is a staff/technician and not admin, only show their services (unless they have global view perm)
        $user = $request->user();
        if (!$user->roles()->where('name', 'admin')->exists() && !$user->hasPermission('service.view_all')) {
            $query->where('technician_id', $user->id);
        }

        $perPage = $request->input('per_page', 20);
        $services = $query->orderBy('created_at', 'desc')->paginate($perPage);

        return $this->success([
            'data' => $services->items(),
            'meta' => [
                'current_page' => $services->currentPage(),
                'per_page' => $services->perPage(),
                'total' => $services->total(),
                'last_page' => $services->lastPage(),
            ]
        ], 'Services retrieved successfully.');
    }

    public function store(StoreServiceRequest $request)
    {
        // Auto-generate service number
        $data = $request->validated();
        $data['service_number'] = 'SRV-' . date('Y') . '-' . str_pad(ServiceRecord::count() + 1, 5, '0', STR_PAD_LEFT);

        $service = ServiceRecord::create($data);
        return $this->success($service, 'Service created successfully.', 201);
    }

    public function show(ServiceRecord $service)
    {
        $service->load(['customer', 'acUnit', 'technician', 'parts.sparePart', 'images']);
        return $this->success($service, 'Service retrieved successfully.');
    }

    public function update(UpdateServiceRequest $request, ServiceRecord $service)
    {
        $service->update($request->validated());
        return $this->success($service, 'Service updated successfully.');
    }

    public function destroy(ServiceRecord $service)
    {
        $service->delete();
        return $this->success(null, 'Service deleted successfully.');
    }
    
    // Assign Staff
    public function assignStaff(Request $request, ServiceRecord $service)
    {
        $request->validate(['technician_id' => 'required|exists:users,id']);
        $service->update(['technician_id' => $request->technician_id, 'status' => 'assigned']);
        return $this->success($service, 'Staff assigned successfully.');
    }

    // Upload Images
    public function uploadImages(Request $request, ServiceRecord $service)
    {
        $request->validate([
            'images.*' => 'required|image|mimes:jpeg,png,jpg,gif|max:5120', // 5MB max
            'type' => 'required|in:before,after,general'
        ]);

        $uploaded = [];
        if($request->hasfile('images')) {
            foreach($request->file('images') as $file) {
                $path = $file->store('services/' . $service->id, 'public');
                $uploaded[] = ServiceImage::create([
                    'service_id' => $service->id,
                    'image_path' => $path,
                    'type' => $request->type
                ]);
            }
        }

        return $this->success($uploaded, 'Images uploaded successfully.');
    }
    
    // Service Timeline (AC Unit History)
    public function acServiceHistory($id)
    {
        $history = ServiceRecord::where('ac_unit_id', $id)
            ->with(['technician', 'parts.sparePart', 'images'])
            ->orderBy('service_date', 'desc')
            ->get();
            
        return $this->success($history, 'AC service history retrieved successfully.');
    }

    // Service Timeline (Customer History)
    public function customerServiceHistory($id)
    {
        $history = ServiceRecord::where('customer_id', $id)
            ->with(['acUnit', 'technician', 'parts.sparePart', 'images'])
            ->orderBy('service_date', 'desc')
            ->get();
            
        return $this->success($history, 'Customer service history retrieved successfully.');
    }
}
