<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class StockItem extends Model
{
    use HasFactory;

    protected $fillable = [
        'supplier_id',
        'cost',
        'image',
        'active',

        'name',
        'category',
        'quantity',
        'min_quantity',
        'unit_price',
        'unit',
        'status',
        'is_demo',
    ];

    public function supplier() { return $this->belongsTo(Supplier::class); }

    protected $casts = [
        'active' => 'boolean',
        'cost' => 'float',
        'quantity'     => 'integer',
        'min_quantity' => 'integer',
        'unit_price'   => 'decimal:2',
    ];
}
