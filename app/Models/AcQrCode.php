<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class AcQrCode extends Model
{
    use HasFactory;

    protected $fillable = [
        'ac_unit_id', 'token', 'qr_code_path', 'generated_at', 'last_scanned_at', 'status'
    ];

    public $timestamps = true;

    protected $casts = [
        'generated_at' => 'datetime',
        'last_scanned_at' => 'datetime',
    ];

    public function acUnit()
    {
        return $this->belongsTo(AcUnit::class);
    }
}
