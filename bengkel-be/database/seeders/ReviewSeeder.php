<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Review;

class ReviewSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Review::create([
            'user_id'    => 1, // Ganti dengan ID User yang valid
            'product_id' => 1, // Ganti dengan ID Produk yang valid
            'rating'     => 5,
            'comment'    => 'Pelayanannya cepat dan spare partnya original!',
        ]);

        Review::create([
            'user_id'    => 2, // Ganti dengan ID User lain yang valid
            'product_id' => 2, // Ganti dengan ID Produk lain yang valid
            'rating'     => 4,
            'comment'    => 'Barang bagus, pengiriman agak lambat.',
        ]);
    }
}