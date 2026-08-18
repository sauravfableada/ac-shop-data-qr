<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class UserLogController extends Controller
{
    public function index()
    {
        $logs = \App\Models\UserLog::with('user')->orderBy('created_at', 'desc')->get();
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
        \App\Models\UserLog::truncate();
        return response()->json(['success' => true, 'message' => 'All logs cleared']);
    }
}
