<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('shipping_progres', function (Blueprint $table) {
            $table->id();
            $table->foreignId('order_id')->constrained('orders')->onDelete('cascade');
            $table->string('status');              // contoh: "on process", "shipped", "delivered"
            $table->string('location')->nullable(); // lokasi tracking opsional
            $table->timestamp('progres_time')->nullable(); // kapan update terjadi
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('shipping_progres');
    }
};
