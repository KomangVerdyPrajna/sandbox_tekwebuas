"use client";

import type React from "react";
import { useEffect, useState } from "react";
import {
  ShoppingCart,
  Search,
  Wrench,
  Shirt,
  PlusCircle,
  AlertTriangle,
  Package,
} from "lucide-react";

// ===============================
// TIPE DATA PRODUK
// ===============================
interface Product {
  id: number;
  name: string;
  price: number;
  category: { name: string; slug: string };
  image_url: string;

  // Field terkait promo
  isPromo?: boolean;
  discountPercent?: number;
  promoTag?: string;
  promoSubtitle?: string;
  promoImageUrl?: string;
}

// ===============================
// Fungsi Add Cart (Simulasi localStorage)
// ===============================
const addToCart = (product: Product, updateCount: () => void) => {
  const saved = localStorage.getItem("cart");
  const cartItems = saved ? JSON.parse(saved) : [];

  const exist = cartItems.findIndex((i: any) => i.id === product.id);

  if (exist >= 0) cartItems[exist].qty++;
  else cartItems.push({ ...product, qty: 1, isSelected: true });

  localStorage.setItem("cart", JSON.stringify(cartItems));

  if (typeof window !== "undefined") {
    const messageBox = document.getElementById("message-box");
    if (messageBox) {
      messageBox.innerHTML = `<div class="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative" role="alert">
                <strong class="font-bold">Sukses!</strong>
                <span class="block sm:inline"> ${product.name} ditambahkan ke keranjang.</span>
            </div>`;
      messageBox.style.display = "block";
      setTimeout(() => {
        messageBox.style.display = "none";
      }, 2000);
    }
  }

  updateCount();
};

// ===============================
// TIPE PROPS UNTUK PRODUCT CARD
// ===============================
interface ProductCardProps {
  product: Product;
  addToCart: Function;
  getCategoryIcon: Function;
  updateCartCount: () => void;
  onProductClick: (product: Product) => void;
  isHighlighted: boolean;
}

// ===============================
// KOMPONEN LOKAL: ProductCard
// ===============================
const ProductCardComponent = ({
  product,
  addToCart,
  getCategoryIcon,
  updateCartCount,
  onProductClick,
  isHighlighted,
}: ProductCardProps) => {
  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, updateCartCount);
  };

  const handleCardClick = (e: React.MouseEvent) => {
    const targetElement = e.target as Element;
    if (targetElement.closest("button")) {
      return;
    }
    onProductClick(product);
  };

  return (
    <div
      id={`product-${product.id}`} // target scroll promo
      key={product.id}
      onClick={handleCardClick}
      className={`group bg-white rounded-xl shadow-lg border border-gray-200 
                hover:shadow-xl hover:border-[#FF6D1F] transition duration-300 overflow-hidden relative cursor-pointer
                ${isHighlighted ? "ring-4 ring-[#FF6D1F]" : ""}`}
    >
      <div className="block">
        <img
          src={product.image_url}
          alt={product.name}
          className="w-full h-44 object-cover transition duration-300 group-hover:scale-[1.03]"
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src =
              "https://placehold.co/176x176/cccccc/333333?text=Gambar+Produk";
          }}
        />
      </div>

      <div className="p-4 flex flex-col justify-between h-36">
        <div>
          <h2 className="font-bold text-lg text-[#234C6A] line-clamp-2 leading-snug">
            {product.name}
          </h2>

          <p className="text-xs text-gray-500 capitalize mt-1">
            {getCategoryIcon(product.category.slug)}
            {product.category.name}
          </p>
        </div>

        <div className="flex justify-between items-end pt-2">
          <p className="text-[#FF6D1F] font-extrabold text-xl">
            Rp {product.price.toLocaleString("id-ID")}
          </p>

          <button
            onClick={handleAdd}
            className="bg-[#234C6A] text-white p-2 rounded-full hover:bg-[#1A374A] transition transform hover:scale-105"
            title="Tambahkan ke Keranjang"
          >
            <PlusCircle size={24} />
          </button>
        </div>
      </div>
    </div>
  );
};

