<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('bookings', function (Blueprint $table) {
            // Hapus kolom services_id (jika sudah ada FK constraint, hapus dulu)
            $table->dropForeign(['services_id']); // Hapus Foreign Key Constraint (jika ada)
            $table->dropColumn('services_id');    // Hapus kolom lama
            
            // Tambahkan kolom jenis_service yang baru
            $table->string('jenis_service')->after('nama_kendaraan');
        });
    }

    public function down(): void
    {
        Schema::table('bookings', function (Blueprint $table) {
            // Kembalikan kolom services_id jika rollback
            $table->foreignId('services_id')->nullable()->constrained()->onDelete('cascade');
            
            // Hapus kolom jenis_service
            $table->dropColumn('jenis_service');
        });
    }
};