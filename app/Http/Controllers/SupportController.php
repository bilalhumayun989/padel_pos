<?php
namespace App\Http\Controllers;
use App\Models\{Booking, CafeOrder, CafeOrderItem, Client, Court, Expense, Player, StockItem, Team, Supplier, Membership, MembershipPlan, Purchase, Reconciliation, ClubSetting, SupportTicket};
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;
use Illuminate\Support\Carbon;
use Inertia\Inertia;
class SupportController extends Controller {

public function index(Request $r) { return Inertia::render('Support/Index',['tickets'=>SupportTicket::where('user_id',$r->user()->id)->latest()->get()]); }
public function store(Request $r) { SupportTicket::create($r->validate(['subject'=>'required|string|max:255','category'=>'required|string|max:80','message'=>'required|string|max:10000'])+['user_id'=>$r->user()->id]); return back()->with('success','Ticket saved.'); }

}
