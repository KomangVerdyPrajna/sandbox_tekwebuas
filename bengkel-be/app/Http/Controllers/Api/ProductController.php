<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Product;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str; // Diperlukan untuk membuat slug

class ProductController extends Controller
{
    // --- 1. READ (List Semua Produk) ---
    /**
     * Display a listing of the resource.
     * Mengambil daftar semua produk.
     */
    public function index()
    {
        // Ambil semua produk, termasuk relasi kategori
        $products = Product::with('category')->get();

        return response()->json([
            'message' => 'Daftar produk berhasil diambil.',
            'products' => $products
        ]);
    }

    // --- 2. CREATE (Simpan Produk Baru) ---
    /**
     * Store a newly created resource in storage.
     * Menyimpan data produk baru ke database.
     */
    public function store(Request $request)
    {
        // Aturan validasi
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255|unique:products,name',
            'description' => 'required|string',
            'price' => 'required|numeric|min:0',
            'stock' => 'required|integer|min:0',
            'img_url' => 'nullable|string|max:255',
            'category_id' => 'required|exists:categories,id', // Pastikan ID kategori ada
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        // Buat slug dan tanggal
        $data = $request->all();
        $data['slug'] = Str::slug($request->name);
        $data['create_at'] = now(); // Menggunakan fungsi now() untuk tanggal

        // Buat Produk
        $product = Product::create($data);

        return response()->json([
            'message' => 'Produk berhasil dibuat.',
            'product' => $product->load('category')
        ], 201); // 201 Created
    }

    // --- 3. READ (Detail Produk) ---
    /**
     * Display the specified resource.
     * Menampilkan detail produk spesifik berdasarkan ID.
     */
    public function show(Product $product)
    {
        // Mengembalikan produk dengan relasi kategori
        return response()->json([
            'message' => 'Detail produk berhasil diambil.',
            'product' => $product->load('category')
        ]);
    }

    // --- 4. UPDATE (Perbarui Produk) ---
    /**
     * Update the specified resource in storage.
     * Memperbarui data produk yang ada.
     */
    public function update(Request $request, Product $product)
    {
        // Aturan validasi (kecuali nama harus unik dari ID produk ini sendiri)
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255|unique:products,name,' . $product->id,
            'description' => 'required|string',
            'price' => 'required|numeric|min:0',
            'stock' => 'required|integer|min:0',
            'img_url' => 'nullable|string|max:255',
            'category_id' => 'required|exists:categories,id',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $data = $request->all();
        $data['slug'] = Str::slug($request->name);
        $data['update_at'] = now(); // Mengupdate tanggal pembaruan

        $product->update($data);

        return response()->json([
            'message' => 'Produk berhasil diperbarui.',
            'product' => $product->load('category')
        ]);
    }

    // --- 5. DELETE (Hapus Produk) ---
    /**
     * Remove the specified resource from storage.
     * Menghapus produk dari database.
     */
    public function destroy(Product $product)
    {
        $product->delete();

        return response()->json([
            'message' => 'Produk berhasil dihapus.'
        ], 200); // 200 OK
    }
}