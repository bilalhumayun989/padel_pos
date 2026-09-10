from pathlib import Path
import re
imports="import RecordForm from '@/Components/RecordForm';\n"
def add_form(folder,form):
 p=Path(f'resources/js/Pages/{folder}/Index.jsx');s=p.read_text();s=imports+s;s=s.replace('<AuthenticatedLayout facility={facility}>','<AuthenticatedLayout facility={facility}>\n            <div className="flex flex-wrap gap-3 mb-4">'+form+'</div>',1);p.write_text(s)
add_form('Clients', '''<RecordForm label="Add Client" endpoint={route('clients.store')} fields={[
 {name:'name',label:'Name',required:true},{name:'email',label:'Email',type:'email'},{name:'phone',label:'Phone'},
 {name:'status',label:'Status',value:'active',options:['active','paused','inactive'].map(v=>({value:v,label:v}))}
 ]} />''')
add_form('Players', '''<RecordForm label="Add Player" endpoint={route('players.store')} fields={[
 {name:'name',label:'Name',required:true},{name:'team_id',label:'Team',options:teams.map(t=>({value:t.id,label:t.name}))},
 {name:'skill_level',label:'Skill (1-5)',type:'number',value:3},{name:'position',label:'Position'},
 {name:'status',label:'Status',value:'active',options:['active','inactive','suspended'].map(v=>({value:v,label:v}))}
 ]} />''')
p=Path('resources/js/Pages/Players/Index.jsx');s=p.read_text().replace('players = [], facility','players = [], teams = [], facility');s=re.sub(r'<button[^>]*>\s*<Plus[^>]*/> Add New Player\s*</button>','',s);p.write_text(s)
add_form('Memberships', '''<RecordForm label="Enroll Client" endpoint={route('memberships.enroll')} fields={[
 {name:'client_id',label:'Client',required:true,options:clients.map(c=>({value:c.id,label:c.name}))},
 {name:'membership_plan_id',label:'Plan',required:true,options:plans.filter(p=>p.status==='Active').map(p=>({value:p.id,label:p.name}))},
 {name:'starts_at',label:'Start Date',type:'date',required:true}
 ]} />''')
p=Path('resources/js/Pages/Memberships/Index.jsx');s=p.read_text().replace('metrics = {}, facility','metrics = {}, clients = [], facility');p.write_text(s)
add_form('History', '''{tab === 'expenses' && <RecordForm label="Record Expense" endpoint={route('expenses.store')} fields={[
 {name:'description',label:'Description',required:true},{name:'category',label:'Category',required:true},{name:'amount',label:'Amount',type:'number',required:true},{name:'expense_date',label:'Date',type:'date',required:true},{name:'reference',label:'Reference'}]} />}
 {tab === 'purchases' && <RecordForm label="Receive Purchase" endpoint={route('purchases.store')} fields={[
 {name:'supplier_id',label:'Supplier',required:true,options:suppliers.map(s=>({value:s.id,label:s.name}))},
 {name:'stock_item_id',label:'Product',required:true,options:stockItems.map(s=>({value:s.id,label:s.name}))},
 {name:'quantity',label:'Quantity',type:'number',required:true},{name:'unit_price',label:'Unit Cost',type:'number',required:true},{name:'paid_amount',label:'Amount Paid',type:'number',value:0},{name:'purchase_date',label:'Date',type:'date',required:true}]} />}
 {tab === 'reconciliation' && <RecordForm label="Reconcile Day" endpoint={route('reconciliation.store')} fields={[
 {name:'date',label:'Date',type:'date',required:true},{name:'actual',label:'Actual closing amount',type:'number',required:true}]} />}''')
p=Path('resources/js/Pages/History/Index.jsx');s=p.read_text().replace("tab = 'sales',", "suppliers = [], stockItems = [], tab = 'sales',");p.write_text(s)
p=Path('app/Http/Controllers/HistoryController.php');s=p.read_text().replace("+['metrics'=>", "+['suppliers'=>Supplier::all(['id','name']),'stockItems'=>StockItem::all(['id','name']),'metrics'=>");p.write_text(s)
p=Path('resources/js/Pages/Stock/Index.jsx');s=imports+p.read_text();s=s.replace('<ItemCard key={item.id} item={item} />', '''<div key={item.id}><ItemCard item={item} /><RecordForm label="Adjust Stock" method="put" endpoint={route('stock.update',item.id)} fields={[
 {name:'quantity',label:'Quantity',type:'number',value:item.stock,required:true}, {name:'min_quantity',label:'Reorder threshold',type:'number',value:item.min_quantity,required:true}]} /></div>''');p.write_text(s)
