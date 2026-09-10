<?php
namespace App\Http\Controllers;
use App\Models\{Booking, CafeOrder, CafeOrderItem, Client, Court, Expense, Player, StockItem, Team, Supplier, Membership, MembershipPlan, Purchase, Reconciliation, ClubSetting, SupportTicket};
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;
use Illuminate\Support\Carbon;
use Inertia\Inertia;
class PlayerController extends Controller {

public function index() { return Inertia::render('Players/Index',[
 'metrics'=>['active_players'=>Player::where('status','active')->count(),'players_trend'=>0,'matches_played'=>Team::sum('wins')+Team::sum('losses'),'matches_trend'=>0],
 'players'=>Player::with('team')->get()->map(fn($p)=>['id'=>$p->id,'name'=>$p->name,'tier'=>$p->team?->name??'Independent','avatar'=>$p->avatar,'skill'=>$p->skill_level,'skill_max'=>5,'matches'=>$p->team?->wins+$p->team?->losses,'last_visit'=>'Not recorded','status'=>$p->status]), 'teams'=>Team::all(['id','name'])]); }
public function store(Request $r) { Player::create($r->validate(['name'=>'required|string|max:255','team_id'=>'nullable|exists:teams,id','skill_level'=>'required|integer|min:1|max:5','position'=>'nullable|string|max:40','status'=>'required|in:active,inactive,suspended'])); return back()->with('success','Player saved.'); }

}
