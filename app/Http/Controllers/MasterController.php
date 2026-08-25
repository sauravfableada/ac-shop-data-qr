<?php

namespace App\Http\Controllers;

use App\Models\Master;
use Illuminate\Http\Request;

class MasterController extends Controller
{
    use \App\Traits\ApiResponse;

    public function index(Request $request)
    {
        $query = Master::with(['creator:id,name', 'updater:id,name']);

        if ($request->has('type')) {
            $query->where('type', $request->type);
        }
        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        $masters = $query->orderBy('name', 'asc')->get();
        return $this->success($masters, 'Masters retrieved successfully.');
    }

    public function store(Request $request)
    {
        $request->validate([
            'type' => 'required|string|max:50',
            'name' => [
                'required',
                'string',
                'max:255',
                \Illuminate\Validation\Rule::unique('masters')->where(function ($query) use ($request) {
                    return $query->where('type', $request->type);
                })
            ],
            'status' => 'nullable|in:active,inactive'
        ], [
            'name.unique' => 'This option already exists for this type.'
        ]);

        $master = Master::create([
            'type' => $request->type,
            'name' => $request->name,
            'status' => $request->status ?? 'active',
            'created_by' => $request->user()->id
        ]);

        // Send notification to admins if created by staff
        if ($request->user()->role === 'staff') {
            $admins = \App\Models\User::where('role', 'admin')->get();
            foreach ($admins as $admin) {
                $admin->notify(new \App\Notifications\MasterCreatedNotification($master, $request->user()));
            }
        }

        return $this->success($master, 'Master created successfully.', 201);
    }

    public function update(Request $request, $id)
    {
        $master = Master::findOrFail($id);

        $request->validate([
            'name' => [
                'sometimes',
                'required',
                'string',
                'max:255',
                \Illuminate\Validation\Rule::unique('masters')->where(function ($query) use ($master) {
                    return $query->where('type', $master->type);
                })->ignore($master->id)
            ],
            'status' => 'nullable|in:active,inactive'
        ], [
            'name.unique' => 'This option already exists for this type.'
        ]);

        if ($request->has('name')) $master->name = $request->name;
        if ($request->has('status')) $master->status = $request->status;
        $master->updated_by = $request->user()->id;
        $master->save();

        return $this->success($master, 'Master updated successfully.');
    }

    public function destroy(Request $request, $id)
    {
        $master = Master::findOrFail($id);
        
        $master->deleted_by = $request->user()->id;
        $master->save();
        $master->delete();

        return $this->success(null, 'Master deleted successfully.');
    }
}
