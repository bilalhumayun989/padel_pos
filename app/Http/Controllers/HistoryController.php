<?php
namespace App\Http\Controllers;
use App\Models\{Booking, CafeOrder, CafeOrderItem, Client, Court, Expense, Player, StockItem, Team, Supplier, Membership, MembershipPlan, Purchase, Reconciliation, ClubSetting, SupportTicket};
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;
use Illuminate\Support\Carbon;
use Inertia\Inertia;
class HistoryController extends Controller {

private function render($tab,$transactions=[],$expenses=[],$reconciliation=[]) { return Inertia::render('History/Index',compact('tab','transactions','expenses','reconciliation')+['suppliers'=>Supplier::all(['id','name']),'stockItems'=>StockItem::all(['id','name']),'metrics'=>['total_events'=>count($transactions)+count($expenses)+count($reconciliation),'events_trend'=>0,'refunds'=>0,'refunds_total'=>0,'refunds_trend'=>0,'cancellations'=>collect($transactions)->where('status','Cancelled')->count(),'cancel_trend'=>0]]); }
public function sales() {
 $orders=CafeOrder::with('client')->get()->map(fn($o)=>['id'=>'C-'.$o->id,'item'=>$o->items_summary??'Cafe sale','category'=>'Cafe','client'=>$o->client?->name??'Walk-in','time'=>$o->created_at->format('H:i'),'amount'=>(float)$o->total_amount,'status'=>ucfirst($o->status),'group'=>$o->order_date->toDateString()]);
 $bookings=Booking::with(['client','court'])->get()->map(fn($b)=>['id'=>'B-'.$b->id,'item'=>$b->court->name,'category'=>'Bookings','client'=>$b->client->name,'time'=>$b->start_time,'amount'=>(float)$b->total_amount,'status'=>ucfirst($b->status),'group'=>$b->booking_date->toDateString()]);
 return $this->render('sales',$orders->concat($bookings)->sortByDesc('group')->values());
}
public function purchases() { return $this->render('purchases',Purchase::with(['supplier','item'])->orderByDesc('purchase_date')->get()->map(fn($p)=>['id'=>$p->id,'item'=>$p->item->name.' x'.$p->quantity,'category'=>'Equipment','client'=>$p->supplier->name,'time'=>$p->created_at->format('H:i'),'amount'=>(float)$p->total_amount,'status'=>'Completed','group'=>$p->purchase_date->toDateString()])); }
public function expenses() { return $this->render('expenses',[],Expense::orderByDesc('expense_date')->get()->map(fn($e)=>['id'=>$e->id,'name'=>$e->description,'category'=>$e->category,'amount'=>(float)$e->amount,'date'=>$e->expense_date->toDateString(),'by'=>'Not recorded'])); }
public function reconciliation() { return $this->render('reconciliation',[],[],Reconciliation::with('user')->orderByDesc('date')->get()->map(fn($r)=>['id'=>$r->id,'shift'=>'Full day','cashier'=>$r->user->name,'date'=>$r->date->toDateString(),'expected'=>$r->expected,'actual'=>$r->actual,'variance'=>round($r->actual-$r->expected,2),'status'=>abs($r->actual-$r->expected)<0.01?'Balanced':($r->actual>$r->expected?'Over':'Short')])); }
public function storeExpense(Request $r) { Expense::create($r->validate(['description'=>'required|string|max:255','category'=>'required|string|max:80','amount'=>'required|numeric|min:0.01|max:99999999','expense_date'=>'required|date_format:Y-m-d','reference'=>'nullable|string|max:255'])); return back()->with('success','Expense saved.'); }
public function storePurchase(Request $r) {
 $d=$r->validate(['supplier_id'=>'required|exists:suppliers,id','stock_item_id'=>'required|exists:stock_items,id','quantity'=>'required|integer|min:1|max:100000','unit_price'=>'required|numeric|min:0|max:999999','paid_amount'=>'required|numeric|min:0','purchase_date'=>'required|date_format:Y-m-d']);
 DB::transaction(function()use($d){$item=StockItem::lockForUpdate()->findOrFail($d['stock_item_id']);$total=round($d['quantity']*$d['unit_price'],2);if($d['paid_amount']>$total)throw ValidationException::withMessages(['paid_amount'=>'Payment cannot exceed purchase total.']);Purchase::create($d+['total_amount'=>$total]);$item->quantity+=$d['quantity'];$item->status=$item->quantity<$item->min_quantity?'low_stock':'in_stock';$item->save();}); return back()->with('success','Purchase recorded and stock received.');
}
public function storeReconciliation(Request $r) {
 $d=$r->validate(['date'=>'required|date_format:Y-m-d|before_or_equal:today|unique:reconciliations,date','actual'=>'required|numeric|min:0|max:99999999']);
 $expected=(float)Booking::whereDate('booking_date',$d['date'])->where('status','completed')->where('payment_type','cash')->sum('total_amount')+(float)CafeOrder::whereDate('order_date',$d['date'])->where('status','completed')->sum('total_amount')-(float)Expense::whereDate('expense_date',$d['date'])->sum('amount')-(float)Purchase::whereDate('purchase_date',$d['date'])->sum('paid_amount');
 Reconciliation::create($d+['user_id'=>$r->user()->id,'expected'=>$expected]);return back()->with('success','Daily reconciliation saved.');
}

}
