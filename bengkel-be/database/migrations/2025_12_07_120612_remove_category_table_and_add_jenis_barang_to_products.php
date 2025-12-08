<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Jalankan migrasi (UP): Hapus kategori, tambahkan ENUM jenis_barang.
     */
    public function up(): void
    {
        // 1. Modifikasi tabel 'products'
        Schema::table('products', function (Blueprint $table) {
            
            // --- Menghapus category_id dan Foreign Key (FK) dengan aman ---
            if (Schema::hasColumn('products', 'category_id')) {
                try {
                    // Coba drop Foreign Key. Ini mengatasi error 1091 jika FK hilang.
                    // Nama default FK untuk kolom category_id adalah 'products_category_id_foreign'
                    $table->dropForeign(['category_id']); 
                } catch (\Exception $e) {
                    // Abaikan error jika foreign key tidak ditemukan
                }
                
                // Hapus kolom category_id yang lama
                $table->dropColumn('category_id');
            }

            // 2. Tambahkan kolom baru 'jenis_barang' dengan tipe ENUM
            if (!Schema::hasColumn('products', 'jenis_barang')) {
                $table->enum('jenis_barang', ['Sparepart', 'Aksesoris'])->after('description');
            }
        });

        // 3. Hapus tabel 'categories' (Jika masih ada)
        Schema::dropIfExists('categories');
    }

    /**
     * Balikkan migrasi (DOWN):
     * Membalikkan perubahan di tabel products, tetapi TIDAK membuat ulang tabel categories.
     * Karena Anda tidak ingin tabel categories, down() hanya akan menghapus jenis_barang
     * dan mengembalikan kolom category_id sebagai kolom biasa (unsignedBigInteger) tanpa FK.
     */
    public function down(): void
    {
        // 1. Modifikasi tabel 'products'
        Schema::table('products', function (Blueprint $table) {
            
            // Hapus kolom jenis_barang yang baru
            $table->dropColumn('jenis_barang');

            // Tambahkan kembali kolom category_id yang lama (tanpa Foreign Key)
            // Ini mengembalikan skema ke kondisi sebelum migrasi dijalankan,
            // tetapi relasi Foreign Key tidak dibuat karena tabel 'categories' tidak ada.
            $table->unsignedBigInteger('category_id')->nullable();
        });
        
        // 2. TIDAK ADA Schema::create('categories') di sini.
        // Konsekuensi: Jika Anda melakukan rollback, kolom category_id akan muncul 
        // di tabel products tetapi tidak memiliki foreign key ke tabel categories.
    }
};