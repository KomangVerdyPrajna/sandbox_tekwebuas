<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('bookings', function (Blueprint $table) {
            $table->id();

            // MENGGANTI: Menggunakan user_id sebagai foreign key
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            
            $table->string('jenis_kendaraan');
            $table->string('nama_kendaraan');
            
            // Foreign Key ke services
            $table->foreignId('services_id')->constrained('services')->onDelete('cascade');
            
            $table->date('booking_date');
            
            // MEMPERTAHANKAN: Kolom no_wa tetap ada
            $table->string('no_wa'); 
            
            $table->text('notes')->nullable();
            $table->string('status')->default('pending');

            $table->timestamps(); // created_at & updated_at
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('bookings');
    }
};