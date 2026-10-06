<?php

namespace App\Http\Controllers;

use App\Models\Client;
use App\Models\Booking;
use App\Models\CafeOrder;
use App\Models\CafeOrderItem;
use App\Models\Court;
use App\Models\Expense;
use App\Models\Membership;
use App\Models\MembershipPlan;
use App\Models\Player;
use App\Models\Purchase;
use App\Models\Reconciliation;
use App\Models\StockItem;
use App\Models\Supplier;
use App\Models\SupportTicket;
use App\Models\Team;
use App\Models\User;
use App\Support\DemoWorkspace;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Session;
use Illuminate\Support\Str;

class DemoController extends Controller
{
    private const WORKSPACE_VERSION = 2;

    public function enter()
    {
        $demo = User::firstOrCreate(['email' => 'demo@skylinepadel.com'], [
            'name' => 'Demo User',
            'password' => Hash::make(Str::random(64)),
            'email_verified_at' => now(),
        ]);

        if (Session::get('demo_workspace_version') !== self::WORKSPACE_VERSION) {
            $workspace = $this->provisionDefaults($demo);
            Session::forget('demo_usage');
            DemoWorkspace::set($workspace);
            Session::put('demo_workspace_version', self::WORKSPACE_VERSION);
        }

        Auth::guard('web')->login($demo, true);

        return app(DashboardController::class)->index();
    }

