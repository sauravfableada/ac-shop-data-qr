<?php

use Illuminate\Support\Facades\Route;

Route::get('/qr-card/{token}', function ($token) {
    $qrCode = \App\Models\AcQrCode::where('token', $token)->first();
    if (!$qrCode) abort(404);
    
    $acUnit = \App\Models\AcUnit::with('customer')->find($qrCode->ac_unit_id);
    if (!$acUnit) abort(404);

    return view('qr_card', compact('acUnit', 'token'));
});

Route::get('/{any}', function () {
    return view('spa');
})->where('any', '.*');
