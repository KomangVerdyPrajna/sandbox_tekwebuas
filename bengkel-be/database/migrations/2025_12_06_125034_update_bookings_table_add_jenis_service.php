<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    // ...
    public function up(): void
    {
        Schema::table('bookings', function (Blueprint $table) {
            
            // --- Hapus Kolom services_id Lama --- (Seperti yang sudah kita bahas)
            // ... (Kode untuk menghapus services_id) ...
            
            // --- Tambahkan Kolom jenis_service Baru (ENUM) ---
            // ✅ Tambahkan pengecekan if di sini
            if (!Schema::hasColumn('bookings', 'jenis_service')) {
                $table->enum('jenis_service', [
                    'Servis Ringan', 
                    'Servis Berat', 
                    'Ganti Oli', 
                    'Perbaikan Rem', 
                    'Tune Up'
                ])->after('nama_kendaraan');
            }
        });
    }
// ...
};