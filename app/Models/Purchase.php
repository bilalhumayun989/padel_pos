<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;
class Purchase extends Model {
protected $fillable = ['supplier_id', 'stock_item_id', 'quantity', 'unit_price', 'total_amount', 'paid_amount', 'purchase_date'];
protected $casts = ['purchase_date' => 'date', 'total_amount' => 'float', 'paid_amount' => 'float'];
public function supplier() { return $this->belongsTo(Supplier::class); } public function item() { return $this->belongsTo(StockItem::class, 'stock_item_id'); }
}
