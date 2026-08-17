<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ServicePart extends Model
{
    protected $fillable = [
        'service_id', 'spare_part_id', 'quantity', 'price'
    ];

    public function service()
    {
        return $this->belongsTo(Service::class);
    }

    public function sparePart()
    {
        return $this->belongsTo(SparePart::class);
    }
}
