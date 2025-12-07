"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface Category {
  id: number;
  name: string;
}

export default function CreateProductPage() {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [imageFile, setImageFile] = useState<File | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    category_id: "",
  });

  // ================= FETCH CATEGORY =====================
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await fetch("http://localhost:8000/api/categories", {
          headers: { 
            Authorization: `Bearer ${token}`,
            Accept: "application/json"
          }
        });

        const data = await res.json();
        console.log("Kategori:", data);

        setCategories(data.categories || []);

      } catch {
        alert("Gagal memuat kategori! Pastikan server Laravel berjalan!");
      }
    };

    fetchCategories();
  }, []);

  // Handle input
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) setImageFile(e.target.files[0]);
  };

  // ================= SAVE PRODUCT =====================
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (!imageFile) return alert("Gambar wajib di-upload!");

    const token = localStorage.getItem("token");

    const payload = new FormData();
    payload.append("name", formData.name);
    payload.append("description", formData.description);
    payload.append("price", formData.price);
    payload.append("stock", formData.stock);
    payload.append("category_id", formData.category_id);
    payload.append("img_url", imageFile); // ← FILE IMAGE dikirim ke backend

    try {
      const res = await fetch("http://localhost:8000/api/products", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: payload 
      });

      const data = await res.json();
      console.log(data);

      if (!res.ok) {
        alert("Gagal membuat produk. Periksa kembali input!");
        return;
      }

      alert("Produk berhasil dibuat!");
      router.push("/admin/produk");
    } catch {
      alert("Terjadi kesalahan server!");
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="min-h-screen p-6 bg-gray-100">
      <div className="max-w-xl mx-auto bg-white rounded-xl shadow p-6">
        <h1 className="text-2xl font-bold mb-4">Tambah Produk Baru</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          
          <div>
            <label className="block text-sm font-medium mb-1">Nama Produk</label>
            <input
              type="text"
              name="name"
              required
              value={formData.name}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
              placeholder="Contoh: Oli Motor"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Deskripsi</label>
            <textarea
              name="description"
              required
              value={formData.description}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2 h-28"
              placeholder="Masukkan deskripsi produk..."
            ></textarea>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Harga</label>
            <input
              type="number"
              name="price"
              required
              value={formData.price}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
              placeholder="150000"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Stock</label>
            <input
              type="number"
              name="stock"
              required
              value={formData.stock}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
              placeholder="10"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Kategori Produk</label>
            <select
              name="category_id"
              required
              value={formData.category_id}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
            >
              <option value="">-- Pilih Kategori --</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Upload Gambar</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="w-full border rounded px-3 py-2"
              required
            />
            {imageFile && <img src={URL.createObjectURL(imageFile)} className="w-32 h-32 object-cover mt-3 rounded" />}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-800 transition disabled:bg-gray-400"
          >
            {loading ? "Menyimpan..." : "Simpan Produk"}
          </button>
        </form>

      </div>
    </div>
  );
}
