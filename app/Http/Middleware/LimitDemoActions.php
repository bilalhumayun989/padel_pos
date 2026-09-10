<?php

namespace App\Http\Middleware;

use App\Support\DemoWorkspace;
use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Symfony\Component\HttpFoundation\Response;

class LimitDemoActions
{
    public const LIMIT = 10;

    private const ROUTE_RESOURCES = [
        'clients.store' => 'clients',
        'players.store' => 'players',
        'teams.store' => 'teams',
        'courts.store' => 'courts',
        'products.store' => 'products',
        'suppliers.store' => 'suppliers',
        'cafe.store' => 'sales',
        'bookings.store' => 'bookings',
        'memberships.store' => 'membership_plans',
        'memberships.enroll' => 'memberships',
        'expenses.store' => 'expenses',
        'purchases.store' => 'purchases',
        'reconciliation.store' => 'reconciliations',
        'support.store' => 'support_tickets',
    ];

    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();
        $resource = self::ROUTE_RESOURCES[$request->route()?->getName()] ?? null;

        if (! $user?->isDemo() || ! $resource) {
            return $next($request);
        }

        $used = (int) $request->session()->get("demo_usage.{$resource}", 0);

        if ($used >= self::LIMIT) {
            return back()->withErrors([
                'demo' => "Demo limit reached: you can create up to ".self::LIMIT." {$resource}.",
            ]);
        }

        $response = $next($request);

        if (($response->isSuccessful() || $response->isRedirection()) && ! $request->session()->has('errors')) {
            $request->session()->put("demo_usage.{$resource}", $used + 1);

            $table = match ($resource) {
                'clients' => 'clients', 'players' => 'players', 'teams' => 'teams',
                'courts' => 'courts', 'products' => 'stock_items', 'sales' => 'cafe_orders',
                'bookings' => 'bookings', 'membership_plans' => 'membership_plans',
                'memberships' => 'memberships', 'expenses' => 'expenses',
                'purchases' => 'purchases', 'reconciliations' => 'reconciliations',
                'support_tickets' => 'support_tickets', 'suppliers' => 'suppliers',
                default => null,
            };

            if ($table) {
                $latestId = DB::table($table)->max('id');
                if ($latestId) {
                    DB::table($table)->where('id', $latestId)->update(['is_demo' => true]);
                    DemoWorkspace::add($table, [$latestId]);
                }
            }
        }

        return $response;
    }
}
