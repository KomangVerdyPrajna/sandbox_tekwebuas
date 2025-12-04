"use client";

import { useEffect, useState } from "react";
import { Star, ShoppingCart, ArrowLeft, MessageSquare } from "lucide-react";

interface Product {
  id: number;
  name: string;
  price: number;
  category: { name: string; slug: string };
  image_url: string;
}

export default function DetailProduk() {
  const [product, setProduct] = useState<Product | null>(null);

  useEffect(() => {
    const data = localStorage.getItem("selectedProduct");
    if (data) setProduct(JSON.parse(data));
  }, []);

  if (!product) return (
    <div className="text-center py-20 text-gray-600 text-lg">
      Produk tidak ditemukan ❗ <br />
      <a href="/marketplace" className="text-blue-600 underline">Kembali ke marketplace</a>
    </div>
  );

  const addToCart = () => {
    const saved = localStorage.getItem("cart");
    const cartItems: any[] = saved ? JSON.parse(saved) : [];

    const exist = cartItems.findIndex(p => p.id === product.id);

    let updated;
    if (exist > -1) {
      updated = cartItems.map((item,i)=>
        i === exist ? { ...item, qty:item.qty+1 } : item 
      );
    } else updated = [...cartItems,{...product,qty:1}];

    localStorage.setItem("cart", JSON.stringify(updated));
    alert("Produk berhasil ditambahkan ke keranjang!");
  };

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-8">

      {/* Back Button */}
      <button 
        onClick={()=>history.back()} 
        className="flex items-center gap-2 text-gray-700 hover:text-black mb-6">
        <ArrowLeft /> Kembali
      </button>

      <div className="grid md:grid-cols-2 gap-8">

        {/* Gambar Produk */}
        <div className="bg-white rounded-xl shadow p-4 flex justify-center">
          <img
            src={product.image_url}
            alt={product.name}
            className="w-full rounded-lg object-cover"
          />
        </div>

        {/* Informasi Produk */}
        <div className="space-y-4">
          <h1 className="text-3xl font-bold text-[#234C6A] leading-snug">{product.name}</h1>

          {/* Rating */}
          <div className="flex items-center gap-1 text-yellow-500">
            {[1,2,3,4,5].map(i => <Star key={i} size={22} fill="gold" stroke="gold" />)}
            <span className="text-gray-600 ml-2">4.9 (128 ulasan)</span>
          </div>

          <p className="text-3xl font-extrabold text-[#FF6D1F]">
            Rp {product.price.toLocaleString("id-ID")}
          </p>

          <p className="text-sm text-gray-500">
            Kategori: <span className="font-semibold">{product.category.name}</span>
          </p>

          {/* Tombol */}
          <div className="flex gap-4 pt-2">
            <button 
              onClick={addToCart}
              className="flex-1 bg-[#234C6A] hover:bg-[#1b3a52] text-white p-3 rounded-xl text-lg font-semibold flex items-center justify-center gap-2 shadow">
              <ShoppingCart size={22}/> Masukkan Keranjang
            </button>

            <button 
              className="flex-1 border-2 border-[#FF6D1F] text-[#FF6D1F] hover:bg-[#FF6D1F] hover:text-white p-3 rounded-xl text-lg font-bold transition">
              Beli Sekarang
            </button>
          </div>

        </div>
      </div>

      {/* Deskripsi produk */}
      <div className="mt-10 bg-white p-6 rounded-xl shadow">
        <h2 className="text-xl font-bold mb-3 text-[#234C6A]">Deskripsi Produk</h2>
        <p className="text-gray-600 leading-relaxed">
          Produk ini berkualitas premium, cocok digunakan untuk kebutuhan kendaraan Anda.
          Tahan lama, performa tinggi dan telah teruji oleh banyak pengguna.  
          <br/> <br/>
          Detail lain bisa kamu tambahkan manual atau ambil dari database nanti.
        </p>
      </div>

      {/* Ulasan produk */}
      <div className="mt-10 bg-white p-6 rounded-xl shadow space-y-4">
        <h2 className="text-xl font-bold text-[#234C6A] flex items-center gap-2">
          <MessageSquare size={22}/> Ulasan Pembeli
        </h2>

        {/* Dummy Review */}
        {[1,2,3].map((i)=>(
          <div key={i} className="border-b pb-3">
            <p className="font-semibold text-gray-700">Pengguna {i}</p>
            <div className="flex text-yellow-500 mb-1">
              {Array(5).fill("").map((_,i)=><Star key={i} size={18} fill="gold" stroke="gold"/>)}
            </div>
            <p className="text-gray-600 text-sm">
              Barang bagus, pengiriman cepat, harga sesuai! Mantap transaksi di sini 👍
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
