<?php

namespace Tests\Feature;

use App\Models\{Booking, Client, Court, Team, User};
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class DashboardLiveTest extends TestCase
{
    use RefreshDatabase;

    public function test_team_status_follows_booking_times_and_recent_rows_are_bookings(): void
    {
        $this->travelTo(now()->startOfDay()->setHour(12));
        $this->actingAs(User::factory()->create());
        $team = Team::create(['name'=>'Test Team', 'status'=>'active', 'max_players'=>12]);
        $court = Court::create(['name'=>'Test Court', 'type'=>'indoor', 'hourly_rate'=>60, 'status'=>'available']);
        $client = Client::create(['name'=>'Booked Client', 'status'=>'active']);
        Client::create(['name'=>'Unbooked Client', 'status'=>'active', 'last_visit'=>today()]);
        $booking = Booking::create([
            'team_id'=>$team->id, 'court_id'=>$court->id, 'client_id'=>$client->id,
            'booking_date'=>today(), 'start_time'=>'12:00:00', 'end_time'=>'13:00:00',
            'status'=>'confirmed', 'total_amount'=>60,
        ]);

        $this->get('/')->assertOk()->assertInertia(fn(Assert $page)=>$page
            ->where('teams.0.session_status', 'Live now')
            ->has('recentBookings', 1)->where('recentBookings.0.id', $booking->id)
            ->where('recentBookings.0.name', 'Booked Client')->etc());

        $this->travelTo(now()->setHour(11));
        $this->get('/')->assertInertia(fn(Assert $page)=>$page->where('teams.0.session_status', 'Up next')->etc());
        $this->travelTo(now()->setHour(13));
        $this->get('/')->assertInertia(fn(Assert $page)=>$page->where('teams.0.session_status', 'No session')->etc());
        $this->travelTo(now()->setHour(12));
        $booking->update(['status'=>'cancelled']);
        $this->get('/')->assertInertia(fn(Assert $page)=>$page->where('teams.0.session_status', 'No session')->etc());
    }
}
