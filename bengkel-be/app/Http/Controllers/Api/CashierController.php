<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use App\Models\Cashier; // Pastikan model Cashier sudah dibuat dan di-import
use App\Models\Booking; // Diperlukan untuk update status booking
// use App\Models\CashierItem; // Jika Anda menggunakan tabel detail item
// use App\Models\Product; // Diperlukan untuk pengurangan stok

class CashierController extends Controller
{
    /**
     * Menyimpan transaksi kasir baru (POST /api/cashier).
     */
    public function store(Request $request)
    {
        $user = $request->user();
        // Cek Otorisasi (Sudah ditangani oleh middleware auth:sanctum dan role)
        if (!$user) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }

        // --- 1. VALIDASI DATA DARI NEXT.JS ---
        $validator = Validator::make($request->all(), [
            'total' => 'required|numeric|min:0',
            'payment_method' => 'required|string|in:Cash,Card,Transfer',
            'items' => 'required|array|min:1',
            
            // Validasi setiap item dalam array 'items'
            'items.*.id' => 'nullable|integer', // originalId dari produk/booking (null jika service manual)
            'items.*.type' => 'required|string|in:product,service_manual,booking_pelunasan',
            'items.*.name' => 'required|string|max:255',
            'items.*.price' => 'required|numeric|min:0',
            'items.*.quantity' => 'required|integer|min:1',
        ]);

        if ($validator->fails()) {
            // Mengembalikan error validasi 422 yang lengkap ke Next.js
            return response()->json(['errors' => $validator->errors(), 'message' => 'Validasi data gagal.'], 422);
        }
        
        $validatedData = $validator->validated();

        // --- 2. MULAI TRANSAKSI DATABASE ---
        DB::beginTransaction();

        try {
            // A. Simpan Header Transaksi Kasir
            $cashier = Cashier::create([
                'user_id' => $user->id, // Kasir yang bertugas
                'payment_method' => $validatedData['payment_method'],
                'total' => $validatedData['total'],
                'transaction_date' => now(),
            ]);

            // B. Proses Detail Item dan Update Booking
            foreach ($validatedData['items'] as $item) {
                
                // [Optional: Simpan detail item ke tabel CashierItem jika ada]
                /*
                CashierItem::create([
                    'cashier_id' => $cashier->id,
                    'item_type' => $item['type'],
                    'item_id' => $item['id'], // product_id atau booking_id
                    'name' => $item['name'],
                    'price' => $item['price'],
                    'quantity' => $item['quantity'],
                ]);
                */

                // LOGIKA KHUSUS UNTUK PELUNASAN BOOKING
                if ($item['type'] === 'booking_pelunasan' && $item['id']) {
                    $bookingId = $item['id'];
                    $booking = Booking::find($bookingId);

                    if ($booking) {
                        // Tandai status booking sebagai Selesai/Completed
                        $booking->status = 'Completed'; 
                        $booking->save();
                    }
                }
                
                // LOGIKA UNTUK PENGURANGAN STOK (Jika item adalah 'product')
                // if ($item['type'] === 'product' && $item['id']) {
                //     Product::where('id', $item['id'])->decrement('stock', $item['quantity']); 
                // }
            }
            
            DB::commit();

            // --- 3. RESPONSE SUKSES ---
            return response()->json([
                'message' => 'Transaksi berhasil diproses.',
                'transaction_id' => $cashier->id,
                'total_paid' => $cashier->total,
            ], 200);

        } catch (\Exception $e) {
            DB::rollBack();
            \Log::error("Cashier transaction failed: " . $e->getMessage());
            return response()->json(['message' => 'Gagal memproses transaksi: ' . $e->getMessage()], 500);
        }
    }
    
    /**
     * Mengambil daftar transaksi kasir (GET /api/cashier).
     */
    public function index(Request $request)
    {
            $user = $request->user();
            if (!in_array($user->role, ['admin', 'super_admin', 'kasir'])) {
                return response()->json(['message' => 'Anda tidak diizinkan.'], 403);
            }

            // PENTING: Lakukan Eager Loading untuk 'product' dan 'booking'
            $transactions = Cashier::with(['product', 'booking'])
                                ->latest()
                                ->paginate(15);

            // Jika Anda menggunakan tabel CashierItem untuk detail transaksi (bukan product_id/booking_id langsung)
            // $transactions = Cashier::with('items.product', 'items.booking')->latest()->paginate(15);


            return response()->json([
                'message' => 'Daftar transaksi kasir berhasil diambil.',
                'data' => $transactions // Ini adalah objek pagination Laravel yang berisi 'data' array transaksi
            ]);
    }
    
    /**
     * Menampilkan detail transaksi kasir (GET /api/cashier/{id}).
     */
    public function show(Cashier $cashier)
    {
        // Anda mungkin perlu me-load relasi seperti CashierItems di sini
        // $cashier->load('items'); 
        
        return response()->json([
            'message' => 'Detail transaksi kasir berhasil diambil.',
            'data' => $cashier
        ]);
    }

    /**
     * Memperbarui transaksi (PUT/PATCH /api/cashier/{id}). (Jarang digunakan untuk kasir)
     */
    public function update(Request $request, Cashier $cashier)
    {
        // Logika update (Biasanya hanya status atau catatan)
        return response()->json(['message' => 'Update tidak diizinkan untuk transaksi kasir.'], 405);
    }
    
    /**
     * Menghapus transaksi (DELETE /api/cashier/{id}).
     */
    public function destroy(Cashier $cashier)
    {
        $cashier->delete();
        return response()->json(['message' => 'Transaksi kasir berhasil dihapus.'], 200);
    }
}