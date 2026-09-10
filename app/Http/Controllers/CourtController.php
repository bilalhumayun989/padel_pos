<?php
namespace App\Http\Controllers;
use App\Models\{Booking, CafeOrder, CafeOrderItem, Client, Court, Expense, Player, StockItem, Team, Supplier, Membership, MembershipPlan, Purchase, Reconciliation, ClubSetting, SupportTicket};
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;
use Illuminate\Support\Carbon;
use Inertia\Inertia;
class CourtController extends Controller {

public function index() { return Inertia::render('Courts/Index',[
 'courts'=>Court::all()->map(fn($c)=>array_merge($c->toArray(),['type'=>ucfirst($c->type),'price_per_hour'=>(float)$c->hourly_rate,'status'=>$c->status==='maintenance'?'Maintenance':'Active','lights'=>(bool)$c->lights])),
 'metrics'=>['total'=>Court::count(),'active'=>Court::where('status','!=','maintenance')->count(),'maintenance'=>Court::where('status','maintenance')->count(),'revenue_today'=>(float)Booking::whereDate('booking_date',today())->where('status','completed')->sum('total_amount')]]); }
public function store(Request $r) { return $this->save($r,new Court); }
public function update(Request $r,Court $court) { return $this->save($r,$court); }
private function save(Request $r,Court $court) {
 $d=$r->validate(['name'=>'required|string|max:255','type'=>'required|in:Indoor,Outdoor,Panoramic','price_per_hour'=>'required|numeric|min:0|max:999999','location'=>'nullable|string|max:255','capacity'=>'required|integer|min:2|max:100','surface'=>'nullable|string|max:255','lights'=>'required|boolean','description'=>'nullable|string|max:5000','image'=>'nullable|string|max:2000','status'=>'required|in:Active,Maintenance']);
 $d['hourly_rate']=$d['price_per_hour']; unset($d['price_per_hour']); $d['type']=strtolower($d['type']); $d['status']=$d['status']==='Maintenance'?'maintenance':'available';
 $court->fill($d)->save(); return back()->with('success','Court saved.');
}
public function destroy(Court $court) { if($court->bookings()->exists()) throw ValidationException::withMessages(['court'=>'This court has booking history. Set it to Maintenance instead.']); $court->delete(); return back()->with('success','Court deleted.'); }

}
