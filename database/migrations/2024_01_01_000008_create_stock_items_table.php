<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('stock_items', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('category')->default('equipment'); // equipment, cafe, maintenance
            $table->integer('quantity')->default(0);
            $table->integer('min_quantity')->default(5);
            $table->decimal('unit_price', 10, 2)->default(0);
            $table->string('unit')->default('pcs');
            $table->enum('status', ['in_stock', 'low_stock', 'out_of_stock'])->default('in_stock');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('stock_items');
    }
};
