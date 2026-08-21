<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Customer extends Model
{
    /** @use HasFactory<\Database\Factories\CustomerFactory> */
    use HasFactory;

    protected $fillable = [
        'created_by', 'updated_by', 'assign_staff', 'customer_code', 'full_name', 'company_name', 'mobile', 'alternate_mobile',
        'email', 'address', 'city', 'state', 'country', 'pincode', 'gst_number',
        'customer_type', 'notes', 'status', 'whatsapp_no', 'image', 'dob'
    ];

    public function acUnits()
    {
        return $this->hasMany(AcUnit::class);
    }

    public function serviceRecords()
    {
        return $this->hasMany(ServiceRecord::class);
    }

    /**
     * Accessor for image to respect PUBLIC_PATH
     */
    public function getImageAttribute($value)
    {
        if ($value && strpos($value, 'http') === false) {
            return public_asset(ltrim($value, '/'));
        }
        return $value;
    }
}
