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
        $products = Product::all(); 

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
<<<<<<< Updated upstream
            'img_url' => 'nullable|image|mimes:jpg,jpeg,png,webp|max:2048',
            'jenis_barang' => 'required|in:Sparepart,Aksesoris',
=======
            'img_url' => 'required|image|mimes:jpg,jpeg,png,webp|max:2048',
            'jenis_barang' => 'required|in:Sparepart,Aksesoris', 
>>>>>>> Stashed changes
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        try {
            $fileName = null;

<<<<<<< Updated upstream
            if ($request->hasFile('img_url')) {
                $file = $request->file('img_url');

                if (!Storage::disk('public')->exists('products')) {
                    Storage::disk('public')->makeDirectory('products');
                }

                $fileName = time() . '_' . Str::slug($request->name) . '.' . $file->getClientOriginalExtension();
                $file->storeAs('products', $fileName, 'public');
            }

            $product = Product::create([
                'name' => $request->name,
                'slug' => Str::slug($request->name) . "-" . time(),
                'description' => $request->description,
                'price' => $request->price,
                'stock' => $request->stock,
                'img_url' => $fileName,
                'jenis_barang' => $request->jenis_barang,
            ]);

            return response()->json([
                'message' => 'Produk berhasil dibuat.',
                'product' => $product
            ], 201);

        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Terjadi error saat menyimpan produk.',
                'error' => $e->getMessage()
            ], 500);
        }
=======
        if($request->hasFile('img_url')){
            $file = $request->file('img_url');
            $fileName = time().'_'.Str::slug($request->name).'.'.$file->getClientOriginalExtension();
            
            $file->storeAs($folder, $fileName, 'public'); 
            $imagePath = $folder.'/'.$fileName; 
        }

        $product = Product::create([
            'name' => $request->name,
            'slug' => Str::slug($request->name),
            'description' => $request->description,
            'price' => $request->price,
            'stock' => $request->stock,
            'img_url' => $imagePath,
            'jenis_barang' => $request->jenis_barang,
        ]);

        return response()->json([
            'message' => 'Produk berhasil dibuat.',
            'product' => $product
        ], 201);
>>>>>>> Stashed changes
    }

    // ======================= DETAIL PRODUCT =======================
    public function show(Product $product)
    {
        return response()->json([
            'message' => 'Detail produk berhasil diambil.',
            'product' => $product 
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
<<<<<<< Updated upstream
            'jenis_barang' => 'required|in:Sparepart,Aksesoris',
=======
            'jenis_barang' => 'required|in:Sparepart,Aksesoris', 
>>>>>>> Stashed changes
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

<<<<<<< Updated upstream
        try {
            if ($request->hasFile('img_url')) {
                if($product->img_url){
                    Storage::disk('public')->delete('products/'.$product->img_url);
                }

                $file = $request->file('img_url');
                $fileName = time().'_'.Str::slug($request->name).'.'.$file->getClientOriginalExtension();
                $file->storeAs('products', $fileName, 'public');
                $product->img_url = $fileName;
            }

            $product->update([
                'name' => $request->name,
                'slug' => Str::slug($request->name) . "-" . time(),
                'description' => $request->description,
                'price' => $request->price,
                'stock' => $request->stock,
                'jenis_barang' => $request->jenis_barang,
            ]);

            return response()->json([
                'message' => 'Produk berhasil diperbarui.',
                'product' => $product 
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Terjadi error saat memperbarui produk.',
                'error' => $e->getMessage()
            ], 500);
        }
=======
        // 1. Proses Gambar
        if ($request->hasFile('img_url')) {
            if($product->img_url){
                Storage::disk('public')->delete($product->img_url);
            }

            $file = $request->file('img_url');
            $fileName = time().'_'.Str::slug($request->name).'.'.$file->getClientOriginalExtension();
            $file->storeAs($folder, $fileName, 'public');

            // Set properti img_url pada objek $product
            $product->img_url = $folder.'/'.$fileName; 
        }

        // 2. PROSES DATA TEKSTUAL (FIX KRUSIAL: Manual Assignment)
        $product->name = $request->name;
        $product->slug = Str::slug($request->name);
        $product->description = $request->description;
        $product->price = $request->price;
        $product->stock = $request->stock;
        $product->jenis_barang = $request->jenis_barang;

        // 3. SIMPAN SEMUA PERUBAHAN KE DATABASE
        $product->save(); 

        return response()->json([
            'message' => 'Produk berhasil diperbarui.',
            'product' => $product 
        ], 200);
>>>>>>> Stashed changes
    }

    // ======================= DELETE PRODUCT =======================
    public function destroy(Product $product)
    {
<<<<<<< Updated upstream
        try {
            if($product->img_url){
                Storage::disk('public')->delete('products/'.$product->img_url);
            }

            $product->delete();

            return response()->json([
                'message' => 'Produk berhasil dihapus.'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Terjadi error saat menghapus produk.',
                'error' => $e->getMessage()
            ], 500);
=======
        if($product->img_url){
            Storage::disk('public')->delete($product->img_url);
>>>>>>> Stashed changes
        }
    }
}
