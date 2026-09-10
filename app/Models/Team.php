<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Team extends Model
{
    use HasFactory;

    protected $fillable = [
        'captain',
        'skill_level',
        'wins',
        'losses',

        'name',
        'max_players',
        'color',
        'status',
        'is_demo',
    ];

    public function players(): HasMany
    {
        return $this->hasMany(Player::class);
    }

    public function getActivePlayersCountAttribute(): int
    {
        return $this->players()->where('status', 'active')->count();
    }
}
