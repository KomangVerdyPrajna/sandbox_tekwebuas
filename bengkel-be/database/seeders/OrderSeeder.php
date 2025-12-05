<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Order;

class OrderSeeder extends Seeder
{
    public function run(): void
    {
        Order::create([
            'cart_items_id' => 1,
            'name' => 'John Doe',
            'no_tlp' => '081234567890',
            'address' => 'Jl. Contoh No. 123',
            'delivery' => 'JNE',
            'payment' => 'Transfer',
            'subtotal' => 150000,
            'postage' => 20000,
            'grandTotal' => 170000,
            'created_at' => now(),
            'updated_at' => now(),
        ]);
    }
}