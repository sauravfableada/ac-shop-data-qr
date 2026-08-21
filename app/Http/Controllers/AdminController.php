<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use App\Models\Permission;
use App\Traits\ApiResponse;

class AdminController extends Controller
{
    use ApiResponse;

    /**
     * Get all staff/users.
     * 
     * GET /api/admin/staff
     */
    public function index()
    {
        // Fetch all users except the admin (assuming ID 1 is the main admin)
        $staff = User::with('roles')->where('id', '!=', 1)->get();
        return $this->success($staff, 'Staff retrieved successfully.');
    }

    /**
     * Get a single staff member by ID.
     * 
     * GET /api/admin/staff/{id}
     */
    public function show($id)
    {
        $staff = User::with('roles', 'permissions')->findOrFail($id);
        return $this->success($staff, 'Staff member retrieved successfully.');
    }

    /**
     * Create a new staff member.
     * 
     * POST /api/admin/staff
     */
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users',
            'password' => 'required|string|min:6',
            'phone' => 'nullable|string',
            'profile_image' => 'nullable|image|max:2048'
        ]);

        $data = [
            'name' => $request->name,
            'email' => $request->email,
            'password' => \Illuminate\Support\Facades\Hash::make($request->password),
            'phone' => $request->phone,
        ];

        if ($request->hasFile('profile_image')) {
            $file = $request->file('profile_image');
            // We don't have $user->id yet, so we use a random string
            $filename = 'avatar_staff_' . time() . '_' . \Illuminate\Support\Str::random(5) . '.' . $file->getClientOriginalExtension();
            
            $file->move(public_path('storage/avatars'), $filename);
            
            $data['profile_image'] = '/storage/avatars/' . $filename;
        }

        $user = User::create($data);

        // Default role is staff (ID 2)
        $user->roles()->sync([2]);

        \App\Models\UserLog::create([
            'user_id' => \Illuminate\Support\Facades\Auth::id() ?? 1,
            'module' => 'Staff',
            'action' => 'CREATE',
            'message' => 'Created a Staff member: ' . $user->name
        ]);

        return $this->success($user, 'Staff created successfully.');
    }

    /**
     * Update a staff member.
     * 
     * PUT /api/admin/staff/{id}
     */
    public function update(Request $request, $id)
    {
        $user = User::findOrFail($id);
        
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email,' . $id,
            'password' => 'nullable|string|min:6',
            'phone' => 'nullable|string',
            'profile_image' => 'nullable|image|max:2048'
        ]);

        $data = [
            'name' => $request->name,
            'email' => $request->email,
            'phone' => $request->phone,
        ];
        
        if ($request->filled('password')) {
            $data['password'] = \Illuminate\Support\Facades\Hash::make($request->password);
        }

        if ($request->hasFile('profile_image')) {
            $file = $request->file('profile_image');
            $filename = 'avatar_' . $user->id . '_' . time() . '.' . $file->getClientOriginalExtension();
            
            $file->move(public_path('storage/avatars'), $filename);
            
            if ($user->profile_image) {
                $oldImagePath = public_path(ltrim($user->profile_image, '/'));
                if (file_exists($oldImagePath) && is_file($oldImagePath)) {
                    @unlink($oldImagePath);
                }
            }
            
            $data['profile_image'] = '/storage/avatars/' . $filename;
        }

        $user->update($data);
        
        // Ensure they retain the staff role
        if ($user->roles->isEmpty()) {
            $user->roles()->sync([2]);
        }

        \App\Models\UserLog::create([
            'user_id' => \Illuminate\Support\Facades\Auth::id() ?? 1,
            'module' => 'Staff',
            'action' => 'UPDATE',
            'message' => 'Updated a Staff member: ' . $user->name
        ]);

        return $this->success($user, 'Staff updated successfully.');
    }

    /**
     * Delete a staff member.
     * 
     * DELETE /api/admin/staff/{id}
     */
    public function destroy($id)
    {
        $user = User::findOrFail($id);
        
        // Prevent deleting the main admin
        if ($user->id === 1) {
            return $this->error('Cannot delete the main admin.', 403);
        }

        $user->delete();

        \App\Models\UserLog::create([
            'user_id' => \Illuminate\Support\Facades\Auth::id() ?? 1,
            'module' => 'Staff',
            'action' => 'DELETE',
            'message' => 'Deleted a Staff member: ' . $user->name
        ]);

        return $this->success(null, 'Staff deleted successfully.');
    }

    /**
     * Assign permissions to a staff member.
     * 
     * PUT /api/admin/staff/{id}/permissions
     */
    public function assignPermissions(Request $request, $id)
    {
        $request->validate([
            'permissions' => 'required|array',
            'permissions.*' => 'string'
        ]);

        $user = User::findOrFail($id);

        // Find permission IDs based on names provided
        $permissionIds = Permission::whereIn('name', $request->permissions)->pluck('id')->toArray();

        // Sync user permissions
        $user->permissions()->sync($permissionIds);

        return $this->success([
            'assigned_permissions' => $request->permissions
        ], 'Permissions assigned to staff successfully.');
    }
}
