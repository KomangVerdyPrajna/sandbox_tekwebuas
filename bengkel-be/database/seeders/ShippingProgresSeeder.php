<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\ShippingProgres;

class ShippingProgresSeeder extends Seeder
{
    public function run(): void
    {
        ShippingProgres::create([
            'order_id' => 1,
            'status' => 'Order created',
            'location' => 'Warehouse',
            'progres_time' => now(),
        ]);

        ShippingProgres::create([
            'order_id' => 1,
            'status' => 'On process',
            'location' => 'Service Area',
            'progres_time' => now()->addHours(2),
        ]);

        ShippingProgres::create([
            'order_id' => 1,
            'status' => 'Completed',
            'location' => 'Ready to Pickup',
            'progres_time' => now()->addHours(5),
        ]);
    }
}
