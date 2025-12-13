<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Order;
use App\Models\User;
use App\Models\Cart;

class OrderSeeder extends Seeder
{
    public function run(): void
    {
        $user = User::where('role', 'customer')->first();
        $cart = Cart::where('user_id', $user->id)->first();

        if (!$user || !$cart) {
            $this->command->warn('OrderSeeder dilewati: user atau cart tidak ditemukan.');
            return;
        }

        Order::create([
            'user_id' => $user->id,
            'cart_id' => $cart->id,
            'name' => 'John Doe',
            'no_tlp' => '081234567890',
            'address' => 'Jl. Contoh No. 123',
            'delivery' => 'JNE',
            'payment' => 'Transfer',
            'subtotal' => 150000,
            'postage' => 20000,
            'grandTotal' => 170000,
        ]);
    }
}
