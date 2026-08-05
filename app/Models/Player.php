<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Player extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'team_id',
        'position',
        'status',
        'avatar',
        'skill_level',
    ];

    public function team(): BelongsTo
    {
        return $this->belongsTo(Team::class);
    }
}
