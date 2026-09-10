<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('suppliers', function (Blueprint $t) {
            $t->id();
            $t->string('name');
            foreach (['category', 'contact', 'phone', 'email', 'location'] as $field) {
                $t->string($field)->nullable();
            }
            $t->string('status')->default('Active');
            $t->timestamps();
        });
        Schema::create('membership_plans', function (Blueprint $t) {
            $t->id(); $t->string('name'); $t->string('badge')->nullable();
            $t->decimal('price', 10, 2); $t->unsignedInteger('duration')->default(30);
            $t->string('color')->default('lime'); $t->string('status')->default('Active');
            $t->json('perks'); $t->timestamps();
        });
        Schema::create('memberships', function (Blueprint $t) {
            $t->id(); $t->foreignId('client_id')->constrained()->restrictOnDelete();
            $t->foreignId('membership_plan_id')->constrained()->restrictOnDelete();
            $t->date('starts_at'); $t->date('ends_at'); $t->decimal('amount', 10, 2);
            $t->timestamps();
        });
        Schema::table('courts', function (Blueprint $t) {
            $t->string('location')->nullable(); $t->unsignedInteger('capacity')->default(4);
            $t->string('surface')->nullable(); $t->boolean('lights')->default(true);
            $t->text('description')->nullable(); $t->text('image')->nullable();
        });
        Schema::table('teams', function (Blueprint $t) {
            $t->string('captain')->nullable(); $t->string('skill_level')->default('Intermediate');
            $t->unsignedInteger('wins')->default(0); $t->unsignedInteger('losses')->default(0);
        });
        Schema::table('bookings', function (Blueprint $t) {
            $t->foreignId('team_id')->nullable()->constrained()->nullOnDelete();
            $t->unsignedInteger('players')->default(2);
            $t->string('payment_type')->default('cash');
            $t->index(['court_id', 'booking_date', 'start_time']);
        });
        Schema::table('stock_items', function (Blueprint $t) {
            $t->foreignId('supplier_id')->nullable()->constrained()->nullOnDelete();
            $t->decimal('cost', 10, 2)->default(0); $t->text('image')->nullable();
            $t->boolean('active')->default(true);
        });
        Schema::create('cafe_order_items', function (Blueprint $t) {
            $t->id(); $t->foreignId('cafe_order_id')->constrained()->cascadeOnDelete();
            $t->foreignId('stock_item_id')->constrained()->restrictOnDelete();
            $t->string('name'); $t->unsignedInteger('quantity');
            $t->decimal('unit_price', 10, 2); $t->decimal('total', 10, 2); $t->timestamps();
        });
        Schema::create('purchases', function (Blueprint $t) {
            $t->id(); $t->foreignId('supplier_id')->constrained()->restrictOnDelete();
            $t->foreignId('stock_item_id')->constrained()->restrictOnDelete();
            $t->unsignedInteger('quantity'); $t->decimal('unit_price', 10, 2);
            $t->decimal('total_amount', 10, 2); $t->decimal('paid_amount', 10, 2)->default(0);
            $t->date('purchase_date'); $t->timestamps();
        });
        Schema::create('reconciliations', function (Blueprint $t) {
            $t->id(); $t->foreignId('user_id')->constrained()->restrictOnDelete();
            $t->date('date')->unique(); $t->decimal('expected', 10, 2);
            $t->decimal('actual', 10, 2); $t->timestamps();
        });
        Schema::create('club_settings', function (Blueprint $t) {
            $t->id(); $t->string('name')->default('Skyline Padel');
            foreach (['email', 'phone', 'website', 'address'] as $field) $t->string($field)->nullable();
            $t->text('about')->nullable(); $t->timestamps();
        });
        Schema::create('support_tickets', function (Blueprint $t) {
            $t->id(); $t->foreignId('user_id')->constrained()->cascadeOnDelete();
            $t->string('subject'); $t->string('category'); $t->text('message');
            $t->string('status')->default('open'); $t->timestamps();
        });
    }

    public function down(): void
    {
        foreach (['support_tickets', 'club_settings', 'reconciliations', 'purchases', 'cafe_order_items', 'memberships'] as $table) Schema::dropIfExists($table);
        Schema::table('stock_items', function (Blueprint $t) { $t->dropConstrainedForeignId('supplier_id'); $t->dropColumn(['cost', 'image', 'active']); });
        Schema::table('bookings', function (Blueprint $t) { $t->dropConstrainedForeignId('team_id'); $t->dropIndex(['court_id', 'booking_date', 'start_time']); $t->dropColumn(['players', 'payment_type']); });
        Schema::table('teams', fn (Blueprint $t) => $t->dropColumn(['captain', 'skill_level', 'wins', 'losses']));
        Schema::table('courts', fn (Blueprint $t) => $t->dropColumn(['location', 'capacity', 'surface', 'lights', 'description', 'image']));
        Schema::dropIfExists('membership_plans'); Schema::dropIfExists('suppliers');
    }
};
