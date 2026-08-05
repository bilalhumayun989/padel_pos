<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class StockItem extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'category',
        'quantity',
        'min_quantity',
        'unit_price',
        'unit',
        'status',
    ];

    protected $casts = [
        'quantity'     => 'integer',
        'min_quantity' => 'integer',
        'unit_price'   => 'decimal:2',
    ];
}
