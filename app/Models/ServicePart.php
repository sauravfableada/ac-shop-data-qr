<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ServicePart extends Model
{
    protected $fillable = [
        'service_id', 'spare_part_id', 'quantity', 'unit_price', 'total_price'
    ];

    public function serviceRecord()
    {
        return $this->belongsTo(ServiceRecord::class, 'service_id');
    }

    public function sparePart()
    {
        return $this->belongsTo(SparePart::class);
    }
}
