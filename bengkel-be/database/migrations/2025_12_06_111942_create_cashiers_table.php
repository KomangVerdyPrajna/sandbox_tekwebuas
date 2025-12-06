<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

// database/migrations/2025_12_06_111942_create_cashiers_table.php

// ... (Baris use namespace di atas)

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('cashier', function (Blueprint $table) {
            $table->id(); 
            
            // Kolom Foreign Key
            $table->foreignId('product_id')->nullable()->constrained()->onDelete('cascade');
            $table->foreignId('booking_id')->nullable()->constrained()->onDelete('cascade');
            
            // Kolom Data Pembayaran
            $table->string('payment_method');
            // GANTI DARI: $table->unsignedDecimal('total', 10, 2);
            $table->decimal('total', 10, 2)->unsigned(); // Pilihan 1: decimal, kemudian ditambahkan unsigned()
            // ATAU: $table->decimal('total', 10, 2); // Pilihan 2: Jika tidak harus unsigned
            
            $table->dateTime('transaction_date');
            
            $table->timestamps(); 
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('cashier');
    }
};