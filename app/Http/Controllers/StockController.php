<?php
namespace App\Http\Controllers;
use App\Models\{Booking, CafeOrder, CafeOrderItem, Client, Court, Expense, Player, StockItem, Team, Supplier, Membership, MembershipPlan, Purchase, Reconciliation, ClubSetting, SupportTicket};
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;
use Illuminate\Support\Carbon;
use Inertia\Inertia;
class StockController extends Controller {

public function index() { return Inertia::render('Stock/Index',['metrics'=>['total_skus'=>StockItem::count(),'skus_trend'=>0,'low_stock'=>StockItem::whereColumn('quantity','<','min_quantity')->count(),'low_trend'=>0,'monthly_sales'=>(float)CafeOrder::where('status','completed')->whereBetween('order_date',[now()->startOfMonth(),now()->endOfMonth()])->sum('total_amount'),'sales_trend'=>0],
 'items'=>StockItem::all()->map(fn($p)=>['id'=>$p->id,'name'=>$p->name,'sku'=>'SKU-'.$p->id,'stock'=>$p->quantity,'min_quantity'=>$p->min_quantity,'max_stock'=>max($p->quantity,$p->min_quantity,1),'unit_price'=>(float)$p->unit_price,'value'=>$p->quantity*$p->unit_price,'status'=>$p->quantity<$p->min_quantity?'Low':'Good']), 'suppliers'=>Supplier::all(['id','name'])]); }
public function update(Request $r,StockItem $stock) { $d=$r->validate(['quantity'=>'required|integer|min:0','min_quantity'=>'required|integer|min:0']); $stock->fill($d); $stock->status=$stock->quantity===0?'out_of_stock':($stock->quantity<$stock->min_quantity?'low_stock':'in_stock'); $stock->save(); return back()->with('success','Stock updated.'); }

}
