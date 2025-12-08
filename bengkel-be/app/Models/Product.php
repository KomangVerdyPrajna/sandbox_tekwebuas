<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;

class Product extends Model
{
    use HasFactory;

    // Kolom-kolom yang dapat diisi secara massal
    protected $fillable = [
        'name',
        'slug',
        'description',
        'price',
        'stock',
        'jenis_barang',
        'img_url',
    ];

    // Casting untuk memastikan jenis data kolom
    protected $casts = [
        'price' => 'decimal:2', // Harga disimpan sebagai desimal dengan 2 angka di belakang koma
        'stock' => 'integer',   // Stok disimpan sebagai integer
        // 'jenis_barang' => 'string', // Opsional, jenis barang sudah string secara default
    ];

    /**
     * Accessor untuk mendapatkan URL penuh gambar produk.
     * Menggunakan konvensi get[NamaKolomCamelCase]Attribute.
     * Diakses melalui $product->img_url (meskipun kolomnya bernama img_url, Accessor menimpanya)
     * * @param string|null $value Nilai img_url yang tersimpan di database (misal: 'products/file.jpg')
     * @return string URL gambar yang siap diakses browser
     */
    public function getImgUrlAttribute(?string $value): string
    {
        // $this->attributes['img_url'] digunakan untuk mengakses nilai asli kolom dari database.
        if ($value && Storage::disk('public')->exists($value)) {
            // Mengembalikan URL penuh: http://app.test/storage/products/file.jpg
            return asset('storage/' . $value); 
        }

        // URL fallback jika tidak ada gambar atau gambar tidak ditemukan
        return asset('images/default_product.png'); 
    }
}