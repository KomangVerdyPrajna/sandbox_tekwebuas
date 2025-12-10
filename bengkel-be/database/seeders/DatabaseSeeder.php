<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB; 
// --- DAFTAR USE STATEMENTS ---
use Database\Seeders\UserSeeder;
use Database\Seeders\PromotionSeeder;
use Database\Seeders\ProductSeeder;
use Database\Seeders\CartItemSeeder;
use Database\Seeders\ReviewSeeder;
use Database\Seeders\BookingSeeder;
use Database\Seeders\OrderSeeder;
use Database\Seeders\ShippingProgresSeeder;
use Database\Seeders\CashierSeeder;


class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // 1. NONAKTIFKAN Foreign Key Checks
        DB::statement('SET FOREIGN_KEY_CHECKS=0;'); 

        $this->call([
            // KELOMPOK 1: DATA INDUK
            UserSeeder::class,
            PromotionSeeder::class, 
            
            // KELOMPOK 2: PRODUK
            ProductSeeder::class,
            
            // KELOMPOK 3: TRANSAKSI KECIL
            CartItemSeeder::class,
            ReviewSeeder::class,
            
            // KELOMPOK 4: BOOKING & ORDER
            BookingSeeder::class,
            OrderSeeder::class,

            // KELOMPOK 5: DETAIL
            ShippingProgresSeeder::class, 
            CashierSeeder::class // <--- ELEMEN TERAKHIR. JANGAN ADA KOMANYA.
        ]); // <--- Array ditutup di sini

        // 2. AKTIFKAN Kembali Foreign Key Checks
        DB::statement('SET FOREIGN_KEY_CHECKS=1;'); 
    }
}