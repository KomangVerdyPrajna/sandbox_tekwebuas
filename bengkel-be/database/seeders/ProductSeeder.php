<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ProductSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('products')->insert([
            [
                'name' => 'Oli Mesin Honda MPX 2',
                'description' => 'Oli mesin motor matic kualitas tinggi, cocok untuk pemakaian harian.',
                'price' => 45000,
                'stock' => 25,
                'image_url' => 'https://example.com/oli-mpx2.jpg',
                'category_id' => 1, // contoh kategori: Pelumas
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Ban Tubeless FDR Rosso 90/90',
                'description' => 'Ban tubeless untuk motor matic dan bebek, grip kuat dan awet.',
                'price' => 210000,
                'stock' => 12,
                'image_url' => 'https://example.com/ban-fdr.jpg',
                'category_id' => 2, // Ban
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Kampas Rem Honda Beat',
                'description' => 'Kampas rem original Honda Beat/Scoopy, daya cengkeram kuat.',
                'price' => 35000,
                'stock' => 40,
                'image_url' => 'https://example.com/kampas-rem.jpg',
                'category_id' => 3, // Sparepart Rem
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Aki Motor GS Astra GM5Z-3B',
                'description' => 'Aki kering untuk kendaraan matic dan bebek, tahan lama.',
                'price' => 185000,
                'stock' => 10,
                'image_url' => 'https://example.com/aki-gs.jpg',
                'category_id' => 4, // Aki
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Jasa Servis Ringan',
                'description' => 'Pengecekan ringan termasuk pembersihan filter, setel rantai, pengecekan umum.',
                'price' => 30000,
                'stock' => 9999, // jasa → anggap tidak terbatas
                'image_url' => 'https://example.com/servis-ringan.jpg',
                'category_id' => 5, // Jasa Servis
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Jasa Servis Besar',
                'description' => 'Servis besar termasuk turun mesin ringan, pembersihan karburator/injeksi, ganti oli.',
                'price' => 120000,
                'stock' => 9999,
                'image_url' => 'https://example.com/servis-besar.jpg',
                'category_id' => 5,
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);
    }
}