p=Path('app/Http/Controllers/StockController.php');s=p.read_text().replace("'stock'=>$p->quantity,", "'stock'=>$p->quantity,'min_quantity'=>$p->min_quantity,");p.write_text(s)
# Booking teams are linked through real court bookings, not free-text team metadata.
p=Path('resources/js/Pages/Teams/Index.jsx');s=p.read_text();a=s.index('                                {/* Court + booking */}');b=s.index('                            <div className="flex gap-',a);s=s[:a]+'''                                <p className="text-sm text-gray-400">Use New Booking on the Schedule page to reserve a court for this team.</p>
                            </div>

'''+s[b:];p.write_text(s)
p=Path('app/Http/Controllers/BookingController.php');s=p.read_text().replace("'clients'=>Client::", "'teams'=>Team::all(['id','name']),\n 'clients'=>Client::");s=s.replace("'court_id'=>'required|exists:courts,id',", "'team_id'=>'nullable|exists:teams,id', 'court_id'=>'required|exists:courts,id',");s=s.replace("Booking::create(['court_id'", "Booking::create(['team_id'=>$data['team_id']??null,'court_id'");p.write_text(s)
p=Path('resources/js/Pages/Bookings/Create.jsx');s=p.read_text().replace('clients = [], facility','clients = [], teams = [], facility').replace("court_id:     '',","court_id:     '',\n        team_id: '',");s=s.replace('<form onSubmit={handleSubmit} className="flex flex-col gap-4">','''<form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <label className="text-gray-300 text-sm">Team (optional)<select className="ml-3 bg-slate-800 rounded-lg" value={data.team_id} onChange={e=>setData('team_id',e.target.value)}><option value="">No team</option>{teams.map(t=><option key={t.id} value={t.id}>{t.name}</option>)}</select></label>''');p.write_text(s)
# Existing image URL field is the supported persistent image input.
p=Path('resources/js/Pages/Courts/Index.jsx');s=p.read_text();s=re.sub(r'<button type="button" onClick=\{\(\) => fileRef.current\?\.click\(\)\}[\s\S]*?</button>','',s);s=s.replace('<option value="Rooftop">Rooftop</option>','').replace('<option value="Inactive">Inactive</option>','');p.write_text(s)
p=Path('resources/js/Pages/Schedule/Index.jsx');s=p.read_text().replace('{ Head','{ router, Head',1).replace("today = 'Tuesday, Oct 24', facility", "today = '', date = '', facility");s=s.replace('<ChevronLeft className="w-4 h-4 text-gray-400 hover:text-white cursor-pointer" />\n                            <span className="text-xs font-semibold text-white px-2">Today</span>\n                            <ChevronRight className="w-4 h-4 text-gray-400 hover:text-white cursor-pointer" />', '<input aria-label="Schedule date" type="date" value={date} onChange={e=>router.get(route(\'schedule.index\'), { date:e.target.value })} className="bg-slate-800 rounded-lg text-white" />');s=s.replace("['Daily','Weekly']","['Daily']");s=s.replace('<button className="flex items-center gap-1 text-xs font-semibold text-white border border-white/25 rounded-full px-3 py-1.5 hover:border-white/50 transition-all">','<button onClick={()=>router.visit(route(\'reports.bookings\'))} className="flex items-center gap-1 text-xs font-semibold text-white border border-white/25 rounded-full px-3 py-1.5 hover:border-white/50 transition-all">');p.write_text(s)
# Empty databases must show zero rather than design mock totals.
for p in Path('resources/js/Pages').rglob('*.jsx'):
 s=p.read_text();s=re.sub(r'(metrics\??\.[a-z_]+\s*\?\?)\s*-?\d+',r'\1 0',s);p.write_text(s)
