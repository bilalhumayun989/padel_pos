<?php
namespace App\Http\Controllers;
use App\Models\{Booking, CafeOrder, CafeOrderItem, Client, Court, Expense, Player, StockItem, Team, Supplier, Membership, MembershipPlan, Purchase, Reconciliation, ClubSetting, SupportTicket};
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;
use Illuminate\Support\Carbon;
use Inertia\Inertia;
class ProductController extends Controller {

public function index() { return redirect()->route('products.cafe'); }
public function cafe() { return $this->listing('cafe'); }
public function paddle() { return $this->listing('paddle'); }
private function listing($tab) {
 $q=StockItem::with('supplier'); $categories=['cafe','Cafe','Bundles','Drinks','Snacks']; $tab==='cafe'?$q->whereIn('category',$categories):$q->whereNotIn('category',$categories); $products=$q->get();
 return Inertia::render('Products/Index',['tab'=>$tab,'products'=>$products->map(fn($p)=>['id'=>$p->id,'name'=>$p->name,'category'=>ucfirst($p->category),'price'=>(float)$p->unit_price,'cost'=>(float)$p->cost,'stock'=>$p->quantity,'unit'=>$p->unit,'supplier'=>$p->supplier?->name??'','supplier_id'=>$p->supplier_id,'image'=>$p->image,'status'=>$p->active?'Active':'Inactive']), 'suppliers'=>Supplier::all(['id','name']), 'metrics'=>['total'=>$products->count(),'active'=>$products->where('active',true)->count(),'low_stock'=>$products->filter(fn($p)=>$p->quantity<$p->min_quantity)->count(),'categories'=>$products->pluck('category')->unique()->count()]]);
}
public function store(Request $r) { return $this->save($r,new StockItem); }
public function update(Request $r,StockItem $product) { return $this->save($r,$product); }
private function save(Request $r,StockItem $product) {
 $d=$r->validate(['name'=>'required|string|max:255','category'=>'required|string|max:80','price'=>'required|numeric|min:0|max:99999999','cost'=>'required|numeric|min:0|max:99999999','stock'=>'required|integer|min:0','unit'=>'required|string|max:30','supplier'=>'nullable|string|max:255','image'=>'nullable|url|max:2000','status'=>'required|in:Active,Inactive']);
 $supplier=!empty($d['supplier'])?Supplier::where('name',$d['supplier'])->first():null;
 if(!empty($d['supplier'])&&!$supplier) throw ValidationException::withMessages(['supplier'=>'Select an existing supplier.']);
 $product->fill(['name'=>$d['name'],'category'=>$d['category'],'unit_price'=>$d['price'],'cost'=>$d['cost'],'quantity'=>$d['stock'],'unit'=>$d['unit'],'supplier_id'=>$supplier?->id,'image'=>$d['image']??null,'active'=>$d['status']==='Active']);
 $product->status=$product->quantity===0?'out_of_stock':($product->quantity<($product->min_quantity??5)?'low_stock':'in_stock'); $product->save(); return back()->with('success','Product saved.');
}
public function destroy(StockItem $product) { $product->update(['active'=>false]); return back()->with('success','Product archived.'); }

}
