<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Setting;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;

class SettingController extends Controller
{
    public function index()
    {
        $settings = Setting::pluck('value', 'key')->toArray();
        return response()->json(['success' => true, 'data' => $settings]);
    }

    public function store(Request $request)
    {
        try {
            $data = $request->except(['company_logo', 'company_favicon']);

            foreach ($data as $key => $value) {
                Setting::updateOrCreate(
                    ['key' => $key],
                    ['value' => $value]
                );
            }

            if ($request->hasFile('company_logo')) {
                $file = $request->file('company_logo');
                $filename = 'logo_' . time() . '.' . $file->getClientOriginalExtension();
                $path = '/uploads/settings/' . $filename;
                $file->move(public_path('uploads/settings'), $filename);
                
                Setting::updateOrCreate(
                    ['key' => 'company_logo'],
                    ['value' => $path]
                );
            }

            if ($request->hasFile('company_favicon')) {
                $file = $request->file('company_favicon');
                $filename = 'favicon_' . time() . '.' . $file->getClientOriginalExtension();
                $path = '/uploads/settings/' . $filename;
                $file->move(public_path('uploads/settings'), $filename);
                
                Setting::updateOrCreate(
                    ['key' => 'company_favicon'],
                    ['value' => $path]
                );
            }

            $settings = Setting::pluck('value', 'key')->toArray();
            return response()->json(['success' => true, 'message' => 'Settings saved successfully', 'data' => $settings]);

        } catch (\Exception $e) {
            Log::error("Error saving settings: " . $e->getMessage());
            return response()->json(['success' => false, 'message' => 'Failed to save settings: ' . $e->getMessage()], 500);
        }
    }
}
