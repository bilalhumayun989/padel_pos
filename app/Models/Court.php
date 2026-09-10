<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Court extends Model
{
    use HasFactory;

    protected $fillable = [
        'location',
        'capacity',
        'surface',
        'lights',
        'description',
        'image',

        'name',
        'type',
        'hourly_rate',
        'status',
        'is_demo',
    ];

    protected $casts = [
        'hourly_rate' => 'decimal:2',
    ];

    public function bookings(): HasMany
    {
        return $this->hasMany(Booking::class);
    }
}
