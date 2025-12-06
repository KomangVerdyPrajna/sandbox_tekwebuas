<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB; // <-- IMPORT FACADE DB

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // 1. NONAKTIFKAN Foreign Key Checks untuk menghindari error truncate/seeding
        DB::statement('SET FOREIGN_KEY_CHECKS=0;'); 

        $this->call([
            // Urutan disarankan: Tabel Induk paling atas, Anak di bawah.
            UserSeeder::class,      
            CategorySeeder::class,  // Induk
            ProductSeeder::class,   // Anak dari Category, Induk dari CartItem, Review, Cashier
            // ServiceSeeder::class, // HATI-HATI: Jika tidak dipakai, hapus/perbaiki migrasinya
            
            // BookingSeeder harus dipanggil SEBELUM CashierSeeder
            BookingSeeder::class,   // Induk dari Cashier
            
            // Tabel Anak/Detail
            CartItemSeeder::class,
            OrderSeeder::class,
            ShippingProgresSeeder::class,
            ReviewSeeder::class,
            CashierSeeder::class,
            // WorkshopScheduleSeeder::class (Jika ada)
        ]);

        // 2. AKTIFKAN Kembali Foreign Key Checks
        DB::statement('SET FOREIGN_KEY_CHECKS=1;'); 

        // Hapus kode redundan factory di bawah ini karena sudah ada di UserSeeder
        // User::factory()->create([
        //     'name' => 'Test User',
        //     'email' => 'test@example.com',
        // ]);
    }
}