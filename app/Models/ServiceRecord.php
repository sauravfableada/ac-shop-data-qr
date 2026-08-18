<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

use Illuminate\Database\Eloquent\SoftDeletes;

class ServiceRecord extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'service_number', 'customer_id', 'ac_unit_id', 'staff_id', 'service_type',
        'service_date', 'complaint', 'diagnosis', 'work_performed', 'status',
        'labor_charge', 'parts_charge', 'discount', 'tax', 'total_amount',
        'payment_status', 'next_service_date', 'technician_notes', 'customer_notes'
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
        return $this->belongsTo(User::class, 'staff_id');
    }

    public function parts()
    {
        return $this->hasMany(ServicePart::class, 'service_id');
    }

    public function images()
    {
        return $this->hasMany(ServiceImage::class, 'service_id');
    }
}
