<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

use Illuminate\Database\Eloquent\SoftDeletes;

class SparePart extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'part_code', 'name', 'brand', 'category', 'description', 
        'purchase_price', 'selling_price', 'stock_quantity', 'minimum_stock', 
        'unit', 'status'
    ];
}
