<?php

use Illuminate\Support\Facades\Route;

Route::get('/qr-card/{token}', function ($token) {
    $qrCode = \App\Models\AcQrCode::where('token', $token)->first();
    if (!$qrCode) abort(404);
    
    $acUnit = \App\Models\AcUnit::with('customer')->find($qrCode->ac_unit_id);
    if (!$acUnit) abort(404);

    $settings = \App\Models\Setting::pluck('value', 'key')->toArray();
    $codeType = $settings['code_type'] ?? 'qr';

    return view('qr_card', compact('acUnit', 'token', 'codeType'));
});

Route::get('/{any}', function () {
    $settings = \App\Models\Setting::pluck('value', 'key')->toArray();
    if (isset($settings['company_logo']) && strpos($settings['company_logo'], 'http') === false) {
        $settings['company_logo'] = public_asset($settings['company_logo']);
    }
    if (isset($settings['company_favicon']) && strpos($settings['company_favicon'], 'http') === false) {
        $settings['company_favicon'] = public_asset($settings['company_favicon']);
    }
    return view('spa', compact('settings'));
})->where('any', '.*');
