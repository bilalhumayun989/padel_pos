<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('demo_usages', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->string('resource', 80);
            $table->unsignedInteger('used')->default(0);
            $table->timestamps();
            $table->unique(['user_id', 'resource']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('demo_usages');
    }
};
