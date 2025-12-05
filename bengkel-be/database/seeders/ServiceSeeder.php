<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ServiceSeeder extends Seeder
{
    public function run(): void
    {
        DB::table('services')->insert([
            [
                'name' => 'Service Ringan',
                'description' => 'Pengecekan umum dan servis ringan',
                'price' => 50000,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Service Berat',
                'description' => 'Perbaikan besar dan pengecekan mendalam',
                'price' => 120000,
                'created_at' => now(),
                'updated_at' => now(),
            ]
        ]);
    }
}
