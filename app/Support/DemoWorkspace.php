<?php

namespace App\Support;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Facades\Session;

class DemoWorkspace
{
    public const TABLES = [
        'clients', 'players', 'teams', 'courts', 'bookings', 'cafe_orders',
        'cafe_order_items', 'expenses', 'stock_items', 'suppliers',
        'membership_plans', 'memberships', 'purchases', 'reconciliations',
        'club_settings', 'support_tickets',
    ];

    public static function set(array $ids): void
    {
        Session::put('demo_workspace', collect($ids)
            ->map(fn ($values) => array_values(array_unique(array_map('intval', (array) $values))))
            ->all());
    }

    public static function ids(string $table): array
    {
        return array_map('intval', Session::get("demo_workspace.{$table}", []));
    }

    public static function add(string $table, array $ids): void
    {
        self::set(array_merge(Session::get('demo_workspace', []), [
            $table => array_merge(self::ids($table), $ids),
        ]));
    }

    public static function constrain(Builder $query): void
    {
        $table = $query->getModel()->getTable();
        $ids = self::ids($table);
        $query->whereIn($query->getModel()->qualifyColumn('id'), $ids ?: [0]);
    }
}
