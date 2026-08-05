<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class CafeOrder extends Model
{
    use HasFactory;

    protected $fillable = [
        'client_id',
        'total_amount',
        'order_date',
        'status',
        'items_summary',
    ];

    protected $casts = [
        'order_date'   => 'date',
        'total_amount' => 'decimal:2',
    ];

    public function client(): BelongsTo
    {
        return $this->belongsTo(Client::class);
    }
}
