<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Category;
use Illuminate\Support\Facades\Validator;

class CategoryController extends Controller
{
    // Daftar peran yang diizinkan untuk memodifikasi kategori
    private $allowedRoles = ['admin', 'super_admin'];

    // --- 1. READ (List Semua Kategori) ---
    public function index()
    {
        $categories = Category::all();

        return response()->json([
            'message' => 'Daftar kategori berhasil diambil.',
            'categories' => $categories
        ]);
    }

    // --- 2. CREATE (Simpan Kategori Baru) ---
    public function store(Request $request)
    {
        // Pengecekan Otorisasi: Hanya Admin dan Super Admin
        if (!in_array($request->user()->role, $this->allowedRoles)) {
            return response()->json([
                'message' => 'Anda tidak memiliki izin (Hanya Admin atau Super Admin) untuk membuat kategori.'
            ], 403);
        }
        
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255|unique:categories,name',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $category = Category::create($request->all());

        return response()->json([
            'message' => 'Kategori berhasil dibuat.',
            'category' => $category
        ], 201); 
    }

    // --- 3. READ (Detail Kategori) ---
    public function show(Category $category)
    {
        return response()->json([
            'message' => 'Detail kategori berhasil diambil.',
            'category' => $category
        ]);
    }

    // --- 4. UPDATE (Perbarui Kategori) ---
    public function update(Request $request, Category $category)
    {
        // Pengecekan Otorisasi: Hanya Admin dan Super Admin
        if (!in_array($request->user()->role, $this->allowedRoles)) {
            return response()->json([
                'message' => 'Anda tidak memiliki izin (Hanya Admin atau Super Admin) untuk memperbarui kategori.'
            ], 403);
        }

        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255|unique:categories,name,' . $category->id,
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $category->update($request->all());

        return response()->json([
            'message' => 'Kategori berhasil diperbarui.',
            'category' => $category
        ]);
    }

    // --- 5. DELETE (Hapus Kategori) ---
    public function destroy(Request $request, Category $category)
    {
        // Pengecekan Otorisasi: Hanya Admin dan Super Admin
        if (!in_array($request->user()->role, $this->allowedRoles)) {
            return response()->json([
                'message' => 'Anda tidak memiliki izin (Hanya Admin atau Super Admin) untuk menghapus kategori.'
            ], 403);
        }

        // Pengecekan Integritas Data
        if ($category->products()->count() > 0) {
            return response()->json([
                'message' => 'Gagal menghapus kategori. Terdapat produk yang masih terkait.'
            ], 409); // 409 Conflict
        }
        
        $category->delete();

        return response()->json([
            'message' => 'Kategori berhasil dihapus.'
        ], 200);
    }
}