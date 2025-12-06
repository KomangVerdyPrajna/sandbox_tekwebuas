<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Hapus data lama agar saat di-seed ulang tidak duplikasi
        // Ini opsional jika Anda selalu menggunakan migrate:fresh
        // DB::table('users')->truncate(); 

        // 1. Akun Super Admin (untuk testing otorisasi)
        User::create([
            'name' => 'Super Admin Utama',
            'email' => 'superadmin@example.com',
            'password' => Hash::make('password'), // Password di-hash
            'role' => 'super_admin',
        ]);

        // 2. Akun Customer (untuk testing login user biasa)
        User::create([
            'name' => 'Customer Biasa',
            'email' => 'customer@example.com',
            'password' => Hash::make('password'),
            'role' => 'customer',
        ]);
        
        // 3. Akun Admin (untuk testing role admin)
        User::create([
            'name' => 'Admin Biasa',
            'email' => 'admin@example.com',
            'password' => Hash::make('password'),
            'role' => 'admin',
        ]);
        
        echo "Berhasil membuat 3 user (Super Admin, Customer, Admin) dengan password: password.\n";
    }
}