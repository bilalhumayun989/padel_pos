<?php
namespace Tests\Feature;

use App\Models\{Booking, CafeOrder, CafeOrderItem, Client, Court, Membership, MembershipPlan, Player, Purchase, StockItem, Supplier, Team, User};
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class BusinessDatabaseTest extends TestCase
{
    use RefreshDatabase;

    public function test_all_business_pages_render_database_records(): void
    {
        $this->seed();
        $this->actingAs(User::first());
        foreach (['/', '/clients', '/players', '/courts', '/teams', '/memberships', '/products/cafe', '/products/paddle', '/suppliers', '/stock', '/schedule', '/bookings/create', '/cafe', '/history/sales', '/history/purchases', '/history/expenses', '/history/reconciliation', '/reports/revenue', '/reports/expenses', '/reports/bookings', '/reports/cafe', '/reports/players', '/settings', '/support'] as $url) {
            $this->get($url)->assertOk();
        }
        $court = Court::first();
        $court->update(['name' => 'Persisted Court Name']);
        $this->get('/courts')->assertInertia(fn (Assert $page) => $page->where('courts.0.name', 'Persisted Court Name')->etc());
    }

    public function test_empty_database_does_not_return_design_mock_totals(): void
    {
        $this->actingAs(User::factory()->create());
        $this->get('/')->assertInertia(fn (Assert $page) => $page->where('metrics.revenue_today', 0)->where('metrics.today_bookings', 0)->has('teams', 0)->has('recentBookings', 0)->etc());
        $this->get('/reports/revenue')->assertInertia(fn (Assert $page) => $page->where('summary.total_revenue', 0)->has('rows', 0)->etc());
    }

    public function test_booking_persists_server_price_and_rejects_overlap(): void
    {
        $this->actingAs(User::factory()->create());
        $court = Court::create(['name'=>'Test Court','hourly_rate'=>75,'type'=>'indoor','status'=>'available']);
        $client = Client::create(['name'=>'Test Client','status'=>'active']);
        $data = ['court_id'=>$court->id,'client_id'=>$client->id,'date'=>today()->addDay()->toDateString(),'start_time'=>'10:00','duration'=>1.5,'players'=>4,'payment_type'=>'cash','total_amount'=>1];
        $this->post('/bookings', $data)->assertSessionHasNoErrors()->assertRedirect();
        $this->assertDatabaseHas('bookings',['court_id'=>$court->id,'client_id'=>$client->id,'total_amount'=>112.5,'end_time'=>'11:30:00']);
        $this->post('/bookings', array_replace($data,['start_time'=>'11:00']))->assertSessionHasErrors('start_time');
        $this->assertDatabaseCount('bookings',1);
        $this->post('/bookings', array_replace($data,['start_time'=>'12:00']))->assertSessionHasNoErrors();
        $this->assertDatabaseCount('bookings',2);
    }

    public function test_checkout_updates_stock_and_creates_receipt_atomically(): void
    {
        $this->actingAs(User::factory()->create());
        $product = StockItem::create(['name'=>'Coffee','category'=>'Cafe','quantity'=>3,'min_quantity'=>2,'unit_price'=>5,'status'=>'in_stock']);
        $this->post('/cafe',['items'=>[['id'=>$product->id,'qty'=>2]],'total_amount'=>0])->assertSessionHasNoErrors();
        $this->assertDatabaseHas('cafe_orders',['total_amount'=>10.5,'status'=>'completed']);
        $this->assertDatabaseHas('cafe_order_items',['stock_item_id'=>$product->id,'quantity'=>2,'unit_price'=>5]);
        $this->assertDatabaseHas('stock_items',['id'=>$product->id,'quantity'=>1,'status'=>'low_stock']);
        $this->post('/cafe',['items'=>[['id'=>$product->id,'qty'=>2]]])->assertSessionHasErrors('items');
        $this->assertDatabaseCount('cafe_orders',1);
        $this->assertDatabaseCount('cafe_order_items',1);
        $this->assertSame(1,$product->fresh()->quantity);
    }

    public function test_management_forms_persist_and_preserve_relationships(): void
    {
        $this->actingAs(User::factory()->create());
        $this->post('/suppliers',['name'=>'Supplier','category'=>'Cafe'])->assertSessionHasNoErrors();
        $this->post('/products',['name'=>'Tea','category'=>'Cafe','price'=>4,'cost'=>1,'stock'=>10,'unit'=>'cup','supplier'=>'Supplier','status'=>'Active'])->assertSessionHasNoErrors();
        $item = StockItem::firstOrFail();
        $this->assertSame(Supplier::first()->id,$item->supplier_id);
        $this->post('/teams',['name'=>'Club Team','captain'=>'Captain','members'=>['Player One','Player Two'],'skill_level'=>'Intermediate','status'=>'Active'])->assertSessionHasNoErrors();
        $team = Team::firstOrFail();
        $this->assertSame(2,$team->players()->count());
        $this->put('/teams/'.$team->id,['name'=>'Renamed Team','captain'=>'Captain','members'=>['Player One'],'skill_level'=>'Intermediate','status'=>'Active'])->assertSessionHasNoErrors();
        $this->assertDatabaseHas('players',['name'=>'Player Two','team_id'=>null]);
        $this->assertDatabaseCount('players',2);
        $this->post('/memberships',['name'=>'Monthly','price'=>50,'duration'=>30,'color'=>'gray','status'=>'Active','perks'=>['Access']])->assertSessionHasNoErrors();
        $client = Client::create(['name'=>'Member','status'=>'active']);
        $enroll=['client_id'=>$client->id,'membership_plan_id'=>MembershipPlan::first()->id,'starts_at'=>today()->toDateString()];
        $this->post('/memberships/enroll',$enroll)->assertSessionHasNoErrors();
        $this->post('/memberships/enroll',$enroll)->assertSessionHasErrors('client_id');
        $this->assertDatabaseCount('memberships',1);
        $this->post('/history/purchases',['supplier_id'=>$item->supplier_id,'stock_item_id'=>$item->id,'quantity'=>5,'unit_price'=>1,'paid_amount'=>3,'purchase_date'=>today()->toDateString()])->assertSessionHasNoErrors();
        $this->assertSame(15,$item->fresh()->quantity);
        $this->assertDatabaseHas('purchases',['total_amount'=>5,'paid_amount'=>3]);
        $this->put('/settings',['name'=>'Updated Club'])->assertSessionHasNoErrors();
        $this->get('/')->assertInertia(fn(Assert $page)=>$page->where('facility.name','Updated Club')->etc());
        $this->post('/support',['subject'=>'Help','category'=>'General','message'=>'Please check court lights.'])->assertSessionHasNoErrors();
        $this->assertDatabaseHas('support_tickets',['user_id'=>auth()->id(),'subject'=>'Help']);
    }
}