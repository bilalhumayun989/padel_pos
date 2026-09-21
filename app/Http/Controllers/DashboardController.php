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
 $week=collect(range(6, 0))->map(function ($daysAgo) use ($today) {
  $date=$today->copy()->subDays($daysAgo);
  return [
   'date'=>$date->toDateString(), 'label'=>$date->format('D'),
   'revenue'=>(float)Booking::whereDate('booking_date',$date)->where('status','completed')->sum('total_amount'),
   'cafe'=>(float)CafeOrder::whereDate('order_date',$date)->where('status','completed')->sum('total_amount'),
   'bookings'=>Booking::whereDate('booking_date',$date)->where('status','!=','cancelled')->count(),
  ];
 });
 $bookingStatuses=collect(['completed','confirmed','pending','cancelled'])->map(fn($status)=>[
  'label'=>ucfirst($status), 'value'=>Booking::where('status',$status)->count(),
  'color'=>['completed'=>'#a3e635','confirmed'=>'#38bdf8','pending'=>'#fbbf24','cancelled'=>'#fb7185'][$status],
 ])->values();
 $courtPerformance=Court::withCount(['bookings'=>fn($q)=>$q->whereDate('booking_date','>=',$today->copy()->subDays(6))->where('status','!=','cancelled')])
  ->withSum(['bookings'=>fn($q)=>$q->whereDate('booking_date','>=',$today->copy()->subDays(6))->where('status','completed')],'total_amount')
  ->orderByDesc('bookings_count')->get()->map(fn($court)=>[
   'name'=>$court->name, 'bookings'=>$court->bookings_count, 'revenue'=>(float)($court->bookings_sum_total_amount ?? 0),
   'status'=>ucfirst($court->status),
  ]);
 return Inertia::render('Dashboard',['metrics'=>[
 'revenue_today'=>$revenue($today),'revenue_trend'=>$trend($revenue($today),$revenue($yesterday)),
 'today_bookings'=>$count($today),'bookings_trend'=>$trend($count($today),$count($yesterday)),
 'cafe_revenue'=>$cafe($today),'cafe_trend'=>$trend($cafe($today),$cafe($yesterday)),
 'expenses'=>$expenses($today),'expenses_trend'=>$trend($expenses($today),$expenses($yesterday)),
 'players_percentage'=>$capacity?round(Player::whereNotNull('team_id')->where('status','active')->count()/$capacity*100):0,'players_trend'=>0,
 'stock_percentage'=>$stock?round(StockItem::where('quantity','>',0)->whereColumn('quantity','>=','min_quantity')->count()/$stock*100):0,'stock_trend'=>0],
 'analytics'=>['week'=>$week,'booking_statuses'=>$bookingStatuses,'courts'=>$courtPerformance],
 'operations'=>['clients'=>Client::count(),'active_memberships'=>Membership::whereDate('starts_at','<=',$today)->whereDate('ends_at','>=',$today)->count(),'low_stock'=>StockItem::whereColumn('quantity','<','min_quantity')->count(),'open_tickets'=>SupportTicket::where('status','open')->count()],
 'teams'=>$this->teamSnapshot(),
 'recentBookings'=>Booking::with('client')->orderByDesc('created_at')->orderByDesc('id')->take(4)->get()->map(fn($booking)=>[
  'id'=>$booking->id, 'name'=>$booking->client?->name ?? 'Guest',
  'status'=>ucfirst($booking->status), 'last_visit'=>$booking->created_at?->diffForHumans() ?? 'Just now',
 ])]);
}

private function teamSnapshot()
{
 $now = now();
 $bookings = Booking::whereDate('booking_date', $now->toDateString())
  ->whereIn('status', ['confirmed', 'pending'])->whereNotNull('team_id')
  ->orderBy('start_time')->get()->groupBy('team_id');

 return Team::withCount(['players'=>fn($query)=>$query->where('status', 'active')])->get()->map(function ($team) use ($bookings, $now) {
  $sessions = $bookings->get($team->id, collect());
  $live = $sessions->first(fn($booking)=>$booking->status === 'confirmed' && $booking->start_time <= $now->format('H:i:s') && $booking->end_time > $now->format('H:i:s'));
  $next = $sessions->first(fn($booking)=>$booking->start_time > $now->format('H:i:s'));
  $session = $live ?? $next;
  $time = $session ? Carbon::parse($now->toDateString().' '.($live ? $session->end_time : $session->start_time)) : null;

  return [
   'id'=>$team->id, 'name'=>$team->name, 'players_count'=>$team->players_count,
   'max_players'=>$team->max_players, 'active'=>(bool)$live,
   'session_status'=>$live ? 'Live now' : ($next ? ($next->status === 'pending' ? 'Pending' : 'Up next') : 'No session'),
   'session_time'=>$time ? ($live ? 'Ends ' : 'Starts ').$time->diffForHumans($now) : 'Nothing scheduled today',
   'ready_ratio'=>min(4,$team->players_count).'/4',
  ];
 });
}
}
