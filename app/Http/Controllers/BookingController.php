<?php

namespace App\Http\Controllers;

use App\Models\{Booking, CafeOrder, CafeOrderItem, Client, Court, Expense, Player, StockItem, Team, Supplier, Membership, MembershipPlan, Purchase, Reconciliation, ClubSetting, SupportTicket};

use Illuminate\Http\Request;

use Illuminate\Support\Facades\DB;

use Illuminate\Validation\ValidationException;

use Illuminate\Support\Carbon;

use Inertia\Inertia;

class BookingController extends Controller {



public function create() {

 return Inertia::render('Bookings/Create', [

 'courts'=>Court::where('status','!=','maintenance')->get()->map(fn($c)=>['id'=>$c->id,'name'=>$c->name,'type'=>ucfirst($c->type),'price_per_hour'=>(float)$c->hourly_rate]),

 'teams'=>Team::all(['id','name']),
 'clients'=>Client::where('status','active')->get(['id','name']),

 'time_slots'=>array_map(fn($h)=>sprintf('%02d:00',$h),range(8,21)),

 ]);

}

public function store(Request $request) {

 $data=$request->validate([

 'team_id'=>'nullable|exists:teams,id', 'court_id'=>'required|exists:courts,id', 'client_id'=>'nullable|exists:clients,id',

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

  Booking::create(['team_id'=>$data['team_id']??null,'court_id'=>$court->id,'client_id'=>$client->id,'booking_date'=>$data['date'],'start_time'=>$start->format('H:i:s'),'end_time'=>$end->format('H:i:s'),'total_amount'=>round($court->hourly_rate*$data['duration'],2),'status'=>'confirmed','players'=>$data['players'],'payment_type'=>$data['payment_type'],'notes'=>$data['notes']??null]);

 });

 return redirect()->route('schedule.index',['date'=>$data['date']])->with('success','Booking saved.');

}




public function update(Request $request, Booking $booking) {
 $data=$request->validate(['status'=>'required|in:completed,cancelled']);
 DB::transaction(function() use($booking,$data) {
 Court::whereKey($booking->court_id)->lockForUpdate()->firstOrFail(); $booking->refresh();
 if(!in_array($booking->status,['confirmed','pending'])) throw ValidationException::withMessages(['status'=>'Only pending or confirmed bookings can be changed.']);
 if($data['status']==='completed' && Carbon::parse($booking->booking_date->toDateString().' '.$booking->end_time)->isFuture()) throw ValidationException::withMessages(['status'=>'A session can be completed after its end time.']);
 $booking->update($data);
 if($data['status']==='completed') { $client=Client::lockForUpdate()->findOrFail($booking->client_id); if(!$client->last_visit || $client->last_visit->lt($booking->booking_date)) $client->update(['last_visit'=>$booking->booking_date]); }
 }); return back()->with('success','Booking updated.');
}
}

