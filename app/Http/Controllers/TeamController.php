<?php
namespace App\Http\Controllers;
use App\Models\{Booking, CafeOrder, CafeOrderItem, Client, Court, Expense, Player, StockItem, Team, Supplier, Membership, MembershipPlan, Purchase, Reconciliation, ClubSetting, SupportTicket};
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;
use Illuminate\Support\Carbon;
use Inertia\Inertia;
class TeamController extends Controller {

public function index() {
 $teams=Team::with('players')->get();
 return Inertia::render('Teams/Index',['teams'=>$teams->map(function($t){
 $b=Booking::with('court')->where('team_id',$t->id)->where('status','!=','cancelled')->whereDate('booking_date','>=',today())->orderBy('booking_date')->orderBy('start_time')->first();
 return ['id'=>$t->id,'name'=>$t->name,'captain'=>$t->captain,'members'=>$t->players->pluck('name'),'skill_level'=>$t->skill_level,'court'=>$b?->court?->name,'court_booked'=>(bool)$b,'booking_date'=>$b?->booking_date?->toDateString(),'booking_time'=>$b?->start_time,'payment'=>'Not recorded','payment_amount'=>0,'wins'=>$t->wins,'losses'=>$t->losses,'matches'=>$t->wins+$t->losses,'status'=>ucfirst($t->status),'created_at'=>$t->created_at->toDateString(),'image'=>null];
 }), 'metrics'=>['total_teams'=>$teams->count(),'active_teams'=>$teams->where('status','active')->count(),'courts_booked'=>Booking::whereNotNull('team_id')->where('status','!=','cancelled')->whereDate('booking_date',today())->distinct()->count('court_id'),'total_matches'=>$teams->sum('wins')+$teams->sum('losses')]]);
}
public function store(Request $r) { return $this->save($r,new Team); }
public function update(Request $r,Team $team) { return $this->save($r,$team); }
private function save(Request $r,Team $team) {
 $d=$r->validate(['name'=>'required|string|max:255','captain'=>'nullable|string|max:255','members'=>'required|array|max:12','members.*'=>'nullable|string|max:255','skill_level'=>'required|in:Beginner,Intermediate,Advanced,Pro','status'=>'required|in:Active,Inactive']);
 DB::transaction(function()use($d,$team){
 $team->fill(['name'=>$d['name'],'captain'=>$d['captain']??null,'skill_level'=>$d['skill_level'],'status'=>strtolower($d['status'])])->save();
 $names=array_values(array_unique(array_filter($d['members'],fn($n)=>trim($n??'')!=='')));
 $team->players()->whereNotIn('name',$names)->update(['team_id'=>null]);
 foreach($names as $name) Player::firstOrCreate(['team_id'=>$team->id,'name'=>$name],['status'=>'active','skill_level'=>3]);
 }); return back()->with('success','Team saved.');
}
public function destroy(Team $team) { $team->delete(); return back()->with('success','Team deleted; player records preserved.'); }

}
