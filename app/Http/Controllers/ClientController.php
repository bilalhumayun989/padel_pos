<?php
namespace App\Http\Controllers;
use App\Models\{Booking, CafeOrder, CafeOrderItem, Client, Court, Expense, Player, StockItem, Team, Supplier, Membership, MembershipPlan, Purchase, Reconciliation, ClubSetting, SupportTicket};
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;
use Illuminate\Support\Carbon;
use Inertia\Inertia;
class ClientController extends Controller {

public function index() {
 return Inertia::render('Clients/Index',['metrics'=>['total_clients'=>Client::count(),'clients_trend'=>0,'today_bookings'=>Booking::whereDate('booking_date',today())->where('status','!=','cancelled')->count(),'bookings_trend'=>0],
 'clients'=>Client::withCount(['bookings'=>fn($q)=>$q->where('status','completed')])->withSum(['bookings'=>fn($q)=>$q->where('status','completed')],'total_amount')->withSum(['cafeOrders'=>fn($q)=>$q->where('status','completed')],'total_amount')->with('memberships.plan')->get()->map(fn($c)=>['id'=>$c->id,'name'=>$c->name,'status'=>ucfirst($c->status),'tier'=>$c->memberships->first(fn($m)=>$m->starts_at->lte(today())&&$m->ends_at->gte(today()))?->plan?->name??'None','visits'=>$c->bookings_count,'last_visit'=>$c->last_visit?->diffForHumans()??'No visits','lifetime'=>'$'.number_format($c->bookings_sum_total_amount+$c->cafe_orders_sum_total_amount,2)])]);
}
public function store(Request $r) { Client::create($r->validate(['name'=>'required|string|max:255','email'=>'nullable|email|unique:clients,email','phone'=>'nullable|string|max:40','status'=>'required|in:active,paused,inactive'])); return back()->with('success','Client saved.'); }

}
