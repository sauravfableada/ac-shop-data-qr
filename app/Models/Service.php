<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Service extends Model
{
    /** @use HasFactory<\Database\Factories\ServiceFactory> */
    use HasFactory;

    protected $fillable = [
        'service_number', 'customer_id', 'ac_unit_id', 'technician_id',
        'service_date', 'service_type', 'complaint', 'diagnosis', 'work_performed',
        'status', 'labor_charge', 'parts_charge', 'discount', 'tax', 'total',
        'payment_status', 'next_service_date', 'notes'
    ];

    public function customer()
    {
        return $this->belongsTo(Customer::class);
    }

    public function acUnit()
    {
        return $this->belongsTo(AcUnit::class);
    }

    public function technician()
    {
        return $this->belongsTo(User::class, 'technician_id');
    }

    public function parts()
    {
        return $this->hasMany(ServicePart::class);
    }

    public function images()
    {
        return $this->hasMany(ServiceImage::class);
    }
}
