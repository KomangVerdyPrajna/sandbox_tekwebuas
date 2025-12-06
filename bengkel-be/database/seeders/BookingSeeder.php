<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Booking;
use App\Models\User;
use App\Models\Cashier; // Diperlukan untuk truncate tabel anak

class BookingSeeder extends Seeder
{
    public function run(): void
    {
        $user1 = User::first();
        $user2 = User::skip(1)->first();

        $allowedServices = ['Service Ringan', 'Service Berat', 'Ganti Oli', 'Perbaikan Rem', 'Tune Up'];

        if (!$user1 || !$user2) {
             echo "Peringatan: Tidak cukup user untuk seeding Booking. Pastikan UserSeeder telah dijalankan.\n";
             return;
        }

        // 🛑 SOLUSI: TRUNCATE TABEL ANAK DULU SEBELUM TABEL INDUK
        Cashier::truncate(); 
        Booking::truncate(); 

        // --- Booking 1 (Motor Vario - Matic) ---
        Booking::create([
            'user_id'         => $user1->id, 
            'jenis_kendaraan' => 'Matic', 
            'nama_kendaraan'  => 'Honda Vario',
            'jenis_service'   => 'Ganti Oli', 
            'booking_date'    => '2025-01-10',
            'no_wa'           => '081234567890',
            'notes'           => 'Mohon cepat selesai',
            'status'          => 'Pending',
        ]);

        // --- Booking 2 (Mobil Avanza - Manual) ---
        Booking::create([
            'user_id'         => $user2->id, 
            'jenis_kendaraan' => 'Manual', 
            'nama_kendaraan'  => 'Toyota Avanza',
            'jenis_service'   => 'Service Ringan', 
            'booking_date'    => '2025-01-15',
            'no_wa'           => '085798765432',
            'notes'           => 'Servis rutin',
            'status'          => 'Confirmed', 
        ]);
        
        echo "Berhasil membuat 2 data booking yang sesuai dengan struktur baru (jenis_kendaraan dan jenis_service).\n";
    }
}