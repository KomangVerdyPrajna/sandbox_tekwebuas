<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Booking;

class BookingSeeder extends Seeder
{
    public function run(): void
    {
        Booking::create([
            'user_id'         => 1, // Ganti dengan ID User yang valid
            'jenis_kendaraan' => 'Motor',
            'nama_kendaraan'  => 'Honda Vario',
            'services_id'     => 1,
            'booking_date'    => '2025-01-10',
            'no_wa'           => '081234567890', // <-- DIPERTAHANKAN
            'notes'           => 'Mohon cepat selesai',
            'status'          => 'pending',
        ]);

        Booking::create([
            'user_id'         => 2, 
            'jenis_kendaraan' => 'Mobil',
            'nama_kendaraan'  => 'Toyota Avanza',
            'services_id'     => 2, 
            'booking_date'    => '2025-01-15',
            'no_wa'           => '085798765432',
            'notes'           => 'Servis rutin',
            'status'          => 'pending',
        ]);
    }
}