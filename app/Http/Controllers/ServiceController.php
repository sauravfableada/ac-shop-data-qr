<?php

namespace App\Http\Controllers;

use App\Models\Service;
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
        $query = Service::with(['customer', 'acUnit', 'technician']);

        if ($request->has('status')) {
            $query->where('status', $request->input('status'));
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
        $data['service_number'] = 'SRV-' . date('Y') . '-' . str_pad(Service::count() + 1, 5, '0', STR_PAD_LEFT);

        $service = Service::create($data);
        return $this->success($service, 'Service created successfully.', 201);
    }

    public function show(Service $service)
    {
        $service->load(['customer', 'acUnit', 'technician', 'parts.sparePart', 'images']);
        return $this->success($service, 'Service retrieved successfully.');
    }

    public function update(UpdateServiceRequest $request, Service $service)
    {
        $service->update($request->validated());
        return $this->success($service, 'Service updated successfully.');
    }

    public function destroy(Service $service)
    {
        $service->delete();
        return $this->success(null, 'Service deleted successfully.');
    }
    
    // Assign Staff
    public function assignStaff(Request $request, Service $service)
    {
        $request->validate(['technician_id' => 'required|exists:users,id']);
        $service->update(['technician_id' => $request->technician_id, 'status' => 'assigned']);
        return $this->success($service, 'Staff assigned successfully.');
    }

    // Upload Images
    public function uploadImages(Request $request, Service $service)
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
        $history = Service::where('ac_unit_id', $id)
            ->with(['technician', 'parts.sparePart', 'images'])
            ->orderBy('service_date', 'desc')
            ->get();
            
        return $this->success($history, 'AC service history retrieved successfully.');
    }
}
