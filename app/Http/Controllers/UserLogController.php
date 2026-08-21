<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class UserLogController extends Controller
{
    public function index()
    {
        $user = Auth::user();

        $query = \App\Models\UserLog::with('user')->orderBy('created_at', 'desc');

        // Admin sees all logs; staff sees only their own
        $isAdmin = $user && $user->roles()->where('name', 'admin')->exists();
        if (!$isAdmin) {
            $query->where('user_id', $user->id);
        }

        $logs = $query->get();
        return response()->json(['success' => true, 'data' => $logs]);
    }

    public function destroy($id)
    {
        $log = \App\Models\UserLog::findOrFail($id);
        $log->delete();
        return response()->json(['success' => true, 'message' => 'Log deleted']);
    }

    public function clearAll()
    {
        $user = Auth::user();

        // Admin clears all; staff clears only their own
        $isAdmin = $user && $user->roles()->where('name', 'admin')->exists();
        if ($isAdmin) {
            \App\Models\UserLog::truncate();
        } else {
            \App\Models\UserLog::where('user_id', $user->id)->delete();
        }

        return response()->json(['success' => true, 'message' => 'Logs cleared']);
    }
}
