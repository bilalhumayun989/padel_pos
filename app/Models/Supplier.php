<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;
class Supplier extends Model {
protected $fillable = ['name', 'category', 'contact', 'phone', 'email', 'location', 'status', 'is_demo'];
protected $casts = [];
public function purchases() { return $this->hasMany(Purchase::class); }
}
