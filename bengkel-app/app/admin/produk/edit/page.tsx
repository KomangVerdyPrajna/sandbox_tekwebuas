// app/admin/produk/edit/[id]/page.tsx (Jika menggunakan Dynamic Route)
// ATAU app/admin/produk/edit/page.tsx (Jika menggunakan Search Params)

"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from 'next/image'; // 🔥 Gunakan Next/Image untuk performa terbaik

interface Product {
  id: number;
  name: string;
  price: number;
  description: string;
  img_url: string | null;
}

// Interface untuk menampung preview gambar baru
interface ImagePreview {
    url: string;
    objectUrl: string; // URL object untuk dibersihkan
}

export default function EditProductPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Pastikan Anda menggunakan useParams() jika folder Anda [id]
  // Jika Anda menggunakan searchParams, ID harus ada di URL, cth: /edit?id=1
  const productId = searchParams.get("id"); 

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  
  const [newImageFile, setNewImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<ImagePreview | null>(null);

  // ================= GET DETAIL PRODUK =================
  async function fetchProduct() {
    if (!productId) {
      setLoading(false);
      return;
    }

    try {
      const token = localStorage.getItem("token");

      const res = await fetch(`http://localhost:8000/api/products/${productId}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });

      const data = await res.json();

      if (!data.product) {
        alert("Produk tidak ditemukan");
        router.push("/admin/produk");
        return;
      }

      setProduct(data.product);
    } catch (err) {
      alert("Gagal memuat detail produk");
    } finally {
      setLoading(false);
    }
  }

  // ================= UPDATE PRODUK =================
  async function updateProduct(e: React.FormEvent) {
    e.preventDefault();

    if (!product || !productId) return;
    setIsUpdating(true);

    const token = localStorage.getItem("token");

    const formData = new FormData();
    formData.append("name", product.name);
    formData.append("price", String(product.price));
    formData.append("description", product.description);

    if (newImageFile) {
        formData.append("img_url", newImageFile);
    }

    // Menggunakan POST dengan _method=PUT untuk FormData di Laravel
    formData.append("_method", "PUT"); 

    try {
      const res = await fetch(`http://localhost:8000/api/products/${productId}`, {
        method: "POST", // Method harus POST untuk FormData dengan _method=PUT
        headers: {
          Authorization: `Bearer ${token}`,
          // Tidak perlu set Content-Type: multipart/form-data untuk FormData
        },
        body: formData,
      });

      if (!res.ok) throw new Error("Update gagal");

      alert("Produk berhasil diperbarui");
      router.push("/admin/produk");
    } catch (error) {
      console.error(error);
      alert("Gagal memperbarui produk. Cek console log.");
    } finally {
        setIsUpdating(false);
    }
  }

  // ================= HANDLER GAMBAR =================
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    
    // Clean up URL object lama jika ada
    if (imagePreview && imagePreview.objectUrl.startsWith("blob:")) {
        URL.revokeObjectURL(imagePreview.objectUrl);
    }

    setNewImageFile(file);

    if (file) {
        const objectUrl = URL.createObjectURL(file);
        setImagePreview({ 
            url: objectUrl,
            objectUrl: objectUrl 
        });
    } else {
        setImagePreview(null);
    }
  };

  const getImage = (img: string | null) =>
    img ? `http://localhost:8000/storage/products/${img}` : "/no-image.png";

  useEffect(() => {
    fetchProduct();
    // Cleanup URL object saat komponen di-unmount
    return () => {
        if (imagePreview && imagePreview.objectUrl.startsWith("blob:")) {
            URL.revokeObjectURL(imagePreview.objectUrl);
        }
    };
  }, [productId]);


  // ================= TAMPILAN LOADING/ERROR =================
  if (loading) return (
    <div className="flex justify-center items-center h-48">
        <p className="text-xl text-gray-600 animate-pulse">
            <span role="img" aria-label="loading">⏳</span> Memuat detail produk...
        </p>
    </div>
  );
  if (!product) return (
    <div className="text-center p-8 bg-red-100 border border-red-400 text-red-700 rounded-lg max-w-xl mx-auto mt-8">
        <p className="font-bold">Error 404</p>
        <p>Produk tidak ditemukan atau ID tidak valid.</p>
        <button
            onClick={() => router.push("/admin/produk")}
            className="mt-3 text-sm text-blue-600 hover:text-blue-800 underline"
        >
            Kembali ke Daftar Produk
        </button>
    </div>
  );

  // ================= TAMPILAN UTAMA =================
  const currentDisplayedImage = imagePreview ? imagePreview.url : getImage(product.img_url);

  return (
    <div className="min-h-screen bg-gray-50 flex justify-center py-10">
      <div className="bg-white p-8 rounded-2xl shadow-2xl max-w-2xl w-full transition duration-300 transform hover:shadow-3xl">
        <h1 className="text-3xl font-extrabold text-gray-800 mb-2 border-b pb-2">
          📝 Edit Produk: <span className="text-blue-600">{product.name}</span>
        </h1>
        <p className="text-gray-500 mb-6">Perbarui informasi produk dan gambar di bawah ini.</p>

        <form onSubmit={updateProduct} className="space-y-6">

          {/* Nama Produk */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Nama Produk
            </label>
            <input
              id="name"
              type="text"
              value={product.name}
              onChange={(e) => setProduct({ ...product, name: e.target.value })}
              className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150 shadow-sm"
              required
            />
          </div>

          {/* Harga */}
          <div>
            <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
              Harga (Rp)
            </label>
            <input
              id="price"
              type="number"
              min="0"
              // Pastikan nilai ditampilkan sebagai string untuk input type="number"
              value={product.price.toString()} 
              onChange={(e) =>
                setProduct({ ...product, price: Number(e.target.value) })
              }
              className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150 shadow-sm"
              required
            />
          </div>

          {/* Deskripsi */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
              Deskripsi
            </label>
            <textarea
              id="description"
              value={product.description}
              onChange={(e) =>
                setProduct({ ...product, description: e.target.value })
              }
              className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150 shadow-sm"
              rows={4}
              required
            />
          </div>
          
          {/* Gambar Produk */}
          <div className="flex flex-col md:flex-row md:space-x-6">
            
            {/* Tampilan Gambar Saat Ini / Preview */}
            <div className="md:w-1/3 mb-4 md:mb-0">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Gambar
                </label>
                <div className="relative w-32 h-32 border-4 border-gray-200 rounded-xl overflow-hidden shadow-md">
                    {/* Menggunakan Image dari next/image */}
                    <Image
                        src={currentDisplayedImage}
                        alt="Foto produk"
                        layout="fill"
                        objectFit="cover"
                        unoptimized={currentDisplayedImage.startsWith('http://localhost') || currentDisplayedImage.startsWith('blob:')}
                    />
                </div>
                <p className="mt-2 text-xs text-gray-500">
                    {imagePreview ? 'Preview Gambar Baru' : 'Gambar Saat Ini'}
                </p>
            </div>

            {/* Input File */}
            <div className="md:w-2/3">
                <label htmlFor="file-upload" className="block text-sm font-medium text-gray-700 mb-1">
                    Ganti Gambar (Opsional)
                </label>
                <input
                    id="file-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="block w-full text-sm text-gray-500
                        file:mr-4 file:py-2 file:px-4
                        file:rounded-full file:border-0
                        file:text-sm file:font-semibold
                        file:bg-blue-50 file:text-blue-700
                        hover:file:bg-blue-100"
                />
            </div>
          </div>
          
          {/* Aksi Button */}
          <div className="flex justify-end space-x-4 pt-4 border-t border-gray-100">
            <button
                type="button"
                onClick={() => router.push("/admin/produk")}
                className="px-6 py-2 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-100 transition duration-150 font-medium"
            >
                Batal
            </button>
            <button
              type="submit"
              disabled={isUpdating}
              className={`px-6 py-2 rounded-lg text-white font-semibold transition duration-200 shadow-md ${
                isUpdating 
                    ? "bg-blue-400 cursor-not-allowed" 
                    : "bg-blue-600 hover:bg-blue-700 hover:shadow-lg"
              }`}
            >
              {isUpdating ? (
                <>
                    <span className="animate-spin inline-block mr-2">⚙️</span> 
                    Menyimpan...
                </>
              ) : (
                "Simpan Perubahan"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}