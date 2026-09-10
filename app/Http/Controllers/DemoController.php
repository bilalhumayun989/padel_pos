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
    public function enter(): RedirectResponse
    {
        $demo = User::firstOrCreate(['email' => 'demo@skylinepadel.com'], [
            'name' => 'Demo User',
            'password' => Hash::make(Str::random(64)),
            'email_verified_at' => now(),
        ]);

        if (! Session::has('demo_workspace')) {
            $workspace = $this->provisionDefaults($demo);
            Session::forget('demo_usage');
            DemoWorkspace::set($workspace);
        }

        Auth::guard('web')->login($demo, true);

        return redirect()->route('dashboard');
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

        return [
            'clients' => [$client->id],
            'membership_plans' => [$plan->id],
            'stock_items' => [$product->id],
            'suppliers' => [$supplier->id],
            'courts' => [$court->id],
            'teams' => [$team->id],
            'players' => [$player->id],
            'bookings' => [$booking->id],
            'memberships' => [$membership->id],
            'cafe_orders' => [$order->id],
            'cafe_order_items' => [$orderItem->id],
            'expenses' => [$expense->id],
            'purchases' => [$purchase->id],
            'reconciliations' => [$reconciliation->id],
            'support_tickets' => [$ticket->id],
        ];
    }
}
