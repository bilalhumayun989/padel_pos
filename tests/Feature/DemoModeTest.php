<?php

namespace Tests\Feature;

use App\Models\Client;
use App\Models\DemoUsage;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class DemoModeTest extends TestCase
{
    use RefreshDatabase;

    public function test_demo_entry_creates_one_persistent_demo_workspace(): void
    {
        $this->get('/demo')->assertRedirect(route('dashboard', absolute: false));
        $demo = User::where('email', 'demo@skylinepadel.com')->firstOrFail();

        $this->assertAuthenticatedAs($demo);
        $this->assertDatabaseHas('clients', ['email' => 'demo.client@example.com']);
        $this->assertDatabaseHas('membership_plans', ['name' => 'Demo Package']);
        $this->assertDatabaseHas('stock_items', ['name' => 'Demo Service']);
        $this->assertDatabaseHas('teams', ['name' => 'Demo Staff']);

        $this->get('/demo')->assertRedirect(route('dashboard', absolute: false));
        $this->assertSame(1, User::where('email', 'demo@skylinepadel.com')->count());
        $this->assertSame(1, Client::where('email', 'demo.client@example.com')->count());
    }

    public function test_demo_is_limited_per_resource_but_normal_users_are_not(): void
    {
        $this->get('/demo');
        for ($index = 1; $index <= 10; $index++) {
            $this->post('/clients', [
                'name' => 'Demo Client '.$index,
                'email' => 'demo-'.$index.'@example.com',
                'status' => 'active',
            ])->assertSessionHasNoErrors();
        }

        $this->post('/clients', [
            'name' => 'Blocked Demo Client',
            'email' => 'blocked-demo@example.com',
            'status' => 'active',
        ])->assertSessionHasErrors('demo');
        $this->assertDatabaseMissing('clients', ['email' => 'blocked-demo@example.com']);
        $this->assertDatabaseHas('demo_usages', [
            'user_id' => auth()->id(), 'resource' => 'clients', 'used' => 10,
        ]);

        $normalUser = User::factory()->create();
        $this->actingAs($normalUser)->post('/clients', [
            'name' => 'Normal Client', 'email' => 'normal@example.com', 'status' => 'active',
        ])->assertSessionHasNoErrors();
        $this->assertDatabaseHas('clients', ['email' => 'normal@example.com']);
    }

    public function test_demo_password_is_not_used_for_demo_account(): void
    {
        $this->get('/demo');
        $demo = User::where('email', 'demo@skylinepadel.com')->firstOrFail();

        $this->assertFalse(Hash::check('12345678', $demo->password));
    }

    public function test_demo_pages_render_only_the_demo_workspace_records(): void
    {
        $this->get('/demo');

        $this->get('/clients')->assertInertia(fn (Assert $page) => $page->has('clients', 1)->etc());
        $this->get('/players')->assertInertia(fn (Assert $page) => $page->has('players', 1)->etc());
        $this->get('/teams')->assertInertia(fn (Assert $page) => $page->has('teams', 1)->etc());
        $this->get('/products/cafe')->assertInertia(fn (Assert $page) => $page->has('products', 1)->etc());
        $this->get('/courts')->assertInertia(fn (Assert $page) => $page->has('courts', 1)->etc());
        $this->get('/memberships')->assertInertia(fn (Assert $page) => $page->has('plans', 1)->etc());
        $this->get('/stock')->assertInertia(fn (Assert $page) => $page->has('items', 1)->etc());
        $this->get('/suppliers')->assertInertia(fn (Assert $page) => $page->has('suppliers', 1)->etc());
        $this->get('/schedule')->assertInertia(fn (Assert $page) => $page->has('courts', 1)->has('bookings', 1)->etc());
        $this->get('/history/purchases')->assertInertia(fn (Assert $page) => $page->has('transactions', 1)->etc());
        $this->get('/history/expenses')->assertInertia(fn (Assert $page) => $page->has('expenses', 1)->etc());
        $this->get('/history/reconciliation')->assertInertia(fn (Assert $page) => $page->has('reconciliation', 1)->etc());
        $this->get('/reports/bookings')->assertInertia(fn (Assert $page) => $page->has('rows', 1)->etc());
        $this->get('/reports/cafe')->assertInertia(fn (Assert $page) => $page->has('rows', 1)->etc());
    }
}
