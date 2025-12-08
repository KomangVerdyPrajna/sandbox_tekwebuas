<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Jalankan migrasi.
     */
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            
            // ✅ PERBAIKAN: Cek apakah kolom 'role' sudah ada sebelum menambahkannya
            if (!Schema::hasColumn('users', 'role')) {
                
                // Tambahkan kolom 'role' dengan nilai default 'customer'
                $table->string('role')->default('customer');
            }
        });
    }

    /**
     * Balikkan migrasi.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            
            // ✅ PERBAIKAN: Cek apakah kolom 'role' ada sebelum dihapus (untuk rollback)
            if (Schema::hasColumn('users', 'role')) {
                $table->dropColumn('role');
            }
        });
    }
};