<?php  

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Product;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Storage;

class ProductController extends Controller 
{
    // ======================= LIST PRODUCT =======================
    public function index()
    {
        $products = Product::with('category')->get();

        return response()->json([
            'message' => 'Daftar produk berhasil diambil.',
            'products' => $products
        ]);
    }

    // ======================= CREATE PRODUCT =======================
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255|unique:products,name',
            'description' => 'required|string',
            'price' => 'required|numeric|min:0',
            'stock' => 'required|integer|min:0',
            'img_url' => 'required|image|mimes:jpg,jpeg,png,webp|max:2048',
            'category_id' => 'required|exists:categories,id',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $imagePath = null;

        if($request->hasFile('img_url')){
            $file = $request->file('img_url');
            $fileName = time().'.'.$file->getClientOriginalExtension();
            $file->storeAs('public/products', $fileName);

            // Path yang disimpan ke database untuk bisa diakses frontend
            $imagePath = 'storage/products/'.$fileName;
        }

        $product = Product::create([
            'name' => $request->name,
            'slug' => Str::slug($request->name),
            'description' => $request->description,
            'price' => $request->price,
            'stock' => $request->stock,
            'img_url' => $imagePath,
            'category_id' => $request->category_id,
        ]);

        return response()->json([
            'message' => 'Produk berhasil dibuat.',
            'product' => $product
        ], 201);
    }

    // ======================= DETAIL PRODUCT =======================
    public function show(Product $product)
    {
        return response()->json([
            'message' => 'Detail produk berhasil diambil.',
            'product' => $product->load('category')
        ]);
    }

    // ======================= UPDATE PRODUCT =======================
    public function update(Request $request, Product $product)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255|unique:products,name,' . $product->id,
            'description' => 'required|string',
            'price' => 'required|numeric|min:0',
            'stock' => 'required|integer|min:0',
            'img_url' => 'nullable|image|mimes:jpg,jpeg,png,webp|max:2048',
            'category_id' => 'required|exists:categories,id',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        // Jika upload gambar baru maka hapus gambar lama
        if ($request->hasFile('img_url')) {

            // Hapus jika file lama ada
            if($product->img_url && Storage::exists(str_replace('storage/', 'public/', $product->img_url))){
                Storage::delete(str_replace('storage/', 'public/', $product->img_url));
            }

            $file = $request->file('img_url');
            $fileName = time().'.'.$file->getClientOriginalExtension();
            $file->storeAs('public/products', $fileName);

            $product->img_url = 'storage/products/'.$fileName;
        }

        $product->update([
            'name' => $request->name,
            'slug' => Str::slug($request->name),
            'description' => $request->description,
            'price' => $request->price,
            'stock' => $request->stock,
            'category_id' => $request->category_id,
        ]);

        return response()->json([
            'message' => 'Produk berhasil diperbarui.',
            'product' => $product->load('category')
        ]);
    }

    // ======================= DELETE PRODUCT =======================
    public function destroy(Product $product)
    {
        // Hapus gambar dari storage
        if($product->img_url && Storage::exists(str_replace('storage/', 'public/', $product->img_url))){
            Storage::delete(str_replace('storage/', 'public/', $product->img_url));
        }

        $product->delete();

        return response()->json([
            'message' => 'Produk berhasil dihapus.'
        ], 200);
    }
}
