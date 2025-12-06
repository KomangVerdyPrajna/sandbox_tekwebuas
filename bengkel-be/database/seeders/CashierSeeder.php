<?php

namespace Database\Seeders;

use App\Models\Cashier;
use App\Models\Product;
use App\Models\Booking;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class CashierSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Peringatan: Pastikan Anda memiliki data di tabel 'products' dan 'bookings'
        // Jika belum, kode ini mungkin gagal atau mengembalikan nilai null.
        
        $firstProductId = Product::inRandomOrder()->value('id');
        $firstBookingId = Booking::inRandomOrder()->value('id');
        
        // Hapus data lama (opsional, tapi disarankan)
        DB::table('cashier')->truncate();

        // --- Data Transaksi ke-1 (Diasumsikan transaksi produk) ---
        Cashier::create([
            'product_id'        => $firstProductId, // Mengambil ID produk pertama secara acak
            'booking_id'        => null,           // Tidak ada booking untuk transaksi ini
            'payment_method'    => 'Credit Card',
            'total'             => 185500.00,
            'transaction_date'  => fake()->dateTimeBetween('-1 week', 'now'),
        ]);

        // --- Data Transaksi ke-2 (Diasumsikan transaksi booking/jasa) ---
        Cashier::create([
            'product_id'        => null,           // Tidak ada produk untuk transaksi ini
            'booking_id'        => $firstBookingId, // Mengambil ID booking pertama secara acak
            'payment_method'    => 'Cash',
            'total'             => 450000.00,
            'transaction_date'  => fake()->dateTimeBetween('-1 month', 'now'),
        ]);

        echo "Berhasil membuat 2 data transaksi kasir palsu (tanpa loop).\n";
    }
}