// ===============================
// KOMPONEN UTAMA MARKETPLACE
// ===============================
export default function MarketplacePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [cartCount, setCartCount] = useState(0);
  const [currentPromoIndex, setCurrentPromoIndex] = useState(0);
  const [hasLatestOrder, setHasLatestOrder] = useState(false);
  const [highlightedProductId, setHighlightedProductId] = useState<
    number | null
  >(null);

  // ================== Dummy Produk (sekarang dengan info promo) ==================
  const dummyData: Product[] = [
    {
      id: 1,
      name: "Oli Mesin Yamalube Power Matic",
      price: 35000,
      category: { name: "Suku Cadang", slug: "suku-cadang" },
      image_url:
        "https://placehold.co/700x700/234C6A/FFFFFF/png?text=Oli+Mesin",
      isPromo: true,
      discountPercent: 30,
      promoTag: "Promo Spesial",
      promoSubtitle: "Hemat besar untuk servis berkala motor kamu.",
      promoImageUrl:
        "https://images.pexels.com/photos/4489732/pexels-photo-4489732.jpeg?auto=compress&cs=tinysrgb&w=1200",
    },
    {
      id: 2,
      name: "Kampas Rem Cakram Depan Motor",
      price: 26000,
      category: { name: "Suku Cadang", slug: "suku-cadang" },
      image_url:
        "https://placehold.co/700x700/FF6D1F/FFFFFF/png?text=Kampas+Rem",
      isPromo: true,
      discountPercent: 15,
      promoTag: "Produk Baru",
      promoSubtitle: "Kampas lebih pakem, aman di jalan.",
      // promoImageUrl bisa kosong → pakai image_url
    },
    {
      id: 3,
      name: "Sarung Tangan Full Finger Racing",
      price: 45000,
      category: { name: "Aksesoris", slug: "aksesoris" },
      image_url:
        "https://placehold.co/700x700/234C6A/FFFFFF/png?text=Sarung+Tangan",
      // tidak promo
    },
    {
      id: 4,
      name: "Helm Bogo Retro Classic",
      price: 160000,
      category: { name: "Aksesoris", slug: "aksesoris" },
      image_url:
        "https://placehold.co/700x700/FF6D1F/FFFFFF/png?text=Helm+Bogo",
      // tidak promo
    },
  ];

  const updateCartCount = () => {
    const saved = localStorage.getItem("cart");
    if (saved) setCartCount(JSON.parse(saved).length);
  };

  const handleProductClick = (product: Product) => {
    localStorage.setItem("selectedProduct", JSON.stringify(product));
    window.location.href = `/marketplace/detailProduk`;
  };

  useEffect(() => {
    setProducts(dummyData);
    updateCartCount();

    if (localStorage.getItem("latestOrder")) {
      setHasLatestOrder(true);
    }
  }, []);

  // ================== Bikin daftar promo otomatis dari products ==================
  const promoBanners = products
    .filter((p) => p.isPromo)
    .map((p) => ({
      productId: p.id,
      title: p.discountPercent
        ? `Diskon ${p.discountPercent}% ${p.name}`
        : p.name,
      subtitle:
        p.promoSubtitle ?? "Dapatkan penawaran menarik untuk produk ini.",
      tag: p.promoTag ?? "Promo",
      imageUrl: p.promoImageUrl ?? p.image_url,
    }));

  // Auto slide promo tiap 5 detik (kalau ada promo)
  useEffect(() => {
    if (promoBanners.length === 0) return;

    const interval = setInterval(() => {
      setCurrentPromoIndex(
        (prevIndex) => (prevIndex + 1) % promoBanners.length
      );
    }, 5000);

    return () => clearInterval(interval);
  }, [promoBanners.length]);

  const filtered = products.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) &&
      (filter === "all" ? true : p.category.slug === filter)
  );

  const getCategoryIcon = (slug: string) => {
    switch (slug) {
      case "suku-cadang":
        return <Wrench size={16} className="inline mr-1 text-gray-500" />;
      case "aksesoris":
        return <Shirt size={16} className="inline mr-1 text-gray-500" />;
      default:
        return null;
    }
  };

  const currentPromo =
    promoBanners.length > 0 ? promoBanners[currentPromoIndex] : null;

  // =============== SCROLL KE PRODUK YANG DIPROMO ===============
  const handleSeeNow = () => {
    if (!currentPromo) return;

    const productId = currentPromo.productId;
    const el = document.getElementById(`product-${productId}`);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "center" });

      setHighlightedProductId(productId);
      setTimeout(() => {
        setHighlightedProductId((prev) => (prev === productId ? null : prev));
      }, 2000);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 md:px-0">
      <div id="message-box" className="fixed top-4 right-4 z-50 hidden"></div>

      <div className="max-w-6xl mx-auto space-y-8">
        {/* ==================== Title + Cart + Order Button ==================== */}
        <div className="flex items-center justify-between border-b pb-4">
          <h1 className="text-4xl font-extrabold text-[#234C6A]">
            Marketplace Produk 🛒
          </h1>

          <div className="flex items-center gap-4">
            {hasLatestOrder && (
              <a
                href="/marketplace/pesanan"
                className="flex items-center gap-2 bg-[#234C6A] text-white p-3 rounded-full text-sm font-semibold 
                                            hover:bg-[#FF6D1F] transition transform hover:scale-105 shadow-md"
                title="Lihat Status Pesanan Terakhir Anda"
              >
                <Package size={20} /> Pesanan Saya
              </a>
            )}

            <a
              href="/cart"
              className="relative p-2 rounded-full hover:bg-gray-100 transition"
            >
              <ShoppingCart
                size={32}
                color="#FF6D1F"
                className="cursor-pointer hover:scale-105 transition"
              />

              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-600 text-white text-sm font-bold rounded-full w-6 h-6 flex items-center justify-center border-2 border-white">
                  {cartCount}
                </span>
              )}
            </a>
          </div>
        </div>

        {/* ==================== PROMO / BERITA SLIDER DENGAN FOTO ==================== */}
        {currentPromo && (
          <div className="rounded-2xl shadow-xl overflow-hidden relative group cursor-pointer">
            {/* Foto utama */}
            <img
              src={currentPromo.imageUrl}
              alt={currentPromo.title}
              className="w-full h-40 md:h-56 lg:h-64 object-cover transition-transform duration-500 group-hover:scale-[1.03]"
            />

            {/* Overlay gelap biar teks kebaca */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-transparent" />

            {/* Konten teks di atas foto */}
            <div className="absolute inset-0 flex items-center justify-between px-6 md:px-10">
              <div className="text-white max-w-xl">
                {currentPromo.tag && (
                  <span className="inline-block text-xs font-semibold tracking-wide bg-white/20 px-3 py-1 rounded-full mb-2 backdrop-blur-sm">
                    {currentPromo.tag}
                  </span>
                )}
                <h2 className="text-2xl md:text-3xl font-extrabold leading-snug">
                  {currentPromo.title}
                </h2>
                <p className="text-sm md:text-base mt-1 text-gray-100/80">
                  {currentPromo.subtitle}
                </p>
              </div>

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleSeeNow();
                }}
                className="hidden sm:inline-flex text-sm md:text-base font-semibold text-white border border-white/70 px-4 py-2 rounded-full hover:bg-white/10 transition"
              >
                Lihat Sekarang →
              </button>
            </div>

            {/* Indikator Carousel */}
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
              {promoBanners.map((_, index) => (
                <button
                  key={index}
                  className={`w-2.5 h-2.5 rounded-full transition-all ${
                    index === currentPromoIndex
                      ? "bg-white"
                      : "bg-white/50 hover:bg-white/80"
                  }`}
                  onClick={(e) => {
                    e.stopPropagation();
                    setCurrentPromoIndex(index);
                  }}
                />
              ))}
            </div>
          </div>
        )}

        {/* ==================== Search + Filter ==================== */}
        <div className="flex flex-col sm:flex-row items-center gap-4 w-full bg-white p-4 rounded-xl shadow-md border border-gray-100">
          <div className="flex items-center border border-gray-300 rounded-full px-4 py-2 w-full sm:w-2/3 shadow-inner">
            <Search size={20} className="text-[#234C6A] mr-2 shrink-0" />
            <input
              type="text"
              placeholder="Cari nama produk: oli, kampas, helm, dll."
              className="grow outline-none text-gray-800 placeholder-gray-500 text-base"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="border-2 border-gray-300 p-2.5 rounded-full shadow-sm cursor-pointer text-gray-700 font-medium transition w-full sm:w-1/3 appearance-none bg-white"
          >
            <option value="all">Semua Kategori</option>
            <option value="suku-cadang">Suku Cadang</option>
            <option value="aksesoris">Aksesoris</option>
          </select>
        </div>

        {/* ================= Grid Produk ================= */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filtered.length === 0 && (
            <p className="text-center col-span-full text-gray-600 py-10 bg-white rounded-xl shadow border border-gray-200">
              <AlertTriangle size={24} className="inline mr-2 text-red-500" />
              Produk tidak ditemukan. Coba kata kunci atau filter lain.
            </p>
          )}

          {filtered.map((p) => (
            <ProductCardComponent
              key={p.id}
              product={p}
              addToCart={addToCart}
              getCategoryIcon={getCategoryIcon}
              updateCartCount={updateCartCount}
              onProductClick={handleProductClick}
              isHighlighted={highlightedProductId === p.id}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
