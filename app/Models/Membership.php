<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;
class Membership extends Model {
protected $fillable = ['client_id', 'membership_plan_id', 'starts_at', 'ends_at', 'amount', 'is_demo'];
protected $casts = ['starts_at' => 'date', 'ends_at' => 'date', 'amount' => 'float'];
public function plan() { return $this->belongsTo(MembershipPlan::class, 'membership_plan_id'); }
}
