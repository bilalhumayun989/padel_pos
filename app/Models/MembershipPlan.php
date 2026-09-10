<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;
class MembershipPlan extends Model {
protected $fillable = ['name', 'badge', 'price', 'duration', 'color', 'status', 'perks', 'is_demo'];
protected $casts = ['perks' => 'array', 'price' => 'float', 'duration' => 'integer'];
public function memberships() { return $this->hasMany(Membership::class); }
}
