<?php

namespace Database\Seeders;

use App\Models\Booking;
use App\Models\CafeOrder;
use App\Models\CafeOrderItem;
use App\Models\ClubSetting;
use App\Models\MembershipPlan;
use App\Models\Supplier;
use App\Models\Client;
use App\Models\Court;
use App\Models\Expense;
use App\Models\Player;
use App\Models\StockItem;
use App\Models\Team;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // Demo credentials and business data belong only in local/test databases.
        if (! app()->environment(['local', 'testing'])) {
            $this->command?->warn('Demo seeding is limited to local and testing environments.');

            return;
        }

        DB::transaction(function () {
            ClubSetting::firstOrCreate(['id' => 1], ['name' => 'Skyline Padel']);
            Supplier::firstOrCreate(['name' => 'Local Equipment Supplier'], ['category' => 'Equipment', 'status' => 'Active']);
            Supplier::firstOrCreate(['name' => 'Local Cafe Supplier'], ['category' => 'Cafe', 'status' => 'Active']);
            foreach ([['Basic', 30, 'gray'], ['Pro', 60, 'lime'], ['Elite', 100, 'white']] as [$name, $price, $color]) {
                MembershipPlan::firstOrCreate(['name' => $name], ['price' => $price, 'duration' => 30, 'color' => $color, 'status' => 'Active', 'perks' => ['Club membership']]);
            }
            User::firstOrCreate(['email' => 'admin@skylinepadel.com'], [
                'name' => 'Skyline Padel Admin',
                'password' => Hash::make('password'),
                'email_verified_at' => now(),
            ]);

            $courts = collect([
                ['Main Court 1', 'indoor', 60],
                ['Main Court 2', 'indoor', 60],
                ['Outdoor Court 1', 'outdoor', 45],
            ])->map(fn ($court) => Court::firstOrCreate(['name' => $court[0]], [
                'type' => $court[1], 'hourly_rate' => $court[2], 'status' => 'available',
            ]));

            $names = ['Umar Iqbal', 'Saad Khalid', 'Zohaib', 'Fahad', 'Ali Hassan',
                'Ahmed Khan', 'Bilal Ahmed', 'Hamza Malik', 'Hassan Raza', 'Usman Shah',
                'Ayesha Khan', 'Sara Ahmed', 'Zain Ali', 'Omar Farooq', 'Danish Aslam',
                'Haris Rauf', 'Fatima Noor', 'Maryam Ali', 'Imran Asif', 'Talha Saeed'];
            $emails = ['umar', 'saad', 'zohaib', 'fahad'];
            $clients = collect($names)->map(fn ($name, $i) => Client::firstOrCreate([
                'email' => ($emails[$i] ?? 'client'.($i + 1)).'@example.com',
            ], [
                'name' => $name, 'phone' => '+1555010'.sprintf('%04d', $i + 1),
                'status' => 'active', 'last_visit' => Carbon::today()->subDays($i % 7),
            ]));

            foreach (['Team Alpha' => '#22c55e', 'Team Smashers' => '#3b82f6'] as $name => $color) {
                $team = Team::firstOrCreate(['name' => $name], [
                    'max_players' => 12, 'color' => $color, 'status' => 'active',
                ]);
                for ($i = 1; $i <= 12; $i++) {
                    Player::firstOrCreate([
                        'team_id' => $team->id,
                        'name' => ($name === 'Team Alpha' ? 'Alpha' : 'Smasher')." Player $i",
                    ], ['position' => $i % 2 === 0 ? 'Left' : 'Right', 'status' => 'active', 'skill_level' => 1 + ($i % 5)]);
                }
            }

            // Past activity for reports, today's bookings, and upcoming sessions.
            for ($day = -7; $day <= 7; $day++) {
                $date = Carbon::today()->addDays($day)->toDateString();
                foreach ($courts as $index => $court) {
                    foreach ([9, 12, 16, 19] as $slot => $hour) {
                        $start = sprintf('%02d:00:00', $hour);
                        $end = sprintf('%02d:00:00', $hour + 1);
                        // Preserve existing bookings, including overlapping manually entered sessions.
                        $occupied = Booking::where('court_id', $court->id)->whereDate('booking_date', $date)
                            ->where('status', '!=', 'cancelled')->where('start_time', '<', $end)
                            ->where('end_time', '>', $start)->exists();
                        if (! $occupied) {
                            Booking::firstOrCreate([
                                'court_id' => $court->id, 'booking_date' => $date, 'start_time' => $start,
                            ], [
                                'client_id' => $clients[($index * 4 + $slot) % $clients->count()]->id,
                                'end_time' => $end, 'status' => $day < 0 ? 'completed' : 'confirmed',
                                'total_amount' => $court->hourly_rate, 'notes' => 'Demo padel session',
                            ]);
                        }
                    }
                }
                if ($day > 0) {
                    continue;
                }
                foreach ($clients->take(4) as $client) {
                    CafeOrder::whereDate('order_date', $date)->firstOrCreate([
                        'client_id' => $client->id,
                        'items_summary' => '1x Protein Shake, 1x Water',
                    ], ['order_date' => $date, 'total_amount' => 12, 'status' => 'completed']);
                }
                foreach (['Court cleaning' => 35, 'Electricity' => 50, 'Cafe supplies' => 25] as $description => $amount) {
                    Expense::firstOrCreate(['reference' => 'DEMO-'.$date.'-'.str($description)->slug()], [
                        'description' => $description, 'amount' => $amount,
                        'category' => $description === 'Electricity' ? 'utilities' : 'maintenance',
                        'expense_date' => $date,
                    ]);
                }
            }

            foreach ([
                ['Padel Balls (Babolat)', 'equipment', 84, 20, 12],
                ['Padel Rackets (Head)', 'equipment', 15, 5, 150],
                ['Grip Tapes', 'equipment', 50, 10, 5],
                ['Bottled Water', 'cafe', 120, 24, 2],
                ['Protein Shake', 'cafe', 8, 10, 10],
                ['Court Cleaning Solution', 'maintenance', 0, 3, 18],
            ] as [$name, $category, $quantity, $minimum, $price]) {
                StockItem::firstOrCreate(['name' => $name], [
                    'category' => $category, 'quantity' => $quantity, 'min_quantity' => $minimum,
                    'unit_price' => $price, 'unit' => 'pcs',
                    'status' => $quantity === 0 ? 'out_of_stock' : ($quantity < $minimum ? 'low_stock' : 'in_stock'),
                ]);
            }

            // Itemized demo receipts use the same products as the live checkout.
            $demoOrders = CafeOrder::where('items_summary', '1x Protein Shake, 1x Water')
                ->whereIn('client_id', $clients->take(4)->pluck('id'))->get();
            foreach ($demoOrders as $order) {
                foreach (['Protein Shake' => 10, 'Bottled Water' => 2] as $name => $price) {
                    $product = StockItem::where('name', $name)->firstOrFail();
                    CafeOrderItem::firstOrCreate(['cafe_order_id' => $order->id, 'stock_item_id' => $product->id], [
                        'name' => $name, 'quantity' => 1, 'unit_price' => $price, 'total' => $price,
                    ]);
                }
            }
        });
    }
}
