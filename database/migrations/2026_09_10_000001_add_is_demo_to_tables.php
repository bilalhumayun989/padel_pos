<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    private const TABLES = [
        'clients', 'players', 'teams', 'courts', 'bookings',
        'cafe_orders', 'cafe_order_items', 'expenses', 'stock_items',
        'suppliers', 'membership_plans', 'memberships', 'purchases',
        'reconciliations', 'support_tickets',
    ];

    public function up(): void
    {
        foreach (self::TABLES as $table) {
            if (Schema::hasTable($table) && ! Schema::hasColumn($table, 'is_demo')) {
                Schema::table($table, function (Blueprint $table) {
                    $table->boolean('is_demo')->default(false)->index();
                });
            }
        }
    }

    public function down(): void
    {
        foreach (self::TABLES as $table) {
            if (Schema::hasTable($table) && Schema::hasColumn($table, 'is_demo')) {
                Schema::table($table, function (Blueprint $table) {
                    $table->dropColumn('is_demo');
                });
            }
        }
    }
};
