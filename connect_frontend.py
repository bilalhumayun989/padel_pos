from pathlib import Path
p=Path('routes/web.php');s=p.read_text();block=''
for path,cls,param in [('courts','Court','court'),('teams','Team','team'),('memberships','Membership','membership'),('products','Product','product')]:
 block+=f"    Route::post('/{path}', [{cls}Controller::class, 'store'])->name('{path}.store');\n    Route::put('/{path}/{{{param}}}', [{cls}Controller::class, 'update'])->name('{path}.update');\n    Route::delete('/{path}/{{{param}}}', [{cls}Controller::class, 'destroy'])->name('{path}.destroy');\n"
for path,cls,action,name in [('clients','Client','store','clients.store'),('players','Player','store','players.store'),('suppliers','Supplier','store','suppliers.store'),('cafe','Cafe','store','cafe.store'),('memberships/enroll','Membership','enroll','memberships.enroll'),('history/expenses','History','storeExpense','expenses.store'),('history/purchases','History','storePurchase','purchases.store'),('history/reconciliation','History','storeReconciliation','reconciliation.store'),('support','Support','store','support.store')]:
 block+=f"    Route::post('/{path}', [{cls}Controller::class, '{action}'])->name('{name}');\n"
block+="    Route::put('/stock/{stock}', [StockController::class, 'update'])->name('stock.update');\n    Route::put('/settings', [SettingsController::class, 'update'])->name('settings.update');\n"
s=s.replace("Route::middleware('auth')->group(function () {","Route::middleware('auth')->group(function () {\n"+block);p.write_text(s)
p=Path('app/Http/Middleware/HandleInertiaRequests.php');s=p.read_text().replace("'auth' => [","'flash' => ['success' => fn () => $request->session()->get('success')],\n            'facility' => fn () => ['name' => \\App\\Models\\ClubSetting::first()?->name ?? 'Skyline Padel', 'subtext' => 'Padel Club'],\n            'auth' => [");p.write_text(s)
p=Path('resources/js/Layouts/AuthenticatedLayout.jsx');s=p.read_text().replace('const { auth } = usePage().props;', 'const { auth, errors = {}, flash = {} } = usePage().props;');s=s.replace('<main className="flex-1 flex flex-col">{children}</main>', '''<main className="flex-1 flex flex-col">
                    {flash.success && <div role="status" className="p-3 mb-3 bg-lime-900 text-lime-100 rounded-xl">{flash.success}</div>}
                    {Object.keys(errors).length > 0 && <div role="alert" className="fixed top-4 right-4 z-[100] max-w-md p-4 bg-red-950 text-red-100 rounded-xl">{Object.values(errors).map((error,i) => <p key={i}>{error}</p>)}</div>}
                    {children}</main>''');p.write_text(s)
# Replace browser-only saves with server requests, and render current props after a save.
for folder,state,prop,param in [('Courts','courts','initialCourts','court'),('Teams','teams','initial','team'),('Memberships','plans','initialPlans','membership')]:
 p=Path(f'resources/js/Pages/{folder}/Index.jsx');s=p.read_text();s=s.replace("{ Head", "{ router, Head",1)
 import re
 s=re.sub(r'const \['+state+r', set\w+\]\s*= useState\('+prop+r'\);','const '+state+' = '+prop+';',s)
 start=s.index('    const handleSave = () => {');end=s.index('    const stats =',start)
 route=folder.lower()
 s=s[:start]+f'''    const handleSave = () => {{
        const payload = {{ ...form }};
        router[editId ? 'put' : 'post'](route(editId ? '{route}.update' : '{route}.store', editId || undefined), payload, {{ onSuccess: close }});
    }};
    const handleDelete = (id, e) => {{ e?.stopPropagation(); router.delete(route('{route}.destroy', id), {{ onSuccess: () => {{ {'setSelected(null);' if folder=='Teams' else ''} }} }}); }};

'''+s[end:]
 # Image blobs cannot survive a reload; keep the existing image URL input.
 if folder=='Courts':
  s=s.replace("const url = URL.createObjectURL(file);\n        setPreview(url);\n        setForm(f => ({ ...f, image: url }));", "setPreview('');\n        setForm(f => ({ ...f, image: '' }));")
  s=re.sub(r'<input[^>]*type="file"[\s\S]*?/>','',s)
  s=s.replace('onClick={() => fileRef.current.click()}','onClick={() => document.querySelector(\'[name="image"]\')?.focus()}')
 p.write_text(s)
p=Path('resources/js/Pages/Products/Index.jsx');s=p.read_text().replace('{ Head','{ router, Head',1);s=s.replace('    const statCards = [',"    const handleSave = () => router[editItem ? 'put' : 'post'](route(editItem ? 'products.update' : 'products.store', editItem || undefined), form, { onSuccess: closeModal });\n\n    const statCards = [");s=s.replace('<button onClick={closeModal}\n                                    disabled=', '<button onClick={handleSave}\n                                    disabled=');s=s.replace('<button\n                                    disabled=', '<button onClick={handleSave}\n                                    disabled=');p.write_text(s)
p=Path('resources/js/Pages/Suppliers/Index.jsx');s=p.read_text().replace('{ Head','{ router, Head',1);s=re.sub(r'const handleSave\s*=.*?;\s*};',"const handleSave = () => router.post(route('suppliers.store'), form, { onSuccess: () => { setShowModal(false); setForm({ name:'', category:'', contact:'', phone:'', email:'', location:'' }); } });",s);p.write_text(s)
p=Path('resources/js/Pages/Cafe/Index.jsx');s=p.read_text().replace('{ Head','{ router, Head',1).replace("'cafe_cart'","'padel_mysql_cart_v1'");s=s.replace("    const [activeTab", "    const [processing, setProcessing] = useState(false);\n    const checkout = () => { setProcessing(true); router.post(route('cafe.store'), { items: cart.map(i => ({ id: i.id, qty: i.qty })) }, { onSuccess: () => setCart([]), onFinish: () => setProcessing(false) }); };\n    const [activeTab",1);s=s.replace('disabled={cart.length === 0}', 'onClick={checkout}\n                                disabled={processing || cart.length === 0}');p.write_text(s)
p=Path('resources/js/Pages/Bookings/Create.jsx');s=p.read_text().replace('post, processing }','post, processing, errors }');s=s.replace('<form onSubmit={handleSubmit} className="flex flex-col gap-4">','<form onSubmit={handleSubmit} className="flex flex-col gap-4">\n                    {Object.values(errors).map((e,i) => <p key={i} className="text-red-300">{e}</p>)}');p.write_text(s)
# Remove invented financial fallbacks and hardcoded currency conversions.
for p in Path('resources/js/Pages').rglob('*.jsx'):
 s=p.read_text();s=re.sub(r'\?\? (287500|45200|242300|312|38400|47)', '?? 0',s);s=re.sub(r'\*\s*280','',s);p.write_text(s)
