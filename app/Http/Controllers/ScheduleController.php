<?php
namespace App\Http\Controllers;
use App\Models\{Booking, CafeOrder, CafeOrderItem, Client, Court, Expense, Player, StockItem, Team, Supplier, Membership, MembershipPlan, Purchase, Reconciliation, ClubSetting, SupportTicket};
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;
use Illuminate\Support\Carbon;
use Inertia\Inertia;
class ScheduleController extends Controller {

public function index(Request $request) {
 $data=$request->validate(['date'=>'nullable|date_format:Y-m-d']); $date=$data['date']??(auth()->user()?->isDemo()?today()->addDay()->toDateString():now()->toDateString());
 return Inertia::render('Schedule/Index',[
 'courts'=>Court::all()->map(fn($c)=>['id'=>$c->id,'name'=>$c->name,'type'=>ucfirst($c->type),'active'=>$c->status!=='maintenance']),
 'bookings'=>Booking::with('client')->whereDate('booking_date',$date)->where('status','!=','cancelled')->get()->map(fn($b)=>['booking_status'=>$b->status,'id'=>$b->id,'court_id'=>$b->court_id,'team'=>$b->client->name,'players'=>$b->players,'ratio'=>$b->players.'/4','start'=>(int)substr($b->start_time,0,2)+(int)substr($b->start_time,3,2)/60,'end'=>(int)substr($b->end_time,0,2)+(int)substr($b->end_time,3,2)/60,'status'=>$b->status==='pending'?'reserved':'booked','avatars'=>[]]),
 'today'=>Carbon::parse($date)->format('l, M d'), 'date'=>$date,
 ]);
}

}
