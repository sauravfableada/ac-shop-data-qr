<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class AcUnit extends Model
{
    /** @use HasFactory<\Database\Factories\AcUnitFactory> */
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'created_by', 'updated_by', 'assign_staff', 'customer_id', 'ac_code', 'brand', 'model', 'serial_number', 'ac_type',
        'capacity', 'inverter_type', 'installation_date', 'purchase_date',
        'warranty_start_date', 'warranty_end_date', 'installation_location',
        'floor', 'room', 'indoor_unit_number', 'outdoor_unit_number',
        'current_condition', 'status', 'notes'
    ];

    public function customer()
    {
        return $this->belongsTo(Customer::class);
    }

    public function qrCode()
    {
        return $this->hasOne(AcQrCode::class);
    }

    public function serviceRecords()
    {
        return $this->hasMany(ServiceRecord::class);
    }
}
