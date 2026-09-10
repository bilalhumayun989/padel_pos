<?php
namespace App\Http\Controllers;
use App\Models\{Booking, CafeOrder, CafeOrderItem, Client, Court, Expense, Player, StockItem, Team, Supplier, Membership, MembershipPlan, Purchase, Reconciliation, ClubSetting, SupportTicket};
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;
use Illuminate\Support\Carbon;
use Inertia\Inertia;
class SettingsController extends Controller {

public function index() { return Inertia::render('Settings/Index',['settings'=>ClubSetting::first()]); }
public function update(Request $r) { $d=$r->validate(['name'=>'required|string|max:255','email'=>'nullable|email|max:255','phone'=>'nullable|string|max:40','website'=>'nullable|url|max:255','address'=>'nullable|string|max:255','about'=>'nullable|string|max:5000']); ClubSetting::updateOrCreate(['id'=>1],$d); return back()->with('success','Club settings saved.'); }

}
