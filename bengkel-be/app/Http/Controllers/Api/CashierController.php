<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Cashier;
use Illuminate\Support\Facades\Validator;

class CashierController extends Controller
{
    // Daftar peran yang diizinkan untuk memodifikasi (update/delete) data kasir
    private $superAdminRole = 'super_admin';
    // Daftar peran yang diizinkan untuk mencatat transaksi (store)
    private $allowedStoreRoles = ['kasir', 'admin', 'super_admin'];

    // --- 1. READ (List Semua Transaksi) ---
    public function index(Request $request)
    {
        // Hanya Admin dan Super Admin yang diizinkan melihat daftar lengkap
        if (!in_array($request->user()->role, ['admin', 'super_admin'])) {
            return response()->json([
                'message' => 'Anda tidak memiliki izin (Hanya Admin atau Super Admin) untuk melihat laporan transaksi.'
            ], 403);
        }

        // Ambil semua transaksi dengan detail produk/booking
        $transactions = Cashier::with(['product:id,name', 'booking:id,jenis_service,user_id'])
                               ->latest()
                               ->get();

        return response()->json([
            'message' => 'Daftar transaksi kasir berhasil diambil.',
            'transactions' => $transactions
        ]);
    }

    // --- 2. CREATE (Catat Transaksi Baru) ---
    public function store(Request $request)
    {
        // Pengecekan Otorisasi: Kasir, Admin, atau Super Admin
        if (!in_array($request->user()->role, $this->allowedStoreRoles)) {
            return response()->json([
                'message' => 'Anda tidak memiliki izin untuk mencatat transaksi.'
            ], 403);
        }

        // Aturan validasi
        $validator = Validator::make($request->all(), [
            'product_id' => 'nullable|exists:products,id',
            'booking_id' => 'nullable|exists:bookings,id',
            'payment_method' => 'required|string|in:Cash,Debit Card,Credit Card,E-Wallet',
            'total' => 'required|numeric|min:0',
            'transaction_date' => 'required|date',
            // Pastikan salah satu (product_id atau booking_id) terisi
            'is_valid' => 'required_without_all:product_id,booking_id', // Logika custom untuk memastikan ada FK
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $transaction = Cashier::create($request->all());

        return response()->json([
            'message' => 'Transaksi berhasil dicatat.',
            'transaction' => $transaction->load(['product', 'booking'])
        ], 201);
    }

    // --- 3. READ (Detail Transaksi) ---
    public function show(Request $request, Cashier $cashier)
    {
        // Hanya Admin dan Super Admin yang diizinkan melihat detail
        if (!in_array($request->user()->role, ['admin', 'super_admin'])) {
            return response()->json([
                'message' => 'Anda tidak memiliki izin untuk melihat detail transaksi.'
            ], 403);
        }

        return response()->json([
            'message' => 'Detail transaksi berhasil diambil.',
            'transaction' => $cashier->load(['product', 'booking'])
        ]);
    }

    // --- 4. UPDATE (Perbarui Transaksi) ---
    /**
     * Update the specified resource in storage.
     * Hanya Super Admin yang boleh mengubah data transaksi (audit trail).
     */
    public function update(Request $request, Cashier $cashier)
    {
        // Pengecekan Otorisasi: HANYA Super Admin
        if ($request->user()->role !== $this->superAdminRole) {
            return response()->json([
                'message' => 'Anda tidak memiliki izin (Hanya Super Admin) untuk mengubah transaksi.'
            ], 403);
        }

        // Aturan validasi update (sama seperti store)
        $validator = Validator::make($request->all(), [
            'product_id' => 'nullable|exists:products,id',
            'booking_id' => 'nullable|exists:bookings,id',
            'payment_method' => 'required|string|in:Cash,Debit Card,Credit Card,E-Wallet',
            'total' => 'required|numeric|min:0',
            'transaction_date' => 'required|date',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $cashier->update($request->all());

        return response()->json([
            'message' => 'Transaksi berhasil diperbarui.',
            'transaction' => $cashier->load(['product', 'booking'])
        ]);
    }

    // --- 5. DELETE (Hapus Transaksi) ---
    /**
     * Remove the specified resource from storage.
     * Hanya Super Admin yang boleh menghapus (untuk pembatalan audit).
     */
    public function destroy(Request $request, Cashier $cashier)
    {
        // Pengecekan Otorisasi: HANYA Super Admin
        if ($request->user()->role !== $this->superAdminRole) {
            return response()->json([
                'message' => 'Anda tidak memiliki izin (Hanya Super Admin) untuk menghapus transaksi.'
            ], 403);
        }
        
        $cashier->delete();

        return response()->json([
            'message' => 'Transaksi berhasil dihapus.'
        ], 200);
    }
}