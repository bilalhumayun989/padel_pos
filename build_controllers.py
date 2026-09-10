from pathlib import Path
header='''<?php
namespace App\\Http\\Controllers;
use App\\Models\\{Booking, CafeOrder, CafeOrderItem, Client, Court, Expense, Player, StockItem, Team, Supplier, Membership, MembershipPlan, Purchase, Reconciliation, ClubSetting, SupportTicket};
use Illuminate\\Http\\Request;
use Illuminate\\Support\\Facades\\DB;
use Illuminate\\Validation\\ValidationException;
use Illuminate\\Support\\Carbon;
use Inertia\\Inertia;
'''
def controller(name,body): Path('app/Http/Controllers/'+name+'Controller.php').write_text(header+'class '+name+'Controller extends Controller {\n'+body+'\n}\n')
controller('Booking',r'''
public function create() {
 return Inertia::render('Bookings/Create', [
 'courts'=>Court::where('status','!=','maintenance')->get()->map(fn($c)=>['id'=>$c->id,'name'=>$c->name,'type'=>ucfirst($c->type),'price_per_hour'=>(float)$c->hourly_rate]),
 'clients'=>Client::where('status','active')->get(['id','name']),
 'time_slots'=>array_map(fn($h)=>sprintf('%02d:00',$h),range(8,21)),
 ]);
}
public function store(Request $request) {
 $data=$request->validate([
 'court_id'=>'required|exists:courts,id', 'client_id'=>'nullable|exists:clients,id',
 'client_name'=>'required_without:client_id|nullable|string|max:255',
 'date'=>'required|date_format:Y-m-d|after_or_equal:today', 'start_time'=>'required|date_format:H:i',
 'duration'=>'required|numeric|in:1,1.5,2,2.5,3', 'players'=>'required|integer|min:2|max:4',
 'payment_type'=>'required|in:cash,card,online', 'notes'=>'nullable|string|max:2000',
 ]);
 DB::transaction(function() use($data) {
  $court=Court::lockForUpdate()->findOrFail($data['court_id']);
  $start=Carbon::parse($data['date'].' '.$data['start_time']);
  $end=$start->copy()->addMinutes((int)($data['duration']*60));
  if($court->status==='maintenance' || $start->isPast() || $start->hour<8 || $end->toDateString()!==$start->toDateString() || $end->format('H:i')>'22:00') throw ValidationException::withMessages(['start_time'=>'Choose a future session within opening hours (08:00–22:00).']);
  if(Booking::where('court_id',$court->id)->whereDate('booking_date',$data['date'])->where('status','!=','cancelled')->where('start_time','<',$end->format('H:i:s'))->where('end_time','>',$start->format('H:i:s'))->exists()) throw ValidationException::withMessages(['start_time'=>'This court is already booked during that time.']);
  $client= !empty($data['client_id']) ? Client::findOrFail($data['client_id']) : Client::create(['name'=>$data['client_name'],'status'=>'active']);
  if($client->status!=='active') throw ValidationException::withMessages(['client_id'=>'Select an active client.']);
  Booking::create(['court_id'=>$court->id,'client_id'=>$client->id,'booking_date'=>$data['date'],'start_time'=>$start->format('H:i:s'),'end_time'=>$end->format('H:i:s'),'total_amount'=>round($court->hourly_rate*$data['duration'],2),'status'=>'confirmed','players'=>$data['players'],'payment_type'=>$data['payment_type'],'notes'=>$data['notes']??null]);
 });
 return redirect()->route('schedule.index',['date'=>$data['date']])->with('success','Booking saved.');
}
''')
controller('Schedule',r'''
public function index(Request $request) {
 $data=$request->validate(['date'=>'nullable|date_format:Y-m-d']); $date=$data['date']??now()->toDateString();
 return Inertia::render('Schedule/Index',[
 'courts'=>Court::all()->map(fn($c)=>['id'=>$c->id,'name'=>$c->name,'type'=>ucfirst($c->type),'active'=>$c->status!=='maintenance']),
 'bookings'=>Booking::with('client')->whereDate('booking_date',$date)->where('status','!=','cancelled')->get()->map(fn($b)=>['id'=>$b->id,'court_id'=>$b->court_id,'team'=>$b->client->name,'players'=>$b->players,'ratio'=>$b->players.'/4','start'=>(int)substr($b->start_time,0,2)+(int)substr($b->start_time,3,2)/60,'end'=>(int)substr($b->end_time,0,2)+(int)substr($b->end_time,3,2)/60,'status'=>$b->status==='pending'?'reserved':'booked','avatars'=>[]]),
 'today'=>Carbon::parse($date)->format('l, M d'), 'date'=>$date,
 ]);
}
''')
controller('Client',r'''
public function index() {
 return Inertia::render('Clients/Index',['metrics'=>['total_clients'=>Client::count(),'clients_trend'=>0,'today_bookings'=>Booking::whereDate('booking_date',today())->where('status','!=','cancelled')->count(),'bookings_trend'=>0],
 'clients'=>Client::withCount(['bookings'=>fn($q)=>$q->where('status','completed')])->withSum(['bookings'=>fn($q)=>$q->where('status','completed')],'total_amount')->withSum(['cafeOrders'=>fn($q)=>$q->where('status','completed')],'total_amount')->with('memberships.plan')->get()->map(fn($c)=>['id'=>$c->id,'name'=>$c->name,'status'=>ucfirst($c->status),'tier'=>$c->memberships->first(fn($m)=>$m->starts_at->lte(today())&&$m->ends_at->gte(today()))?->plan?->name??'None','visits'=>$c->bookings_count,'last_visit'=>$c->last_visit?->diffForHumans()??'No visits','lifetime'=>'$'.number_format($c->bookings_sum_total_amount+$c->cafe_orders_sum_total_amount,2)])]);
}
public function store(Request $r) { Client::create($r->validate(['name'=>'required|string|max:255','email'=>'nullable|email|unique:clients,email','phone'=>'nullable|string|max:40','status'=>'required|in:active,paused,inactive'])); return back()->with('success','Client saved.'); }
''')
controller('Player',r'''
public function index() { return Inertia::render('Players/Index',[
 'metrics'=>['active_players'=>Player::where('status','active')->count(),'players_trend'=>0,'matches_played'=>Team::sum('wins')+Team::sum('losses'),'matches_trend'=>0],
 'players'=>Player::with('team')->get()->map(fn($p)=>['id'=>$p->id,'name'=>$p->name,'tier'=>$p->team?->name??'Independent','avatar'=>$p->avatar,'skill'=>$p->skill_level,'skill_max'=>5,'matches'=>$p->team?->wins+$p->team?->losses,'last_visit'=>'Not recorded','status'=>$p->status]), 'teams'=>Team::all(['id','name'])]); }
public function store(Request $r) { Player::create($r->validate(['name'=>'required|string|max:255','team_id'=>'nullable|exists:teams,id','skill_level'=>'required|integer|min:1|max:5','position'=>'nullable|string|max:40','status'=>'required|in:active,inactive,suspended'])); return back()->with('success','Player saved.'); }
''')
controller('Court',r'''
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
''')
controller('Cafe',r'''
public function index() { return Inertia::render('Cafe/Index',['products'=>StockItem::where('active',true)->whereIn('category',['cafe','Cafe','Bundles','Drinks','Snacks'])->where('quantity','>',0)->get()->map(fn($p)=>['id'=>$p->id,'name'=>$p->name,'category'=>$p->category==='Bundles'?'Bundles':'Cafe','price'=>(float)$p->unit_price,'image'=>$p->image,'stock'=>$p->quantity])]); }
public function store(Request $r) {
 $d=$r->validate(['items'=>'required|array|min:1','items.*.id'=>'required|integer|distinct|exists:stock_items,id','items.*.qty'=>'required|integer|min:1|max:1000','client_id'=>'nullable|exists:clients,id']);
 DB::transaction(function()use($d){
  $products=StockItem::whereIn('id',array_column($d['items'],'id'))->orderBy('id')->lockForUpdate()->get()->keyBy('id'); $subtotal=0; $lines=[];
  foreach($d['items'] as $line) { $p=$products[$line['id']]; if(!$p->active || !in_array($p->category,['cafe','Cafe','Bundles','Drinks','Snacks']) || $p->quantity<$line['qty']) throw ValidationException::withMessages(['items'=>'Insufficient available stock for '.$p->name.'.']);
   $cents=(int)round($p->unit_price*100); $subtotal+=$cents*$line['qty'];
   $lines[]=['stock_item_id'=>$p->id,'name'=>$p->name,'quantity'=>$line['qty'],'unit_price'=>$p->unit_price,'total'=>$cents*$line['qty']/100];
   $p->quantity-=$line['qty']; $p->status=$p->quantity===0?'out_of_stock':($p->quantity<$p->min_quantity?'low_stock':'in_stock'); $p->save();
  }
  $order=CafeOrder::create(['client_id'=>$d['client_id']??null,'order_date'=>today(),'status'=>'completed','total_amount'=>($subtotal+round($subtotal*0.05))/100,'items_summary'=>collect($lines)->map(fn($l)=>$l['quantity'].'x '.$l['name'])->join(', ')]);
  foreach($lines as $line) CafeOrderItem::create(['cafe_order_id'=>$order->id]+$line);
 }); return back()->with('success','Sale completed and stock updated.');
}
''')
controller('Stock',r'''
public function index() { return Inertia::render('Stock/Index',['metrics'=>['total_skus'=>StockItem::count(),'skus_trend'=>0,'low_stock'=>StockItem::whereColumn('quantity','<','min_quantity')->count(),'low_trend'=>0,'monthly_sales'=>(float)CafeOrder::where('status','completed')->whereBetween('order_date',[now()->startOfMonth(),now()->endOfMonth()])->sum('total_amount'),'sales_trend'=>0],
 'items'=>StockItem::all()->map(fn($p)=>['id'=>$p->id,'name'=>$p->name,'sku'=>'SKU-'.$p->id,'stock'=>$p->quantity,'max_stock'=>max($p->quantity,$p->min_quantity,1),'unit_price'=>(float)$p->unit_price,'value'=>$p->quantity*$p->unit_price,'status'=>$p->quantity<$p->min_quantity?'Low':'Good']), 'suppliers'=>Supplier::all(['id','name'])]); }
public function update(Request $r,StockItem $stock) { $d=$r->validate(['quantity'=>'required|integer|min:0','min_quantity'=>'required|integer|min:0']); $stock->fill($d); $stock->status=$stock->quantity===0?'out_of_stock':($stock->quantity<$stock->min_quantity?'low_stock':'in_stock'); $stock->save(); return back()->with('success','Stock updated.'); }
''')
controller('Supplier',r'''
public function index() { $suppliers=Supplier::with('purchases')->get(); return Inertia::render('Suppliers/Index',['suppliers'=>$suppliers->map(fn($s)=>array_merge($s->toArray(),['total_orders'=>$s->purchases->count(),'last_order'=>$s->purchases->sortByDesc('purchase_date')->first()?->purchase_date?->diffForHumans()??'No orders','balance'=>(float)$s->purchases->sum(fn($p)=>$p->total_amount-$p->paid_amount)])), 'metrics'=>['total_suppliers'=>$suppliers->count(),'active_suppliers'=>$suppliers->where('status','Active')->count(),'total_orders'=>Purchase::count(),'pending_balance'=>(float)(Purchase::sum('total_amount')-Purchase::sum('paid_amount'))]]); }
public function store(Request $r) { Supplier::create($r->validate(['name'=>'required|string|max:255','category'=>'nullable|string|max:255','contact'=>'nullable|string|max:255','phone'=>'nullable|string|max:40','email'=>'nullable|email|max:255','location'=>'nullable|string|max:255'])); return back()->with('success','Supplier saved.'); }
''')
controller('Product',r'''
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
''')
controller('Dashboard',r'''
public function index() {
 $revenue=fn($date)=>(float)Booking::whereDate('booking_date',$date)->where('status','completed')->sum('total_amount');
 $cafe=fn($date)=>(float)CafeOrder::whereDate('order_date',$date)->where('status','completed')->sum('total_amount');
 $count=fn($date)=>Booking::whereDate('booking_date',$date)->where('status','!=','cancelled')->count();
 $expenses=fn($date)=>Expense::whereDate('expense_date',$date)->count();
 $trend=fn($a,$b)=>$b>0?round(($a-$b)/$b*100):0;
 $today=today(); $yesterday=today()->subDay(); $capacity=Team::sum('max_players'); $stock=StockItem::count();
 return Inertia::render('Dashboard',['metrics'=>[
 'revenue_today'=>$revenue($today),'revenue_trend'=>$trend($revenue($today),$revenue($yesterday)),
 'today_bookings'=>$count($today),'bookings_trend'=>$trend($count($today),$count($yesterday)),
 'cafe_revenue'=>$cafe($today),'cafe_trend'=>$trend($cafe($today),$cafe($yesterday)),
 'expenses'=>$expenses($today),'expenses_trend'=>$trend($expenses($today),$expenses($yesterday)),
 'players_percentage'=>$capacity?round(Player::whereNotNull('team_id')->where('status','active')->count()/$capacity*100):0,'players_trend'=>0,
 'stock_percentage'=>$stock?round(StockItem::where('quantity','>',0)->whereColumn('quantity','>=','min_quantity')->count()/$stock*100):0,'stock_trend'=>0],
 'teams'=>Team::withCount(['players'=>fn($q)=>$q->where('status','active')])->get()->map(fn($t)=>['id'=>$t->id,'name'=>$t->name,'players_count'=>$t->players_count,'max_players'=>$t->max_players,'ready_ratio'=>min(4,$t->players_count).'/4']),
 'recentBookings'=>Client::orderByDesc('last_visit')->take(4)->get()->map(fn($c)=>['id'=>$c->id,'name'=>$c->name,'status'=>ucfirst($c->status),'last_visit'=>$c->last_visit?->diffForHumans()??'No visits'])]);
}
''')
controller('Team',r'''
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
''')
controller('Membership',r'''
public function index() {
 $active=Membership::whereDate('starts_at','<=',today())->whereDate('ends_at','>=',today());
 return Inertia::render('Memberships/Index',['plans'=>MembershipPlan::withCount(['memberships as subscribers'=>fn($q)=>$q->whereDate('starts_at','<=',today())->whereDate('ends_at','>=',today())])->get(),
 'metrics'=>['total_plans'=>MembershipPlan::count(),'active_members'=>$active->count(),'monthly_revenue'=>(float)Membership::whereBetween('starts_at',[now()->startOfMonth(),now()->endOfMonth()])->sum('amount'),'new_this_month'=>Membership::whereBetween('starts_at',[now()->startOfMonth(),now()->endOfMonth()])->count()], 'clients'=>Client::all(['id','name'])]);
}
public function store(Request $r) { return $this->save($r,new MembershipPlan); }
public function update(Request $r,MembershipPlan $membership) { return $this->save($r,$membership); }
private function save(Request $r,MembershipPlan $plan) { $plan->fill($r->validate(['name'=>'required|string|max:255','badge'=>'nullable|string|max:80','price'=>'required|numeric|min:0|max:99999999','duration'=>'required|integer|min:1|max:3650','color'=>'required|in:lime,blue,purple,amber','status'=>'required|in:Active,Inactive','perks'=>'required|array|max:30','perks.*'=>'nullable|string|max:255']))->save(); return back()->with('success','Membership plan saved.'); }
public function destroy(MembershipPlan $membership) { if($membership->memberships()->exists()) throw ValidationException::withMessages(['membership'=>'This plan has subscribers. Set it to Inactive instead.']); $membership->delete(); return back()->with('success','Plan deleted.'); }
public function enroll(Request $r) {
 $d=$r->validate(['client_id'=>'required|exists:clients,id','membership_plan_id'=>'required|exists:membership_plans,id','starts_at'=>'required|date_format:Y-m-d']);
 DB::transaction(function()use($d){ $client=Client::lockForUpdate()->findOrFail($d['client_id']); $plan=MembershipPlan::findOrFail($d['membership_plan_id']); $end=Carbon::parse($d['starts_at'])->addDays($plan->duration-1)->toDateString();
 if($plan->status!=='Active'||$client->memberships()->whereDate('starts_at','<=',$end)->whereDate('ends_at','>=',$d['starts_at'])->exists()) throw ValidationException::withMessages(['client_id'=>'This client already has a membership in that period, or the plan is inactive.']);
 Membership::create($d+['ends_at'=>$end,'amount'=>$plan->price]); }); return back()->with('success','Client enrolled.');
}
''')
controller('Report',r'''
private function summary() {
 $cafe=(float)CafeOrder::where('status','completed')->sum('total_amount');
 $revenue=(float)Booking::where('status','completed')->sum('total_amount')+$cafe+(float)Membership::sum('amount');
 $expenses=(float)Expense::sum('amount')+(float)Purchase::sum('total_amount');
 return ['total_revenue'=>$revenue,'total_expenses'=>$expenses,'net_profit'=>$revenue-$expenses,'total_bookings'=>Booking::count(),'cafe_revenue'=>$cafe,'active_players'=>Player::where('status','active')->count()];
}
private function render($tab,$rows) { return Inertia::render('Reports/Index',['tab'=>$tab,'summary'=>$this->summary(),'rows'=>$rows]); }
public function revenue() {
 $bookings=Booking::where('status','completed')->get()->groupBy(fn($b)=>$b->booking_date->toDateString());
 $cafe=CafeOrder::where('status','completed')->get()->groupBy(fn($o)=>$o->order_date->toDateString());
 $members=Membership::all()->groupBy(fn($m)=>$m->starts_at->toDateString());
 $dates=$bookings->keys()->merge($cafe->keys())->merge($members->keys())->unique()->sortDesc()->values();
 return $this->render('revenue',$dates->map(fn($date)=>['date'=>$date,'bookings'=>(float)($bookings->get($date)?->sum('total_amount')??0),'cafe'=>(float)($cafe->get($date)?->sum('total_amount')??0),'other'=>(float)($members->get($date)?->sum('amount')??0),'total'=>(float)($bookings->get($date)?->sum('total_amount')??0)+(float)($cafe->get($date)?->sum('total_amount')??0)+(float)($members->get($date)?->sum('amount')??0),'trend'=>0]));
}
public function expenses() { return $this->render('expenses',Expense::orderByDesc('expense_date')->get()->map(fn($e)=>['date'=>$e->expense_date->toDateString(),'category'=>$e->category,'amount'=>(float)$e->amount,'by'=>'Not recorded','note'=>$e->description])->concat(Purchase::with('supplier')->get()->map(fn($p)=>['date'=>$p->purchase_date->toDateString(),'category'=>'Inventory purchase','amount'=>(float)$p->total_amount,'by'=>$p->supplier->name,'note'=>'Purchase #'.$p->id]))); }
public function bookings() { return $this->render('bookings',Booking::with(['client','court'])->orderByDesc('booking_date')->get()->map(fn($b)=>['id'=>$b->id,'client'=>$b->client->name,'court'=>$b->court->name,'date'=>$b->booking_date->toDateString(),'time'=>$b->start_time,'duration'=>Carbon::parse($b->start_time)->diffInMinutes(Carbon::parse($b->end_time))/60,'amount'=>(float)$b->total_amount,'status'=>ucfirst($b->status)])); }
public function cafe() { return $this->render('cafe',CafeOrderItem::with('order')->whereHas('order',fn($q)=>$q->where('status','completed'))->get()->map(fn($i)=>['date'=>$i->order->order_date->toDateString(),'item'=>$i->name,'qty'=>$i->quantity,'unit_price'=>$i->unit_price,'total'=>$i->total])); }
public function players() { return $this->render('players',Player::with('team')->get()->map(fn($p)=>['name'=>$p->name,'tier'=>$p->team?->name??'Independent','matches'=>$p->team?->wins+$p->team?->losses,'wins'=>$p->team?->wins??0,'losses'=>$p->team?->losses??0,'revenue'=>0,'joined'=>$p->created_at->format('M Y')])); }
''')
controller('History',r'''
private function render($tab,$transactions=[],$expenses=[],$reconciliation=[]) { return Inertia::render('History/Index',compact('tab','transactions','expenses','reconciliation')+['metrics'=>['total_events'=>count($transactions)+count($expenses)+count($reconciliation),'events_trend'=>0,'refunds'=>0,'refunds_total'=>0,'refunds_trend'=>0,'cancellations'=>collect($transactions)->where('status','Cancelled')->count(),'cancel_trend'=>0]]); }
public function sales() {
 $orders=CafeOrder::with('client')->get()->map(fn($o)=>['id'=>'C-'.$o->id,'item'=>$o->items_summary??'Cafe sale','category'=>'Cafe','client'=>$o->client?->name??'Walk-in','time'=>$o->created_at->format('H:i'),'amount'=>(float)$o->total_amount,'status'=>ucfirst($o->status),'group'=>$o->order_date->toDateString()]);
 $bookings=Booking::with(['client','court'])->get()->map(fn($b)=>['id'=>'B-'.$b->id,'item'=>$b->court->name,'category'=>'Bookings','client'=>$b->client->name,'time'=>$b->start_time,'amount'=>(float)$b->total_amount,'status'=>ucfirst($b->status),'group'=>$b->booking_date->toDateString()]);
 return $this->render('sales',$orders->concat($bookings)->sortByDesc('group')->values());
}
public function purchases() { return $this->render('purchases',Purchase::with(['supplier','item'])->orderByDesc('purchase_date')->get()->map(fn($p)=>['id'=>$p->id,'item'=>$p->item->name.' x'.$p->quantity,'category'=>'Equipment','client'=>$p->supplier->name,'time'=>$p->created_at->format('H:i'),'amount'=>(float)$p->total_amount,'status'=>'Completed','group'=>$p->purchase_date->toDateString()])); }
public function expenses() { return $this->render('expenses',[],Expense::orderByDesc('expense_date')->get()->map(fn($e)=>['id'=>$e->id,'name'=>$e->description,'category'=>$e->category,'amount'=>(float)$e->amount,'date'=>$e->expense_date->toDateString(),'by'=>'Not recorded'])); }
public function reconciliation() { return $this->render('reconciliation',[],[],Reconciliation::with('user')->orderByDesc('date')->get()->map(fn($r)=>['id'=>$r->id,'shift'=>'Full day','cashier'=>$r->user->name,'date'=>$r->date->toDateString(),'expected'=>$r->expected,'actual'=>$r->actual,'variance'=>round($r->actual-$r->expected,2),'status'=>abs($r->actual-$r->expected)<0.01?'Balanced':($r->actual>$r->expected?'Over':'Short')])); }
public function storeExpense(Request $r) { Expense::create($r->validate(['description'=>'required|string|max:255','category'=>'required|string|max:80','amount'=>'required|numeric|min:0.01|max:99999999','expense_date'=>'required|date_format:Y-m-d','reference'=>'nullable|string|max:255'])); return back()->with('success','Expense saved.'); }
public function storePurchase(Request $r) {
 $d=$r->validate(['supplier_id'=>'required|exists:suppliers,id','stock_item_id'=>'required|exists:stock_items,id','quantity'=>'required|integer|min:1|max:100000','unit_price'=>'required|numeric|min:0|max:999999','paid_amount'=>'required|numeric|min:0','purchase_date'=>'required|date_format:Y-m-d']);
 DB::transaction(function()use($d){$item=StockItem::lockForUpdate()->findOrFail($d['stock_item_id']);$total=round($d['quantity']*$d['unit_price'],2);if($d['paid_amount']>$total)throw ValidationException::withMessages(['paid_amount'=>'Payment cannot exceed purchase total.']);Purchase::create($d+['total_amount'=>$total]);$item->quantity+=$d['quantity'];$item->status=$item->quantity<$item->min_quantity?'low_stock':'in_stock';$item->save();}); return back()->with('success','Purchase recorded and stock received.');
}
public function storeReconciliation(Request $r) {
 $d=$r->validate(['date'=>'required|date_format:Y-m-d|before_or_equal:today|unique:reconciliations,date','actual'=>'required|numeric|min:0|max:99999999']);
 $expected=(float)Booking::whereDate('booking_date',$d['date'])->where('status','completed')->where('payment_type','cash')->sum('total_amount')+(float)CafeOrder::whereDate('order_date',$d['date'])->where('status','completed')->sum('total_amount')-(float)Expense::whereDate('expense_date',$d['date'])->sum('amount')-(float)Purchase::whereDate('purchase_date',$d['date'])->sum('paid_amount');
 Reconciliation::create($d+['user_id'=>$r->user()->id,'expected'=>$expected]);return back()->with('success','Daily reconciliation saved.');
}
''')
controller('Settings',r'''
public function index() { return Inertia::render('Settings/Index',['settings'=>ClubSetting::first()]); }
public function update(Request $r) { $d=$r->validate(['name'=>'required|string|max:255','email'=>'nullable|email|max:255','phone'=>'nullable|string|max:40','website'=>'nullable|url|max:255','address'=>'nullable|string|max:255','about'=>'nullable|string|max:5000']); ClubSetting::updateOrCreate(['id'=>1],$d); return back()->with('success','Club settings saved.'); }
''')
controller('Support',r'''
public function index(Request $r) { return Inertia::render('Support/Index',['tickets'=>SupportTicket::where('user_id',$r->user()->id)->latest()->get()]); }
public function store(Request $r) { SupportTicket::create($r->validate(['subject'=>'required|string|max:255','category'=>'required|string|max:80','message'=>'required|string|max:10000'])+['user_id'=>$r->user()->id]); return back()->with('success','Ticket saved.'); }
''')
