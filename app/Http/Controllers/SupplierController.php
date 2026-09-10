<?php
namespace App\Http\Controllers;
use App\Models\{Booking, CafeOrder, CafeOrderItem, Client, Court, Expense, Player, StockItem, Team, Supplier, Membership, MembershipPlan, Purchase, Reconciliation, ClubSetting, SupportTicket};
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;
use Illuminate\Support\Carbon;
use Inertia\Inertia;
class SupplierController extends Controller {

public function index() { $suppliers=Supplier::with('purchases')->get(); return Inertia::render('Suppliers/Index',['suppliers'=>$suppliers->map(fn($s)=>array_merge($s->toArray(),['total_orders'=>$s->purchases->count(),'last_order'=>$s->purchases->sortByDesc('purchase_date')->first()?->purchase_date?->diffForHumans()??'No orders','balance'=>(float)$s->purchases->sum(fn($p)=>$p->total_amount-$p->paid_amount)])), 'metrics'=>['total_suppliers'=>$suppliers->count(),'active_suppliers'=>$suppliers->where('status','Active')->count(),'total_orders'=>Purchase::count(),'pending_balance'=>(float)(Purchase::sum('total_amount')-Purchase::sum('paid_amount'))]]); }
public function store(Request $r) { Supplier::create($r->validate(['name'=>'required|string|max:255','category'=>'nullable|string|max:255','contact'=>'nullable|string|max:255','phone'=>'nullable|string|max:40','email'=>'nullable|email|max:255','location'=>'nullable|string|max:255'])); return back()->with('success','Supplier saved.'); }

}
