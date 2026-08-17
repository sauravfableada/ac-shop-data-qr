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
