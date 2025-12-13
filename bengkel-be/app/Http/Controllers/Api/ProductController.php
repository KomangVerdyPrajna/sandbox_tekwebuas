<?php 

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Product;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\File; // <-- tambahan untuk file ops

class ProductController extends Controller
{
    // ================================================================
    // GET ALL PRODUCTS (DIURUTKAN TERBARU DULU)
    // ================================================================
   public function index()
{
    // gunakan APP_URL jika di-set, fallback ke url('/') yang di-generate Laravel
  $base = "http://localhost:8000"; // FORCE biar sesuai server kamu


    $products = Product::latest()->get()->map(function ($p) use ($base) {
        // ambil nilai asli dari kolom img_url (bisa berupa JSON array atau string)
        $raw = $p->getRawOriginal('img_url') ?? '[]';
        $names = json_decode($raw, true) ?? [];

        // jika stored as single string (legacy), ubah jadi array
        if (!is_array($names) && is_string($raw) && !\Illuminate\Support\Str::startsWith($raw, '[')) {
            $names = [$raw];
        }

        // bangun URL penuh untuk tiap nama file
        $urls = array_map(function ($name) use ($base) {
            if (empty($name)) return null;

            // jika sudah URL absolut, kembalikan apa adanya
            if (strpos($name, 'http://') === 0 || strpos($name, 'https://') === 0) {
                return $name;
            }

            $clean = ltrim($name, '/');

            // jika sudah mengandung folder images/ atau storage/, gunakan apa adanya relatif ke base
            if (strpos($clean, 'images/') === 0) {
                return $base . '/' . $clean;
            }
            if (strpos($clean, 'storage/') === 0) {
                return $base . '/' . $clean;
            }

            // default: anggap nama file berada di public/images
            return $base . '/images/' . $clean;
        }, $names);

        // filter hasil kosong/null
        $urls = array_values(array_filter($urls));

        return [
            'id' => $p->id,
            'name' => $p->name,
            'slug' => $p->slug,
            'description' => $p->description,
            'price' => $p->price,
            'stock' => $p->stock,
            'jenis_barang' => $p->jenis_barang,
            'img_urls' => $urls,
        ];
    });

    return response()->json(['products' => $products], 200);
}

    // ================================================================
    // SHOW DETAIL PRODUCT
    // ================================================================
    public function show($id)
    {
        $product = Product::findOrFail($id);

        return response()->json([
            'product' => [
                'id' => $product->id,
                'name' => $product->name,
                'slug' => $product->slug,
                'description' => $product->description,
                'price' => $product->price,
                'stock' => $product->stock,
                'jenis_barang' => $product->jenis_barang,
                // Menggunakan Accessor image_urls
                'img_urls' => $product->image_urls, 
            ]
        ]);
    }

