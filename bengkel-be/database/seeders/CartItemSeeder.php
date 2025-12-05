<?php

namespace Database\Seeders;
use Illuminate\Database\Seeder;
use App\Models\CartItem;

class CartItemSeeder extends Seeder
{
    public function run(): void
    {
        CartItem::create([
            'product_id' => 1,
            'quantity' => 2,
            'created_at' => now(),
            'updated_at' => now(),
        ]);
    }
}
