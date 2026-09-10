<?php
namespace App\Http\Controllers;
use App\Models\{Booking, CafeOrder, CafeOrderItem, Client, Court, Expense, Player, StockItem, Team, Supplier, Membership, MembershipPlan, Purchase, Reconciliation, ClubSetting, SupportTicket};
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;
use Illuminate\Support\Carbon;
use Inertia\Inertia;
class MembershipController extends Controller {

public function index() {
 $active=Membership::whereDate('starts_at','<=',today())->whereDate('ends_at','>=',today());
 return Inertia::render('Memberships/Index',['plans'=>MembershipPlan::withCount(['memberships as subscribers'=>fn($q)=>$q->whereDate('starts_at','<=',today())->whereDate('ends_at','>=',today())])->get(),
 'metrics'=>['total_plans'=>MembershipPlan::count(),'active_members'=>$active->count(),'monthly_revenue'=>(float)Membership::whereBetween('starts_at',[now()->startOfMonth(),now()->endOfMonth()])->sum('amount'),'new_this_month'=>Membership::whereBetween('starts_at',[now()->startOfMonth(),now()->endOfMonth()])->count()], 'clients'=>Client::all(['id','name'])]);
}
public function store(Request $r) { return $this->save($r,new MembershipPlan); }
public function update(Request $r,MembershipPlan $membership) { return $this->save($r,$membership); }
private function save(Request $r,MembershipPlan $plan) { $plan->fill($r->validate(['name'=>'required|string|max:255','badge'=>'nullable|string|max:80','price'=>'required|numeric|min:0|max:99999999','duration'=>'required|integer|min:1|max:3650','color'=>'required|in:lime,blue,purple,amber,gray,white','status'=>'required|in:Active,Inactive','perks'=>'required|array|max:30','perks.*'=>'nullable|string|max:255']))->save(); return back()->with('success','Membership plan saved.'); }
public function destroy(MembershipPlan $membership) { if($membership->memberships()->exists()) throw ValidationException::withMessages(['membership'=>'This plan has subscribers. Set it to Inactive instead.']); $membership->delete(); return back()->with('success','Plan deleted.'); }
public function enroll(Request $r) {
 $d=$r->validate(['client_id'=>'required|exists:clients,id','membership_plan_id'=>'required|exists:membership_plans,id','starts_at'=>'required|date_format:Y-m-d']);
 DB::transaction(function()use($d){ $client=Client::lockForUpdate()->findOrFail($d['client_id']); $plan=MembershipPlan::findOrFail($d['membership_plan_id']); $end=Carbon::parse($d['starts_at'])->addDays($plan->duration-1)->toDateString();
 if($plan->status!=='Active'||$client->memberships()->whereDate('starts_at','<=',$end)->whereDate('ends_at','>=',$d['starts_at'])->exists()) throw ValidationException::withMessages(['client_id'=>'This client already has a membership in that period, or the plan is inactive.']);
 Membership::create($d+['ends_at'=>$end,'amount'=>$plan->price]); }); return back()->with('success','Client enrolled.');
}

}
