<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

use Illuminate\Database\Eloquent\SoftDeletes;

class ServiceRecord extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'created_by', 'updated_by', 'service_number', 'customer_id', 'ac_unit_id', 'assign_staff', 'service_type',
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
        return $this->belongsTo(User::class, 'assign_staff');
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
