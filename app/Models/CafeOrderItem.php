<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;
class CafeOrderItem extends Model {
protected $fillable = ['cafe_order_id', 'stock_item_id', 'name', 'quantity', 'unit_price', 'total', 'is_demo'];
protected $casts = ['quantity' => 'integer', 'unit_price' => 'float', 'total' => 'float'];
public function order() { return $this->belongsTo(CafeOrder::class, 'cafe_order_id'); }
}
