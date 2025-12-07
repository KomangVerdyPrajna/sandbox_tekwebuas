<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Str;
use DB;

class CategorySeeder extends Seeder
{
    public function run(): void
    {
        $categories = ['Aksesoris', 'Sparepart'];

        foreach ($categories as $c) {
            DB::table('categories')->insert([
                'name' => $c,
                'slug' => Str::slug($c),
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }
    }
}
