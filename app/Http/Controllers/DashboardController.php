<?php
namespace App\Http\Controllers;
use App\Models\{Booking, CafeOrder, CafeOrderItem, Client, Court, Expense, Player, StockItem, Team, Supplier, Membership, MembershipPlan, Purchase, Reconciliation, ClubSetting, SupportTicket};
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;
use Illuminate\Support\Carbon;
use Inertia\Inertia;
class DashboardController extends Controller {

public function index() {
 $revenue=fn($date)=>(float)Booking::whereDate('booking_date',$date)->where('status','completed')->sum('total_amount');
 $cafe=fn($date)=>(float)CafeOrder::whereDate('order_date',$date)->where('status','completed')->sum('total_amount');
 $count=fn($date)=>Booking::whereDate('booking_date',$date)->where('status','!=','cancelled')->count();
 $expenses=fn($date)=>Expense::whereDate('expense_date',$date)->count();
 $trend=fn($a,$b)=>$b>0?round(($a-$b)/$b*100):0;
 $today=today(); $yesterday=today()->subDay(); $capacity=Team::sum('max_players'); $stock=StockItem::count();
 return Inertia::render('Dashboard',['metrics'=>[
 'revenue_today'=>$revenue($today),'revenue_trend'=>$trend($revenue($today),$revenue($yesterday)),
 'today_bookings'=>$count($today),'bookings_trend'=>$trend($count($today),$count($yesterday)),
 'cafe_revenue'=>$cafe($today),'cafe_trend'=>$trend($cafe($today),$cafe($yesterday)),
 'expenses'=>$expenses($today),'expenses_trend'=>$trend($expenses($today),$expenses($yesterday)),
 'players_percentage'=>$capacity?round(Player::whereNotNull('team_id')->where('status','active')->count()/$capacity*100):0,'players_trend'=>0,
 'stock_percentage'=>$stock?round(StockItem::where('quantity','>',0)->whereColumn('quantity','>=','min_quantity')->count()/$stock*100):0,'stock_trend'=>0],
 'teams'=>Team::withCount(['players'=>fn($q)=>$q->where('status','active')])->get()->map(fn($t)=>['active'=>$t->status==='active','id'=>$t->id,'name'=>$t->name,'players_count'=>$t->players_count,'max_players'=>$t->max_players,'ready_ratio'=>min(4,$t->players_count).'/4']),
 'recentBookings'=>Client::orderByDesc('last_visit')->take(4)->get()->map(fn($c)=>['id'=>$c->id,'name'=>$c->name,'status'=>ucfirst($c->status),'last_visit'=>$c->last_visit?->diffForHumans()??'No visits'])]);
}

}
