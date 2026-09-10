<?php
namespace App\Http\Controllers;
use App\Models\{Booking, CafeOrder, CafeOrderItem, Client, Court, Expense, Player, StockItem, Team, Supplier, Membership, MembershipPlan, Purchase, Reconciliation, ClubSetting, SupportTicket};
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;
use Illuminate\Support\Carbon;
use Inertia\Inertia;
class ReportController extends Controller {

private function summary() {
 $cafe=(float)CafeOrder::where('status','completed')->sum('total_amount');
 $revenue=(float)Booking::where('status','completed')->sum('total_amount')+$cafe+(float)Membership::sum('amount');
 $expenses=(float)Expense::sum('amount')+(float)Purchase::sum('total_amount');
 return ['total_revenue'=>$revenue,'total_expenses'=>$expenses,'net_profit'=>$revenue-$expenses,'total_bookings'=>Booking::count(),'cafe_revenue'=>$cafe,'active_players'=>Player::where('status','active')->count()];
}
private function render($tab,$rows) { return Inertia::render('Reports/Index',['tab'=>$tab,'summary'=>$this->summary(),'rows'=>$rows]); }
public function revenue() {
 $bookings=Booking::where('status','completed')->get()->groupBy(fn($b)=>$b->booking_date->toDateString());
 $cafe=CafeOrder::where('status','completed')->get()->groupBy(fn($o)=>$o->order_date->toDateString());
 $members=Membership::all()->groupBy(fn($m)=>$m->starts_at->toDateString());
 $dates=$bookings->keys()->merge($cafe->keys())->merge($members->keys())->unique()->sortDesc()->values();
 return $this->render('revenue',$dates->map(fn($date)=>['date'=>$date,'bookings'=>(float)($bookings->get($date)?->sum('total_amount')??0),'cafe'=>(float)($cafe->get($date)?->sum('total_amount')??0),'other'=>(float)($members->get($date)?->sum('amount')??0),'total'=>(float)($bookings->get($date)?->sum('total_amount')??0)+(float)($cafe->get($date)?->sum('total_amount')??0)+(float)($members->get($date)?->sum('amount')??0),'trend'=>0]));
}
public function expenses() { return $this->render('expenses',Expense::orderByDesc('expense_date')->get()->map(fn($e)=>['date'=>$e->expense_date->toDateString(),'category'=>$e->category,'amount'=>(float)$e->amount,'by'=>'Not recorded','note'=>$e->description])->concat(Purchase::with('supplier')->get()->map(fn($p)=>['date'=>$p->purchase_date->toDateString(),'category'=>'Inventory purchase','amount'=>(float)$p->total_amount,'by'=>$p->supplier->name,'note'=>'Purchase #'.$p->id]))); }
public function bookings() { return $this->render('bookings',Booking::with(['client','court'])->orderByDesc('booking_date')->get()->map(fn($b)=>['id'=>$b->id,'client'=>$b->client->name,'court'=>$b->court->name,'date'=>$b->booking_date->toDateString(),'time'=>$b->start_time,'duration'=>Carbon::parse($b->start_time)->diffInMinutes(Carbon::parse($b->end_time))/60,'amount'=>(float)$b->total_amount,'status'=>ucfirst($b->status)])); }
public function cafe() { return $this->render('cafe',CafeOrderItem::with('order')->whereHas('order',fn($q)=>$q->where('status','completed'))->get()->map(fn($i)=>['date'=>$i->order->order_date->toDateString(),'item'=>$i->name,'qty'=>$i->quantity,'unit_price'=>$i->unit_price,'total'=>$i->total])); }
public function players() { return $this->render('players',Player::with('team')->get()->map(fn($p)=>['name'=>$p->name,'tier'=>$p->team?->name??'Independent','matches'=>$p->team?->wins+$p->team?->losses,'wins'=>$p->team?->wins??0,'losses'=>$p->team?->losses??0,'revenue'=>0,'joined'=>$p->created_at->format('M Y')])); }

}
