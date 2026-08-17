<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Traits\ApiResponse;

class AuthController extends Controller
{
    use ApiResponse;

    /**
     * Handle user login.
     */
    public function login(Request $request)
    {
        $credentials = $request->validate([
            'email' => 'required|email',
            'password' => 'required'
        ]);

        if (Auth::attempt($credentials)) {
            $user = Auth::user();
            
            // Get user's active role if needed (assuming single active role for simplicity)
            $role = $user->roles()->first();
            
            $data = [
                'user' => [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'role' => $role ? $role->name : null,
                ],
                'token' => $user->createToken('authToken')->accessToken,
                'token_type' => 'Bearer'
            ];
            
            return $this->success($data, 'Login successful.');
        }

        return $this->error('Unauthorized.', ['credentials' => 'Invalid email or password.'], 401);
    }

    /**
     * Handle user logout.
     */
    public function logout(Request $request)
    {
        $request->user()->token()->revoke();
        return $this->success([], 'Logged out successfully.');
    }

    /**
     * Get the authenticated user info.
     */
    public function me(Request $request)
    {
        $user = $request->user()->load(['roles', 'permissions']);
        
        // Collect all permissions user has access to
        $allPermissions = $user->permissions->pluck('name')->toArray();
        foreach ($user->roles as $role) {
            $rolePerms = $role->permissions->pluck('name')->toArray();
            $allPermissions = array_merge($allPermissions, $rolePerms);
        }
        $allPermissions = array_unique($allPermissions);

        return $this->success([
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'roles' => $user->roles->pluck('name'),
                'permissions' => array_values($allPermissions)
            ]
        ], 'User details retrieved successfully.');
    }
}