    private function provisionDefaults(User $demo): array
    {
        $sessionToken = Str::random(6);

        $supplier = Supplier::create([
            'name' => 'Demo Supplier',
            'category' => 'Equipment',
            'status' => 'Active',
            'is_demo' => true,
        ]);

        $client = Client::create([
            'name' => 'Demo Client',
            'email' => 'demo.client.' . $sessionToken . '@example.com',
            'phone' => '+1 555-0199',
            'status' => 'active',
            'is_demo' => true,
        ]);

        $plan = MembershipPlan::create([
            'name' => 'Demo Package',
            'price' => 50,
            'duration' => 30,
            'color' => 'lime',
            'status' => 'Active',
            'perks' => ['Demo access'],
            'is_demo' => true,
        ]);

        $court = Court::create([
            'name' => 'Demo Court',
            'type' => 'indoor',
            'hourly_rate' => 60,
            'status' => 'available',
            'image' => 'https://images.unsplash.com/photo-1554068865-24cecd4e34b8?auto=format&fit=crop&w=800&q=80',
            'is_demo' => true,
        ]);

        $product = StockItem::create([
            'name' => 'Demo Service',
            'category' => 'Cafe',
            'quantity' => 10,
            'min_quantity' => 2,
            'unit_price' => 10,
            'cost' => 5,
            'unit' => 'unit',
            'status' => 'in_stock',
            'supplier_id' => $supplier->id,
            'active' => true,
            'image' => 'https://images.unsplash.com/photo-1551024506-0bccd828d307?auto=format&fit=crop&w=800&q=80',
            'is_demo' => true,
        ]);

        $team = Team::create([
            'name' => 'Demo Staff',
            'max_players' => 4,
            'color' => '#a3e635',
            'status' => 'active',
            'is_demo' => true,
        ]);

        $player = Player::create([
            'team_id' => $team->id,
            'name' => 'Demo Employee',
            'position' => 'Right',
            'status' => 'active',
            'skill_level' => 3,
            'is_demo' => true,
        ]);

        $booking = Booking::create([
            'court_id' => $court->id,
            'client_id' => $client->id,
            'team_id' => $team->id,
            'booking_date' => today()->addDay(),
            'start_time' => '10:00:00',
            'end_time' => '11:00:00',
            'status' => 'confirmed',
            'total_amount' => $court->hourly_rate,
            'players' => 1,
            'payment_type' => 'cash',
            'notes' => 'Demo booking',
            'is_demo' => true,
        ]);

        $membership = Membership::create([
            'client_id' => $client->id,
            'membership_plan_id' => $plan->id,
            'starts_at' => today()->toDateString(),
            'ends_at' => today()->addDays($plan->duration - 1)->toDateString(),
            'amount' => $plan->price,
            'is_demo' => true,
        ]);

        $order = CafeOrder::create([
            'client_id' => $client->id,
            'order_date' => today(),
            'items_summary' => '1x Demo Service',
            'total_amount' => 10.0,
            'status' => 'completed',
            'is_demo' => true,
        ]);

        $orderItem = CafeOrderItem::create([
            'cafe_order_id' => $order->id,
            'stock_item_id' => $product->id,
            'name' => 'Demo Service',
            'quantity' => 1,
            'unit_price' => 10,
            'total' => 10,
            'is_demo' => true,
        ]);

        $expense = Expense::firstOrCreate([
            'reference' => 'DEMO-EXPENSE-' . strtoupper($sessionToken),
        ], [
            'description' => 'Demo court maintenance',
            'amount' => 15,
            'category' => 'maintenance',
            'expense_date' => today(),
            'is_demo' => true,
        ]);

        $purchase = Purchase::create([
            'supplier_id' => $supplier->id,
            'stock_item_id' => $product->id,
            'purchase_date' => today(),
            'quantity' => 1,
            'unit_price' => 5,
            'total_amount' => 5,
            'paid_amount' => 5,
            'is_demo' => true,
        ]);

        $reconciliation = Reconciliation::withoutGlobalScope('demo_workspace')->firstOrCreate([
            'date' => today(),
        ], [
            'user_id' => $demo->id,
            'expected' => 0,
            'actual' => 0,
            'is_demo' => true,
        ]);

        $ticket = SupportTicket::create([
            'user_id' => $demo->id,
            'subject' => 'Demo support request',
            'category' => 'General',
            'message' => 'This is a demo support ticket.',
            'status' => 'open',
            'is_demo' => true,
        ]);

        $demoClients = collect([$client]);
        foreach (['Alex Morgan', 'Jamie Lee', 'Taylor Smith', 'Jordan Williams', 'Casey Brown', 'Riley Davis', 'Morgan Wilson'] as $index => $name) {
            $demoClients->push(Client::create([
                'name' => $name,
                'email' => 'demo.client.' . $sessionToken . '.' . ($index + 2) . '@example.com',
                'phone' => '+1 555-02' . str_pad((string) ($index + 10), 2, '0', STR_PAD_LEFT),
                'status' => 'active',
                'last_visit' => today()->subDays($index % 5),
                'is_demo' => true,
            ]));
        }

        $demoCourts = collect([$court]);
        foreach ([['Demo Court 2', 'indoor', 70], ['Demo Court 3', 'outdoor', 55]] as [$name, $type, $hourlyRate]) {
            $demoCourts->push(Court::create([
                'name' => $name,
                'type' => $type,
                'hourly_rate' => $hourlyRate,
                'status' => 'available',
                'is_demo' => true,
            ]));
        }

        $secondTeam = Team::create([
            'name' => 'Demo Challengers',
            'max_players' => 4,
            'color' => '#38bdf8',
            'status' => 'active',
            'is_demo' => true,
        ]);
        $demoTeams = collect([$team, $secondTeam]);
        $demoPlayers = collect([$player]);
        foreach ($demoTeams as $teamIndex => $demoTeam) {
            for ($playerIndex = $teamIndex === 0 ? 2 : 1; $playerIndex <= 4; $playerIndex++) {
                $demoPlayers->push(Player::create([
                    'team_id' => $demoTeam->id,
                    'name' => 'Demo ' . ($teamIndex === 0 ? 'Staff' : 'Challenger') . ' ' . $playerIndex,
                    'position' => $playerIndex % 2 === 0 ? 'Left' : 'Right',
                    'status' => 'active',
                    'skill_level' => 2 + ($playerIndex % 3),
                    'is_demo' => true,
                ]));
            }
        }

        $dashboardBookings = collect([$booking]);
        foreach (range(-6, 0) as $dayOffset) {
            foreach ($demoCourts as $courtIndex => $demoCourt) {
                $startHour = 9 + (($courtIndex + abs($dayOffset)) % 3) * 3;
                $bookingDate = today()->addDays($dayOffset);
                $startTime = sprintf('%02d:00:00', $startHour);
                $endTime = sprintf('%02d:00:00', $startHour + 1);
                $dashboardBookings->push(Booking::create([
                    'court_id' => $demoCourt->id,
                    'client_id' => $demoClients[($courtIndex + abs($dayOffset)) % $demoClients->count()]->id,
                    'team_id' => $demoTeams[$courtIndex % $demoTeams->count()]->id,
                    'booking_date' => $bookingDate,
                    'start_time' => $startTime,
                    'end_time' => $endTime,
                    'status' => $dayOffset < 0 || ($dayOffset === 0 && $courtIndex === 0) ? 'completed' : 'confirmed',
                    'total_amount' => $demoCourt->hourly_rate,
                    'players' => 4,
                    'payment_type' => 'cash',
                    'notes' => 'Demo dashboard session',
                    'is_demo' => true,
                ]));
            }
        }

        $dashboardOrders = collect([$order]);
        $dashboardExpenses = collect([$expense]);
        foreach (range(-6, -1) as $dayOffset) {
            $activityDate = today()->addDays($dayOffset);
            $dashboardOrders->push(CafeOrder::create([
                'client_id' => $demoClients[abs($dayOffset) % $demoClients->count()]->id,
                'order_date' => $activityDate,
                'items_summary' => '2x Demo Service',
                'total_amount' => 20,
                'status' => 'completed',
                'is_demo' => true,
            ]));
            $dashboardExpenses->push(Expense::create([
                'description' => 'Demo operating expense',
                'amount' => 12 + abs($dayOffset),
                'category' => 'maintenance',
                'expense_date' => $activityDate,
                'reference' => 'DEMO-DAILY-' . $sessionToken . '-' . abs($dayOffset),
                'is_demo' => true,
            ]));
        }

        return [
            'clients' => $demoClients->pluck('id')->all(),
            'membership_plans' => [$plan->id],
            'stock_items' => [$product->id],
            'suppliers' => [$supplier->id],
            'courts' => $demoCourts->pluck('id')->all(),
            'teams' => $demoTeams->pluck('id')->all(),
            'players' => $demoPlayers->pluck('id')->all(),
            'bookings' => $dashboardBookings->pluck('id')->all(),
            'memberships' => [$membership->id],
            'cafe_orders' => $dashboardOrders->pluck('id')->all(),
            'cafe_order_items' => [$orderItem->id],
            'expenses' => $dashboardExpenses->pluck('id')->all(),
            'purchases' => [$purchase->id],
            'reconciliations' => [$reconciliation->id],
            'support_tickets' => [$ticket->id],
        ];
    }
}
