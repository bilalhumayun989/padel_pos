<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;
class ClubSetting extends Model {
protected $fillable = ['name', 'email', 'phone', 'website', 'address', 'about'];
protected $casts = [];

}
