<?php

namespace App\Providers;

use App\Models\Booking;
use App\Models\CafeOrder;
use App\Models\CafeOrderItem;
use App\Models\Client;
use App\Models\ClubSetting;
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
use App\Support\DemoWorkspace;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Vite;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Vite::prefetch(concurrency: 3);

        foreach ([
            Client::class, Player::class, Team::class, Court::class, Booking::class,
            CafeOrder::class, CafeOrderItem::class, Expense::class, StockItem::class,
            Supplier::class, MembershipPlan::class, Membership::class, Purchase::class,
            Reconciliation::class, ClubSetting::class, SupportTicket::class,
        ] as $model) {
            $model::addGlobalScope('demo_workspace', function ($query) {
                if (auth()->user()?->isDemo()) {
                    DemoWorkspace::constrain($query);
                } else {
                    $query->where($query->getModel()->qualifyColumn('is_demo'), false);
                }
            });
        }
    }
}
