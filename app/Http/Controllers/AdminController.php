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
            $path = $request->file('profile_image')->store('public/avatars');
            $data['profile_image'] = \Illuminate\Support\Facades\Storage::url($path);
        }

        $user = User::create($data);

        // Default role is staff (ID 2)
        $user->roles()->sync([2]);

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
            $path = $request->file('profile_image')->store('public/avatars');
            $data['profile_image'] = \Illuminate\Support\Facades\Storage::url($path);
        }

        $user->update($data);
        
        // Ensure they retain the staff role
        if ($user->roles->isEmpty()) {
            $user->roles()->sync([2]);
        }

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