    // ================================================================
    // STORE PRODUCT (MULTI-IMAGE AMAN)
    // =================================================================
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'price' => 'required|numeric',
            'description' => 'nullable|string',
            'stock' => 'required|integer',
            'jenis_barang' => 'nullable|string',
            // Validasi array file
            'images' => 'required|array|max:5', 
            'images.*' => 'image|mimes:jpg,jpeg,png,webp|max:2048',
        ]);

        $imageNames = [];

        if ($request->hasFile('images')) {
            $files = $request->file('images'); 
            
            if (is_array($files)) {
                // pastikan folder public/images ada
                $publicImagesPath = public_path('images');
                if (!is_dir($publicImagesPath)) {
                    mkdir($publicImagesPath, 0755, true);
                }

                foreach ($files as $img) {
                    // 💡 Memastikan file valid sebelum disimpan
                    if ($img && $img->isValid()) { 
                        $filename = time() . '_' . uniqid() . '.' . $img->getClientOriginalExtension();
                        // Pindahkan ke public/images (bukan storage)
                        $img->move($publicImagesPath, $filename);
                        $imageNames[] = $filename; // Tambahkan ke array
                    }
                }
            }
        }

        $product = Product::create([
            'name' => $request->name,
            'slug' => Str::slug($request->name) . '-' . time(),
            'description' => $request->description,
            'price' => $request->price,
            'stock' => $request->stock,
            'jenis_barang' => $request->jenis_barang,
            'img_url' => $imageNames, // Menyimpan array nama file mentah
        ]);

        return response()->json([
            'message' => 'Produk berhasil ditambahkan',
            'product' => [
                'id' => $product->id,
                'name' => $product->name,
                'img_urls' => $product->image_urls, 
            ]
        ], 201);
    }

    // ================================================================
    // UPDATE PRODUCT (GANTI SEMUA GAMBAR)
    // ================================================================
    public function update(Request $request, $id)
    {
        $product = Product::findOrFail($id);

        $request->validate([
            'name' => 'required|string|max:255',
            'price' => 'required|numeric',
            'description' => 'nullable|string',
            'stock' => 'required|integer',
            'jenis_barang' => 'nullable|string',
            'images.*' => 'image|mimes:jpg,jpeg,png,webp|max:2048', // optional file
        ]);
        
        // Dapatkan nama file yang ada (mentah dari DB) untuk dihapus
        $currentRawJson = $product->getRawOriginal('img_url') ?? '[]';
        $imageNamesToDelete = json_decode($currentRawJson, true) ?? [];

        // Logika tambahan untuk menangani data lama yang bukan JSON array (string tunggal)
        if (!is_array($imageNamesToDelete) && is_string($currentRawJson) && !Str::startsWith($currentRawJson, '[')) {
             $imageNamesToDelete = [$currentRawJson];
        }
        
        $imageNamesToSave = $imageNamesToDelete;

        if ($request->hasFile('images')) {
            $files = $request->file('images');
            
            // Hapus gambar lama dari public/images
            $publicImagesPath = public_path('images');
            foreach ($imageNamesToDelete as $img) {
                if (is_string($img) && !empty($img)) {
                    $filePath = $publicImagesPath . DIRECTORY_SEPARATOR . $img;
                    if (File::exists($filePath)) {
                        File::delete($filePath);
                    }
                }
            }
            
            // Upload gambar baru
            $imageNamesToSave = []; 
            if (is_array($files)) {
                // pastikan folder public/images ada
                if (!is_dir($publicImagesPath)) {
                    mkdir($publicImagesPath, 0755, true);
                }

                foreach ($files as $img) {
                    if ($img && $img->isValid()) {
                        $filename = time() . '_' . uniqid() . '.' . $img->getClientOriginalExtension();
                        $img->move($publicImagesPath, $filename);
                        $imageNamesToSave[] = $filename;
                    }
                }
            }
        }

        $product->update([
            'name' => $request->name,
            'slug' => Str::slug($request->name) . '-' . time(),
            'description' => $request->description,
            'price' => $request->price,
            'stock' => $request->stock,
            'jenis_barang' => $request->jenis_barang,
            'img_url' => $imageNamesToSave, // Menyimpan array nama file mentah
        ]);

        return response()->json([
            'message' => 'Produk berhasil diupdate',
            'product' => [
                'id' => $product->id,
                'name' => $product->name,
                'img_urls' => $product->image_urls,
            ]
        ]);
    }

    // ================================================================
    // DELETE PRODUCT
    // ================================================================
    public function destroy($id)
    {
        $product = Product::findOrFail($id);
        
        // Dapatkan nama file yang ada (mentah dari DB) untuk dihapus
        $currentRawJson = $product->getRawOriginal('img_url') ?? '[]';
        $imageNames = json_decode($currentRawJson, true) ?? [];

        // Logika tambahan untuk menangani data lama yang bukan JSON array (string tunggal)
        if (!is_array($imageNames) && is_string($currentRawJson) && !Str::startsWith($currentRawJson, '[')) {
             $imageNames = [$currentRawJson];
        }
        
        // Hapus semua file gambar di public/images
        if (!empty($imageNames)) {
            $publicImagesPath = public_path('images');
            foreach ($imageNames as $img) {
                if (is_string($img) && !empty($img)) {
                    $filePath = $publicImagesPath . DIRECTORY_SEPARATOR . $img;
                    if (File::exists($filePath)) {
                        File::delete($filePath);
                    }
                }
            }
        }

        $product->delete();

        return response()->json([
            'message' => 'Produk berhasil dihapus'
        ]);
    }
    
    // ... (Fungsi lain seperti searchForCashier)
}
