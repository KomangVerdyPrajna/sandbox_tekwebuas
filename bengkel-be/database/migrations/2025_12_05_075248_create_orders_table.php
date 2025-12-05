<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('orders', function (Blueprint $table) {
            $table->id();

            // Foreign Key ke cart_items
            $table->unsignedBigInteger('cart_items_id');
            $table->foreign('cart_items_id')
                ->references('id')
                ->on('cart_items')
                ->onDelete('cascade');

            $table->string('name');
            $table->string('no_tlp');
            $table->text('address')->nullable();
            $table->string('delivery')->nullable(); // contoh: jne / cod / pickup
            $table->string('payment')->nullable();  // contoh: transfer / cod

            $table->integer('subtotal')->default(0);
            $table->integer('postage')->default(0);
            $table->integer('grandTotal')->default(0); // pakai snake_case

            $table->timestamps(); // otomatis bikin created_at & updated_at
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('orders');
    }
};