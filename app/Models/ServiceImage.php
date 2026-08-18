<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ServiceImage extends Model
{
    protected $fillable = [
        'service_id', 'file_path', 'type'
    ];

    public function serviceRecord()
    {
        return $this->belongsTo(ServiceRecord::class, 'service_id');
    }
}
