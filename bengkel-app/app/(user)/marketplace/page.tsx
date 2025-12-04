"use client";

import { useEffect, useState } from "react";
import { ShoppingCart, Search, Wrench, Shirt } from "lucide-react";
import ProductCard from "@/components/user/ProductCard";

// ================= Tipe Produk =================
interface Product {
  id: number;
  name: string;
  price: number;
  category: { name: string; slug: string };
  image_url: string;
}

// ================= Fungsi Add Cart =================
const addToCart = (product: Product) => {
  const saved = localStorage.getItem("cart");
  const cartItems = saved ? JSON.parse(saved) : [];

  const exist = cartItems.findIndex((i: any) => i.id === product.id);

  if (exist >= 0) cartItems[exist].qty++;
  else cartItems.push({ ...product, qty: 1 });

  localStorage.setItem("cart", JSON.stringify(cartItems));
  alert(`${product.name} ditambahkan ke keranjang!`);
  
  return cartItems.length;
};

export default function MarketplacePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [cartCount, setCartCount] = useState(0);

  // =============== Dummy Produk ===============
  const dummyData: Product[] = [
    { id: 1, name: "Oli Mesin Yamalube Power Matic", price: 35000, category:{name:"Suku Cadang",slug:"suku-cadang"}, image_url:"https://images.tokopedia.net/img/cache/700/VqbcmM/2022/5/26/9b2e0d19-698e-48fd-a1c1-d257a7b82d49.jpg" },
    { id: 2, name: "Kampas Rem Cakram Depan Motor", price: 26000, category:{name:"Suku Cadang",slug:"suku-cadang"}, image_url:"https://images.tokopedia.net/img/cache/700/VqbcmM/2023/7/3/4f497c6e-c7db-4cd0-b74f-65a97b93cf9f.jpg" },
    { id: 3, name: "Sarung Tangan Full Finger Racing", price: 45000, category:{name:"Aksesoris",slug:"aksesoris"}, image_url:"https://images.tokopedia.net/img/cache/700/VqbcmM/2021/12/3/260b4b8d-0777-4dec-abc6-1fa5321f9086.jpg" },
    { id: 4, name: "Helm Bogo Retro Classic", price: 160000, category:{name:"Aksesoris",slug:"aksesoris"}, image_url:"https://images.tokopedia.net/img/cache/700/VqbcmM/2020/6/1/8c1ff99a-913f-44e8-b8d3-8ab616c3e2e6.jpg" },
  ];

  useEffect(() => {
    setProducts(dummyData);
    const saved = localStorage.getItem("cart");
    if (saved) setCartCount(JSON.parse(saved).length);
  }, []);

  // ============ Filter Search ============
  const filtered = products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) &&
    (filter === "all" ? true : p.category.slug === filter)
  );

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-6xl mx-auto space-y-8">

        {/* ================= Title + Cart ================= */}
        <div className="flex items-center justify-between border-b pb-4">
          <h1 className="text-4xl font-extrabold text-[#234C6A]">Marketplace Produk</h1>

          <a href="/cart" className="relative p-2 rounded-full hover:bg-gray-200 transition">
            <ShoppingCart size={32} color="#FF6D1F" />

            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </a>
        </div>

        {/* ================= Search + Filter ================= */}
        <div className="flex flex-col sm:flex-row gap-4 bg-white p-4 rounded-xl shadow border">

          <div className="flex items-center border px-4 py-2 rounded-full w-full sm:w-2/3">
            <Search className="text-[#234C6A] mr-2" />
            <input
              type="text"
              placeholder="Cari produk..."
              className="w-full outline-none"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>

          <select
            value={filter}
            onChange={e => setFilter(e.target.value)}
            className="border p-2 rounded-full w-full sm:w-1/3"
          >
            <option value="all">Semua</option>
            <option value="suku-cadang">Suku Cadang</option>
            <option value="aksesoris">Aksesoris</option>
          </select>
        </div>

        {/* ================= Grid Produk ================= */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">

          {filtered.length === 0 && (
            <p className="text-center col-span-full text-gray-500 py-10 bg-white rounded-xl shadow">
              Produk tidak ditemukan.
            </p>
          )}

          {filtered.map(p => (
            <ProductCard key={p.id} product={p} addToCart={addToCart} />
          ))}

        </div>
      </div>
    </div>
  );
}
