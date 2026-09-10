<?php

namespace Tests\Feature;

use App\Models\Booking;
use App\Models\CafeOrder;
use App\Models\Client;
use App\Models\Court;
use App\Models\Expense;
use App\Models\Player;
use App\Models\StockItem;
use App\Models\Team;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Tests\TestCase;

class DatabaseSeederTest extends TestCase
{
    use RefreshDatabase;

    public function test_demo_seed_is_repeatable_and_preserves_existing_data(): void
    {
        $court = Court::create(['name' => 'Existing Court', 'type' => 'indoor', 'hourly_rate' => 90, 'status' => 'available']);
        $this->seed();
        $models = [User::class, Court::class, Client::class, Team::class, Player::class, Booking::class, CafeOrder::class, Expense::class, StockItem::class];
        $counts = array_map(fn ($model) => $model::count(), $models);
        $admin = User::where('email', 'admin@skylinepadel.com')->firstOrFail();
        $this->assertTrue(Hash::check('password', $admin->password));
        $admin->update(['password' => 'changed-password']);
        $this->seed();
        $this->assertSame($counts, array_map(fn ($model) => $model::count(), $models));
        $this->assertTrue(Hash::check('changed-password', $admin->fresh()->password));
        $this->assertDatabaseHas('courts', ['id' => $court->id, 'hourly_rate' => 90]);
        $this->assertSame(180, Booking::count());
        foreach (Booking::with(['client', 'court'])->get() as $booking) {
            $this->assertNotNull($booking->client);
            $this->assertNotSame($court->id, $booking->court_id);
            $this->assertSame($booking->court->hourly_rate, $booking->total_amount);
            $this->assertFalse(Booking::where('court_id', $booking->court_id)
                ->whereDate('booking_date', $booking->booking_date)->where('id', '!=', $booking->id)
                ->where('start_time', '<', $booking->end_time)->where('end_time', '>', $booking->start_time)->exists());
        }
    }
}
