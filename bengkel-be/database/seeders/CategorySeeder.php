<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class CategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('categories')->insert([
            [
                'name' => 'Pelumas',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Ban',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Sparepart Rem',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Aki',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Jasa Servis',
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);
    }
}
