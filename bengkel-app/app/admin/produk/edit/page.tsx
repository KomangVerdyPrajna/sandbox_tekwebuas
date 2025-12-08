"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";

interface Product {
    id: number;
    name: string;
    price: number;
    description: string;
    img_url: string | null;
    jenis_barang: string;
    stock: number;
}

const productTypes = ["Sparepart", "Aksesoris"];

export default function EditProductPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const productId = searchParams.get("id");

    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);
    const [isUpdating, setIsUpdating] = useState(false);

    const [newImageFile, setNewImageFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);


    // ================= GET PRODUK (Mengisi Form) =================
    const fetchProduct = useCallback(async () => {
        if (!productId) {
            setLoading(false);
            return;
        }

        const token = localStorage.getItem("token");
        if (!token) {
            router.push('/auth/login');
            return;
        }

        try {
            // FIX: Menggunakan productId yang benar
            const res = await fetch(`http://localhost:8000/api/products/${productId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            const data = await res.json();
            
            if (res.ok && data.product) {
                setProduct(data.product); 
                
                // Pastikan URL gambar di-prefix dengan /storage
                const url = data.product.img_url ? `http://localhost:8000/storage/${data.product.img_url}` : "/no-image.png";
                setPreviewUrl(url);
            } else {
                setProduct(null); 
                if (res.status === 401 || res.status === 403) {
                     router.push('/auth/login');
                }
            }
        } catch (error) {
            console.error("Fetch Error:", error);
            // Tambahkan notifikasi jika GET gagal
            alert("Gagal memuat data produk. Periksa koneksi atau token.");
        } finally {
            setLoading(false);
        }
    }, [productId, router]);


    // ================= HANDLE CHANGE =================
    const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        if (product) {
            let value: string | number = e.target.value;
            const name = e.target.name;

            if (name === 'price' || name === 'stock') {
                value = Number(e.target.value);
            }

            setProduct({ ...product, [name]: value as any });
        }
    }, [product]);


    // ================= HANDLE UPLOAD =================
    const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (previewUrl && previewUrl.startsWith("blob:")) {
                 URL.revokeObjectURL(previewUrl);
            }

            setNewImageFile(file);
            setPreviewUrl(URL.createObjectURL(file));
        }
    };


    // ================= UPDATE PRODUK (POST + _method=PUT) =================
    async function updateProduct(e: React.FormEvent) {
        e.preventDefault();
        if (!product) return;

        setIsUpdating(true);
        const token = localStorage.getItem("token");
        
        if (!token) {
             alert("Sesi berakhir. Silakan login ulang.");
             router.push('/auth/login');
             setIsUpdating(false);
             return;
        }
        
        const form = new FormData();

        // Append data dari state 'product'
        form.append("name", product.name);
        form.append("price", product.price.toString());
        form.append("description", product.description);
        form.append("jenis_barang", product.jenis_barang);
        form.append("stock", product.stock.toString()); 
        
        // KRUSIAL: Method Spoofing untuk mengatasi 422 (data hilang pada PUT murni)
        form.append("_method", "PUT"); 

        if (newImageFile) {
            form.append("img_url", newImageFile); 
        }

        try {
            const res = await fetch(`http://localhost:8000/api/products/${productId}`, {
                method: "POST", // <-- HARUS POST untuk FormData
                headers: { 
                    Authorization: `Bearer ${token}`,
                    'Accept': 'application/json',
                },
                body: form,
            });

            const data = await res.json();

            if (!res.ok) {
                if (res.status === 422 && data.errors) {
                    const validationErrors = Object.values(data.errors).flat().join("\n");
                    alert("Validasi gagal:\n" + validationErrors);
                } else if (res.status === 401 || res.status === 403) {
                     alert("Akses ditolak. Silakan login ulang.");
                     localStorage.removeItem("token");
                     router.push('/login');
                } else {
                    console.error("Backend Error:", data);
                    alert("Update gagal. Status: " + res.status);
                }
                return;
            }

            // FIX CACHING: Paksa refresh agar data baru muncul
            alert("Produk berhasil diperbarui!");
            router.refresh(); 
            router.push("/admin/produk");
            
        } catch (err) {
            console.error("Network Error:", err);
            alert("Tidak dapat terhubung ke server.");
        } finally {
            setIsUpdating(false);
            if (previewUrl && previewUrl.startsWith("blob:")) {
                 URL.revokeObjectURL(previewUrl);
            }
        }
    }

    useEffect(() => { 
        fetchProduct(); 
    }, [fetchProduct]); 

    // -------------------------------------------------------------

    if (loading) return <p className="text-center mt-10">Memuat...</p>;
    if (!product) return <p className="text-center mt-10 text-red-500">Produk tidak ditemukan atau token kedaluwarsa.</p>;

    return (
        <div className="max-w-2xl mx-auto p-8 bg-white shadow-lg rounded-xl mt-10">
            <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">Edit Produk: {product.name}</h1>

            <form onSubmit={updateProduct} className="space-y-5">
                {/* Bagian Input Form */}
                {/* Nama */}
                <div>
                    <label className="block text-sm font-medium text-gray-700">Nama Produk</label>
                    <input
                        name="name" 
                        value={product.name ?? ""} 
                        onChange={handleChange}
                        className="w-full border p-2 rounded mt-1 focus:ring-blue-500 focus:border-blue-500"
                        required
                    />
                </div>

                {/* Harga */}
                <div>
                    <label className="block text-sm font-medium text-gray-700">Harga</label>
                    <input
                        name="price" 
                        type="number"
                        step="0.01"
                        value={product.price != null ? product.price.toString() : ""} 
                        onChange={handleChange}
                        className="w-full border p-2 rounded mt-1 focus:ring-blue-500 focus:border-blue-500"
                        required
                    />
                </div>

                {/* Stock */}
                <div>
                    <label className="block text-sm font-medium text-gray-700">Stok</label>
                    <input
                        name="stock" 
                        type="number"
                        value={product.stock != null ? product.stock.toString() : ""} 
                        onChange={handleChange}
                        className="w-full border p-2 rounded mt-1 focus:ring-blue-500 focus:border-blue-500"
                        required
                    />
                </div>

                {/* Jenis Barang */}
                <div>
                    <label className="block text-sm font-medium text-gray-700">Jenis Barang</label>
                    <select
                        name="jenis_barang" 
                        value={product.jenis_barang ?? ""} 
                        onChange={handleChange}
                        className="w-full border p-2 rounded mt-1 focus:ring-blue-500 focus:border-blue-500"
                        required
                    >
                        <option value="" disabled>Pilih jenis</option>
                        {productTypes.map((t) => (
                            <option key={t} value={t}>{t}</option>
                        ))}
                    </select>
                </div>

                {/* Deskripsi */}
                <div>
                    <label className="block text-sm font-medium text-gray-700">Deskripsi</label>
                    <textarea
                        name="description" 
                        value={product.description ?? ""} 
                        onChange={handleChange}
                        className="w-full border p-2 rounded mt-1 h-24 focus:ring-blue-500 focus:border-blue-500"
                        required
                    />
                </div>

                {/* Gambar */}
                <div className="flex gap-4 items-center border p-4 rounded-lg bg-gray-50">
                    <Image
                        src={previewUrl ?? "/no-image.png"} 
                        alt="Preview Produk"
                        width={100}
                        height={100}
                        className="rounded-lg shadow-md object-cover shrink-0"
                        unoptimized
                    />
                    <div className="grow">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Ganti Gambar</label>
                        <input type="file" name="img_url" accept="image/*" onChange={handleUpload} className="w-full text-sm text-gray-500"/>
                        <p className="text-xs text-gray-500 mt-1">Biarkan kosong jika tidak ingin mengganti gambar.</p>
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={isUpdating}
                    className="w-full bg-blue-600 text-white p-3 rounded hover:bg-blue-700 font-semibold transition duration-150 disabled:bg-gray-400"
                >
                    {isUpdating ? "Menyimpan Perubahan..." : "Simpan Perubahan"}
                </button>
            </form>
        </div>
    );
}