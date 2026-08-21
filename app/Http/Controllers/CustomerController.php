<?php

namespace App\Http\Controllers;

use App\Models\Customer;
use App\Http\Requests\StoreCustomerRequest;
use App\Http\Requests\UpdateCustomerRequest;
use App\Models\UserLog;
use App\Traits\ApiResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class CustomerController extends Controller
{
    use ApiResponse;

    /**
     * Get the next dynamic customer code.
     */
    public function getNextCode()
    {
        $lastCustomer = Customer::orderBy('id', 'desc')->first();
        $nextId = $lastCustomer ? $lastCustomer->id + 1 : 1;
        $code = 'CUST-' . str_pad($nextId, 4, '0', STR_PAD_LEFT);
        return response()->json(['success' => true, 'code' => $code]);
    }

    /**
     * Display a listing of the customers.
     */
    public function index(Request $request)
    {
        $query = Customer::query();

        if ($request->filled('search')) {
            $search = $request->input('search');
            $query->where(function ($q) use ($search) {
                $q->where('full_name', 'like', "%{$search}%")
                  ->orWhere('customer_code', 'like', "%{$search}%")
                  ->orWhere('mobile', 'like', "%{$search}%");
            });
        }

        if ($request->has('status')) {
            $query->where('status', $request->input('status'));
        }

        $user = $request->user();
        if (!$user->roles()->where('name', 'admin')->exists() && !$user->hasPermission('customer.view_all')) {
            $query->where(function ($q) use ($user) {
                $q->where('created_by', $user->id)
                  ->orWhere('assign_staff', $user->id);
            });
        }

        $query->orderBy('id', 'desc');
        
        $perPage = $request->input('per_page', 20);
        $customers = $query->paginate($perPage);

        return $this->success([
            'data' => $customers->items(),
            'meta' => [
                'current_page' => $customers->currentPage(),
                'per_page' => $customers->perPage(),
                'total' => $customers->total(),
                'last_page' => $customers->lastPage(),
            ]
        ], 'Customers retrieved successfully.');
    }

    /**
     * Store a newly created customer.
     */
    public function store(StoreCustomerRequest $request)
    {
        $data = $request->validated();
        
        if ($request->hasFile('image')) {
            $file = $request->file('image');
            $filename = 'customer_' . time() . '_' . \Illuminate\Support\Str::random(5) . '.' . $file->getClientOriginalExtension();
            
            $file->move(public_path('storage/customers'), $filename);
            
            $data['image'] = '/storage/customers/' . $filename;
        }

        $user = $request->user();
        $data['created_by'] = $user->id;
        $data['updated_by'] = $user->id;
        if (!$user->roles()->where('name', 'admin')->exists()) {
            $data['assign_staff'] = $user->id;
        }

        $customer = Customer::create($data);
        
        if ($user->roles()->where('name', 'admin')->exists() && isset($data['assign_staff'])) {
            $staff = \App\Models\User::find($data['assign_staff']);
            if ($staff) {
                $staff->notify(new \App\Notifications\StaffAssignedNotification('Customer', $customer->full_name, '/customers'));
            }
        }
        
        UserLog::create([
            'user_id' => Auth::id() ?? 1, // Fallback for testing without auth
            'module' => 'Customer',
            'action' => 'ADD',
            'message' => 'Created a Customer ' . $customer->full_name
        ]);

        return $this->success($customer, 'Customer created successfully.', 201);
    }

    /**
     * Display the specified customer.
     */
    public function show(Customer $customer)
    {
        $customer->load('acUnits');
        return $this->success($customer, 'Customer retrieved successfully.');
    }

    /**
     * Update the specified customer.
     */
    public function update(UpdateCustomerRequest $request, Customer $customer)
    {
        $data = $request->validated();
        
        if ($request->hasFile('image')) {
            $file = $request->file('image');
            $filename = 'customer_' . $customer->id . '_' . time() . '.' . $file->getClientOriginalExtension();
            
            $file->move(public_path('storage/customers'), $filename);
            
            if ($customer->image) {
                $oldImagePath = public_path(ltrim($customer->image, '/'));
                if (file_exists($oldImagePath) && is_file($oldImagePath)) {
                    @unlink($oldImagePath);
                }
            }
            
            $data['image'] = '/storage/customers/' . $filename;
        }
        
        $data['updated_by'] = Auth::id();
        
        $oldStaffId = $customer->assign_staff;

        $customer->update($data);

        $user = $request->user();
        if ($user->roles()->where('name', 'admin')->exists() && isset($data['assign_staff']) && $data['assign_staff'] != $oldStaffId) {
            $staff = \App\Models\User::find($data['assign_staff']);
            if ($staff) {
                $staff->notify(new \App\Notifications\StaffAssignedNotification('Customer', $customer->full_name, '/customers'));
            }
        }
        
        UserLog::create([
            'user_id' => Auth::id() ?? 1,
            'module' => 'Customer',
            'action' => 'UPDATE',
            'message' => 'Updated a Customer ' . $customer->full_name
        ]);

        return $this->success($customer, 'Customer updated successfully.');
    }

    /**
     * Remove the specified customer.
     */
    public function destroy(Customer $customer)
    {
        $name = $customer->full_name;
        $customer->delete();
        
        UserLog::create([
            'user_id' => Auth::id() ?? 1,
            'module' => 'Customer',
            'action' => 'DELETE',
            'message' => 'Deleted a Customer ' . $name
        ]);

        return $this->success(null, 'Customer deleted successfully.');
    }
}
