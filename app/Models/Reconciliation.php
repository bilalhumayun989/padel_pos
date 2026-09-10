<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;
class Reconciliation extends Model {
protected $fillable = ['user_id', 'date', 'expected', 'actual', 'is_demo'];
protected $casts = ['date' => 'date', 'expected' => 'float', 'actual' => 'float'];
public function user() { return $this->belongsTo(User::class); }
}
