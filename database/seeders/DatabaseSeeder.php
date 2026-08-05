<?php

namespace Database\Seeders;

use App\Models\Booking;
use App\Models\CafeOrder;
use App\Models\Client;
use App\Models\Court;
use App\Models\Expense;
use App\Models\Player;
use App\Models\StockItem;
use App\Models\Team;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Carbon;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // Seed default user
        User::factory()->create([
            'name' => 'Skyline Padel Admin',
            'email' => 'admin@skylinepadel.com',
        ]);

        // Seed Courts
        $court1 = Court::create(['name' => 'Main Court 1', 'type' => 'indoor', 'hourly_rate' => 60.00, 'status' => 'booked']);
        $court2 = Court::create(['name' => 'Main Court 2', 'type' => 'indoor', 'hourly_rate' => 60.00, 'status' => 'available']);
        $court3 = Court::create(['name' => 'Outdoor Court 1', 'type' => 'outdoor', 'hourly_rate' => 45.00, 'status' => 'booked']);

        // Seed Clients (with specific names matching UI)
        $clientUmar = Client::create(['name' => 'Umar Iqbal', 'email' => 'umar@example.com', 'phone' => '+1234567890', 'status' => 'active', 'last_visit' => Carbon::today()]);
        $clientSaad = Client::create(['name' => 'Saad khalid', 'email' => 'saad@example.com', 'phone' => '+1234567891', 'status' => 'active', 'last_visit' => Carbon::yesterday()]);
        $clientZohaib = Client::create(['name' => 'Zohaib', 'email' => 'zohaib@example.com', 'phone' => '+1234567892', 'status' => 'paused', 'last_visit' => Carbon::today()->subDays(3)]);
        $clientFahad = Client::create(['name' => 'Fahad', 'email' => 'fahad@example.com', 'phone' => '+1234567893', 'status' => 'active', 'last_visit' => Carbon::today()]);

        // Extra clients to make total realistic
        for ($i = 5; $i <= 20; $i++) {
            Client::create([
                'name' => "Client $i",
                'email' => "client$i@example.com",
                'status' => 'active',
                'last_visit' => Carbon::today()->subDays(rand(0, 10)),
            ]);
        }

        // Seed Teams matching UI
        $teamAlpha = Team::create(['name' => 'Team Alpha', 'max_players' => 12, 'color' => '#22c55e', 'status' => 'active']);
        $teamSmashers = Team::create(['name' => 'Team Smashers', 'max_players' => 12, 'color' => '#3b82f6', 'status' => 'active']);

        // Seed Players for Teams
        for ($i = 1; $i <= 12; $i++) {
            Player::create([
                'name' => "Alpha Player $i",
                'team_id' => $teamAlpha->id,
                'position' => $i % 2 == 0 ? 'Left' : 'Right',
                'status' => 'active',
            ]);
            Player::create([
                'name' => "Smasher Player $i",
                'team_id' => $teamSmashers->id,
                'position' => $i % 2 == 0 ? 'Left' : 'Right',
                'status' => 'active',
            ]);
        }

        // Seed Bookings Today (to yield ~$1,560 total court revenue today and 36 count total bookings)
        for ($i = 1; $i <= 36; $i++) {
            $client = match ($i % 4) {
                0 => $clientUmar,
                1 => $clientSaad,
                2 => $clientZohaib,
                default => $clientFahad,
            };

            Booking::create([
                'client_id' => $client->id,
                'court_id' => ($i % 3) + 1,
                'booking_date' => Carbon::today(),
                'start_time' => sprintf('%02d:00:00', 8 + ($i % 12)),
                'end_time' => sprintf('%02d:00:00', 9 + ($i % 12)),
                'status' => 'confirmed',
                'total_amount' => 43.33, // 36 * 43.33 ~ 1560
            ]);
        }

        // Yesterday Bookings for trend calc
        for ($i = 1; $i <= 33; $i++) {
            Booking::create([
                'client_id' => $clientUmar->id,
                'court_id' => 1,
                'booking_date' => Carbon::yesterday(),
                'start_time' => '10:00:00',
                'end_time' => '11:00:00',
                'status' => 'completed',
                'total_amount' => 42.20,
            ]);
        }

        // Seed Cafe Orders Today ($120 target)
        for ($i = 1; $i <= 6; $i++) {
            CafeOrder::create([
                'client_id' => $clientUmar->id,
                'total_amount' => 20.00,
                'order_date' => Carbon::today(),
                'status' => 'completed',
                'items_summary' => '2x Protein Shake, 1x Water',
            ]);
        }
        // Yesterday Cafe Orders ($113 for trend)
        CafeOrder::create(['client_id' => $clientSaad->id, 'total_amount' => 113.00, 'order_date' => Carbon::yesterday(), 'status' => 'completed']);

        // Seed Expenses (43 today)
        for ($i = 1; $i <= 43; $i++) {
            Expense::create([
                'description' => "Court maintenance / supplies item $i",
                'amount' => 15.00,
                'category' => 'maintenance',
                'expense_date' => Carbon::today(),
            ]);
        }
        for ($i = 1; $i <= 40; $i++) {
            Expense::create([
                'description' => "Yesterday expense $i",
                'amount' => 15.00,
                'category' => 'maintenance',
                'expense_date' => Carbon::yesterday(),
            ]);
        }

        // Stock Items (Targeting 84% health)
        StockItem::create(['name' => 'Padel Balls (Babolat)', 'category' => 'equipment', 'quantity' => 84, 'min_quantity' => 20, 'unit_price' => 12.00, 'status' => 'in_stock']);
        StockItem::create(['name' => 'Padel Rackets (Head)', 'category' => 'equipment', 'quantity' => 15, 'min_quantity' => 5, 'unit_price' => 150.00, 'status' => 'in_stock']);
        StockItem::create(['name' => 'Grip Tapes', 'category' => 'equipment', 'quantity' => 50, 'min_quantity' => 10, 'unit_price' => 5.00, 'status' => 'in_stock']);
    }
}
