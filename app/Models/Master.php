<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Master extends Model
{
    use \Illuminate\Database\Eloquent\SoftDeletes;

    protected $fillable = [
        'type', 'name', 'status', 'created_by', 'updated_by', 'deleted_by'
    ];

    public function creator()
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function updater()
    {
        return $this->belongsTo(User::class, 'updated_by');
    }

    public function deleter()
    {
        return $this->belongsTo(User::class, 'deleted_by');
    }
}
