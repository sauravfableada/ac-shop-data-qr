<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AcUnit extends Model
{
    /** @use HasFactory<\Database\Factories\AcUnitFactory> */
    use HasFactory;

    protected $fillable = [
        'ac_code', 'customer_id', 'qr_token', 'brand', 'model', 'serial_number',
        'ac_type', 'capacity', 'is_inverter', 'installation_date', 'warranty',
        'location', 'room', 'floor', 'indoor_unit_number', 'outdoor_unit_number',
        'condition', 'status'
    ];

    public function customer()
    {
        return $this->belongsTo(Customer::class);
    }
}
