<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use App\Traits\ApiResponse;

class CheckPermission
{
    use ApiResponse;

    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next, $permissionName): Response
    {
        if (! $request->user()) {
            return $this->error('Unauthenticated.', [], 401);
        }

        // Allow 'admin' role to bypass permission checks
        if ($request->user()->roles()->where('name', 'admin')->exists()) {
            return $next($request);
        }

        // Allow 'staff' role to perform daily operational tasks (view, create, edit)
        if ($request->user()->roles()->where('name', 'staff')->exists()) {
            $allowedStaffPermissions = [
                'customer.view', 'customer.create', 'customer.edit',
                'ac.view', 'ac.create', 'ac.edit',
                'service.view', 'service.create', 'service.edit',
                'spare_parts.view', 'spare_parts.create', 'spare_parts.edit',
                'dashboard.staff', 'qr.view'
            ];
            if (in_array($permissionName, $allowedStaffPermissions)) {
                return $next($request);
            }
        }

        if (! $request->user()->hasPermission($permissionName)) {
            return $this->error('Unauthorized action.', ['permission' => "You do not have the {$permissionName} permission."], 403);
        }

        return $next($request);
    }
}
