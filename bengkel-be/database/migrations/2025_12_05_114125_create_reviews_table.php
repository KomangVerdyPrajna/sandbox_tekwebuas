<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('reviews', function (Blueprint $table) {
            $table->id();
            
            // Kunci Asing ke tabel users
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            
            // Kunci Asing ke tabel products
            $table->foreignId('product_id')->constrained('products')->onDelete('cascade');
            
            // Rating dalam bentuk integer (misal 1, 2, 3, 4, 5)
            $table->unsignedTinyInteger('rating'); 
            
            // Komentar
            $table->text('comment')->nullable();
            
            // Timestamp otomatis (created_at dan updated_at)
            $table->timestamps(); 

            // Tambahkan indeks unik untuk memastikan satu user hanya bisa review satu produk sekali
            $table->unique(['user_id', 'product_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('reviews');
    }
};