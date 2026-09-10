<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Client extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'email',
        'phone',
        'status',
        'last_visit',
        'avatar',
        'is_demo',
    ];

    protected $casts = [
        'last_visit' => 'date',
    ];

    public function memberships() { return $this->hasMany(Membership::class); }

    public function bookings(): HasMany
    {
        return $this->hasMany(Booking::class);
    }

    public function cafeOrders(): HasMany
    {
        return $this->hasMany(CafeOrder::class);
    }

    public function getStatusBadgeColorAttribute(): string
    {
        return match($this->status) {
            'active'   => 'lime',
            'paused'   => 'yellow',
            'inactive' => 'red',
            default    => 'gray',
        };
    }
}
