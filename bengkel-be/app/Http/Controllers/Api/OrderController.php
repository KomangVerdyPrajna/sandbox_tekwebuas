<?php

namespace App\Http\Controllers\Api;

use Illuminate\Routing\Controller;
use Illuminate\Http\Request;
use App\Models\Order;
use App\Models\Cart;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Log;

class OrderController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth:sanctum');
    }

    // Ambil pesanan user
    public function index(Request $request)
    {
        $orders = Order::where('user_id', $request->user()->id)
                        ->orderByDesc('created_at')
                        ->get();

        return response()->json([
            'message' => 'Daftar pesanan ditemukan',
            'orders'  => $orders
        ], 200);
    }

    // Checkout (SIMPAN ITEMS DALAM JSON)
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'items' => 'required|array|min:1',
            'items.*.product_id' => 'required|exists:products,id',
            'items.*.quantity' => 'required|integer|min:1',
            'items.*.subtotal' => 'required|numeric|min:0',

            'name' => 'required|string|max:255',
            'no_tlp' => 'required|string|max:20',
            'address' => 'required|string',
            'delivery' => 'required|in:ambil_di_tempat,kurir',
            'payment' => 'required|in:tunai,transfer',
            'total' => 'required|numeric|min:0',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        try {
            $order = Order::create([
                'user_id' => $request->user()->id,
                'items' => json_encode($request->items), // 🔥 penting!
                'name' => $request->name,
                'no_tlp' => $request->no_tlp,
                'address' => $request->address,
                'delivery' => $request->delivery,
                'payment' => $request->payment,
                'total' => $request->total,
                'status' => 'pending'
            ]);

            // Kosongkan keranjang pengguna
            Cart::where('user_id', $request->user()->id)->delete();

            return response()->json([
                'message' => 'Pesanan berhasil dibuat!',
                'order' => $order
            ], 201);

        } catch (\Exception $e) {
            Log::error("ORDER ERROR: ".$e->getMessage());
            return response()->json(['message' => 'Gagal memproses pesanan.'], 500);
        }
    }

    public function show($id, Request $request)
    {
        $order = Order::where('user_id', $request->user()->id)->findOrFail($id);

        return response()->json([
            'message' => 'Detail pesanan',
            'order' => $order
        ], 200);
    }
}
