<?php
namespace App\Http\Controllers;
use App\Models\{Booking, CafeOrder, CafeOrderItem, Client, Court, Expense, Player, StockItem, Team, Supplier, Membership, MembershipPlan, Purchase, Reconciliation, ClubSetting, SupportTicket};
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;
use Illuminate\Support\Carbon;
use Inertia\Inertia;
class CafeController extends Controller {

public function index() { return Inertia::render('Cafe/Index',['products'=>StockItem::where('active',true)->whereIn('category',['cafe','Cafe','Bundles','Drinks','Snacks'])->where('quantity','>',0)->get()->map(fn($p)=>['id'=>$p->id,'name'=>$p->name,'category'=>$p->category==='Bundles'?'Bundles':'Cafe','price'=>(float)$p->unit_price,'image'=>$p->image,'stock'=>$p->quantity])]); }
public function store(Request $r) {
 $d=$r->validate(['items'=>'required|array|min:1','items.*.id'=>'required|integer|distinct|exists:stock_items,id','items.*.qty'=>'required|integer|min:1|max:1000','client_id'=>'nullable|exists:clients,id']);
 DB::transaction(function()use($d){
  $products=StockItem::whereIn('id',array_column($d['items'],'id'))->orderBy('id')->lockForUpdate()->get()->keyBy('id'); $subtotal=0; $lines=[];
  foreach($d['items'] as $line) { $p=$products[$line['id']]; if(!$p->active || !in_array($p->category,['cafe','Cafe','Bundles','Drinks','Snacks']) || $p->quantity<$line['qty']) throw ValidationException::withMessages(['items'=>'Insufficient available stock for '.$p->name.'.']);
   $cents=(int)round($p->unit_price*100); $subtotal+=$cents*$line['qty'];
   $lines[]=['stock_item_id'=>$p->id,'name'=>$p->name,'quantity'=>$line['qty'],'unit_price'=>$p->unit_price,'total'=>$cents*$line['qty']/100];
   $p->quantity-=$line['qty']; $p->status=$p->quantity===0?'out_of_stock':($p->quantity<$p->min_quantity?'low_stock':'in_stock'); $p->save();
  }
  $order=CafeOrder::create(['client_id'=>$d['client_id']??null,'order_date'=>today(),'status'=>'completed','total_amount'=>($subtotal+round($subtotal*0.05))/100,'items_summary'=>collect($lines)->map(fn($l)=>$l['quantity'].'x '.$l['name'])->join(', ')]);
  foreach($lines as $line) CafeOrderItem::create(['cafe_order_id'=>$order->id]+$line);
 }); return back()->with('success','Sale completed and stock updated.');
}

}
