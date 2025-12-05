<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Product;
use Illuminate\Support\Str;

class ProductSeeder extends Seeder
{
    public function run(): void
    {
        Product::create([
            'name' => 'Contoh Produk 1',
            'slug' => Str::slug('Contoh Produk 1'),
            'description' => 'Ini adalah contoh produk pertama.',
            'price' => 150000,
            'stock' => 10,
            'img_url' => 'images/product1.jpg',
            'category_id' => 1, // pastikan kategori id 1 sudah ada
            'create_at' => now(),
            'update_at' => now(),
        ]);

        Product::create([
            'name' => 'Contoh Produk 2',
            'slug' => Str::slug('Contoh Produk 2'),
            'description' => 'Ini adalah contoh produk kedua.',
            'price' => 250000,
            'stock' => 20,
            'img_url' => 'images/product2.jpg',
            'category_id' => 1,
            'create_at' => now(),
            'update_at' => now(),
        ]);
    }
}
