"use client";

import { useEffect, useState } from "react";
import {
  Star,
  ShoppingCart,
  ArrowLeft,
  MessageSquare,
  Tag,
  Info,
  ShieldCheck,
  Truck,
  Clock,
  Zap,
} from "lucide-react";

// ===============================
// HELPER DISKON – sama persis dengan di marketplace
// ===============================
function getPriceInfo(product: {
  price: number;
  isPromo?: boolean;
  discountPercent?: number;
}) {
  const hasDiscount =
    product.isPromo && !!product.discountPercent && product.discountPercent > 0;

  const originalPrice = product.price;
  const finalPrice = hasDiscount
    ? Math.round(
        product.price * (1 - (product.discountPercent as number) / 100)
      )
    : product.price;

  return { hasDiscount, originalPrice, finalPrice };
}

interface Product {
  id: number;
  name: string;
  price: number; // harga normal
  category: { name: string; slug: string };
  image_url: string;

  isPromo?: boolean;
  discountPercent?: number;
}

// Tambahkan fungsi simulasi addToCart di sini juga
const addToCart = (product: Product) => {
  const saved = localStorage.getItem("cart");
  const cartItems: any[] = saved ? JSON.parse(saved) : [];

  const exist = cartItems.findIndex((p) => p.id === product.id);

  let updated;
  if (exist > -1) {
    updated = cartItems.map((item, i) =>
      i === exist ? { ...item, qty: item.qty + 1 } : item
    );
  } else updated = [...cartItems, { ...product, qty: 1, isSelected: true }];

  localStorage.setItem("cart", JSON.stringify(updated));

  if (typeof window !== "undefined") {
    const messageBox = document.getElementById("message-box");
    if (messageBox) {
      messageBox.innerHTML = `<div class="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg relative transition-all duration-300" role="alert">
                <strong class="font-extrabold">✅ Ditambahkan!</strong>
                <span class="block sm:inline"> ${product.name} berhasil masuk ke keranjang.</span>
            </div>`;
      messageBox.style.display = "block";
      setTimeout(() => {
        messageBox.style.display = "none";
      }, 2000);
    }
  }
};

// ===============================
// Komponen Highlight Fitur
// ===============================
const FeatureHighlight = ({
  icon: Icon,
  title,
  description,
}: {
  icon: any;
  title: string;
  description: string;
}) => (
  <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
    <Icon size={24} className="text-[#234C6A] mt-1 shrink-0" />
    <div>
      <p className="font-semibold text-sm text-[#234C6A]">{title}</p>
      <p className="text-xs text-gray-500">{description}</p>
    </div>
  </div>
);

// ===============================
// Komponen Ulasan Produk
// ===============================
const ReviewCard = ({
  name,
  rating,
  comment,
}: {
  name: string;
  rating: number;
  comment: string;
}) => (
  <div className="p-4 bg-white border border-gray-100 rounded-lg shadow-sm">
    <div className="flex justify-between items-center mb-2">
      <p className="font-bold text-gray-800">{name}</p>
      <div className="flex text-yellow-500">
        {Array(rating)
          .fill("")
          .map((_, idx) => (
            <Star key={idx} size={18} fill="gold" stroke="gold" />
          ))}
        {Array(5 - rating)
          .fill("")
          .map((_, idx) => (
            <Star key={idx} size={18} fill="none" stroke="gold" />
          ))}
      </div>
    </div>
    <p className="text-gray-600 text-sm italic leading-snug">"{comment}"</p>
  </div>
);

// ===============================
// KOMPONEN UTAMA
// ===============================
export default function ProductDetailPage() {
  const [product, setProduct] = useState<
    (Product & { description: string }) | null
  >(null);
  const [loading, setLoading] = useState(true);

  const dummyReviews = [
    {
      name: "Pengguna A",
      rating: 5,
      comment:
        "Barang bagus, pengiriman cepat, harga sesuai! Mantap transaksi di sini 👍",
    },
    {
      name: "Siti K.",
      rating: 4,
      comment:
        "Oli sangat cocok untuk motor matic saya. Sayang pengiriman agak lambat.",
    },
    {
      name: "Bambang M.",
      rating: 5,
      comment:
        "Helmnya keren dan nyaman dipakai. Benar-benar sesuai deskripsi!",
    },
  ];

  const productFeatures = [
    {
      icon: ShieldCheck,
      title: "Garansi Resmi",
      description: "100% Produk Original",
    },
    {
      icon: Truck,
      title: "Gratis Ongkir*",
      description: "Min. Belanja Rp 100K",
    },
    { icon: Zap, title: "Ready Stok", description: "Siap Kirim Hari Ini" },
  ];

  useEffect(() => {
    const data = localStorage.getItem("selectedProduct");
    if (data) {
      const parsedProduct = JSON.parse(data);
      setProduct({
        ...parsedProduct,
        description: `Produk ini berkualitas premium, cocok digunakan untuk kebutuhan kendaraan Anda. Tahan lama, performa tinggi, dan telah teruji oleh banyak pengguna. Jaminan kualitas dan keaslian 100%.

Detail Teknis:
- Bahan: Komponen Sintetis Pilihan
- Berat: 1 Liter
- Kompatibilitas: Semua motor matic/non-matic (tergantung produk)
- Sertifikasi: SNI & ISO 9001:2015

Selalu pastikan produk yang Anda beli sesuai dengan spesifikasi kendaraan Anda. Detail teknis lebih lanjut dapat dilihat pada kemasan produk.`,
      });
    }
    setLoading(false);
  }, []);

  if (loading)
    return (
      <div className="text-center py-20 text-[#234C6A] text-xl font-semibold">
        Memuat Detail Produk...
      </div>
    );

  if (!product)
    return (
      <div className="text-center py-20 px-4 md:px-8">
        <div className="bg-white p-8 rounded-xl shadow-lg max-w-lg mx-auto">
          <p className="text-gray-600 text-lg">Produk tidak ditemukan ❗</p>
          <a
            href="/marketplace"
            className="mt-4 inline-flex items-center text-[#FF6D1F] underline hover:text-[#234C6A] transition"
          >
            <ArrowLeft size={18} className="mr-1" /> Kembali ke marketplace
          </a>
        </div>
      </div>
    );

  const { hasDiscount, originalPrice, finalPrice } = getPriceInfo(product);

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 md:px-8">
      <div
        id="message-box"
        className="fixed top-4 right-4 z-50 transition-all duration-300 hidden"
      />

      <div className="max-w-6xl mx-auto">
        {/* Back Button */}
        <button
          onClick={() => history.back()}
          className="flex items-center gap-2 text-[#234C6A] font-bold hover:text-[#FF6D1F] transition mb-8 group"
        >
          <ArrowLeft
            size={24}
            className="group-hover:-translate-x-1 transition"
          />
          Kembali ke Marketplace
        </button>

        {/* HERO */}
        <div className="grid md:grid-cols-12 gap-10 bg-white p-8 lg:p-12 rounded-3xl shadow-[0_15px_30px_-15px_rgba(0,0,0,0.1)] border border-gray-100">
          {/* Gambar */}
          <div className="md:col-span-5 p-6 bg-gray-100 rounded-2xl flex justify-center items-center shadow-lg sticky top-5 h-fit">
            <img
              src={product.image_url}
              alt={product.name}
              className="w-full max-h-[500px] object-contain rounded-xl transform hover:scale-[1.03] transition duration-500"
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src =
                  "https://placehold.co/500x500/cccccc/333333?text=GAMBAR+PRODUK";
              }}
            />
          </div>

          {/* Detail */}
          <div className="md:col-span-7 space-y-6">
            <div className="space-y-2 border-b pb-4">
              <p className="text-sm font-semibold text-[#FF6D1F] uppercase tracking-wider flex items-center gap-1">
                <Tag size={16} className="text-[#234C6A]" />
                Kategori:{" "}
                <span className="text-gray-700 font-bold">
                  {product.category.name}
                </span>
              </p>
              <h1 className="text-4xl lg:text-5xl font-extrabold text-[#234C6A] leading-tight">
                {product.name}
              </h1>
            </div>

            {/* Rating */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b pb-4">
              <div className="flex items-center gap-1 text-yellow-500">
                {Array(5)
                  .fill("")
                  .map((_, i) => (
                    <Star key={i} size={28} fill="gold" stroke="gold" />
                  ))}
                <span className="text-gray-800 ml-2 font-extrabold text-2xl">
                  4.9
                </span>
                <span className="text-base text-gray-500">(128 Ulasan)</span>
              </div>
              <p className="text-sm text-green-600 font-bold flex items-center gap-1 mt-2 sm:mt-0">
                <Clock size={16} className="text-green-600" /> 99+ Terjual
              </p>
            </div>

            {/* Harga */}
            <div className="space-y-2">
              {hasDiscount && (
                <p className="text-2xl font-medium text-gray-500 line-through">
                  Rp {originalPrice.toLocaleString("id-ID")}
                </p>
              )}

              <p className="text-5xl lg:text-6xl font-black text-[#FF6D1F]">
                Rp {finalPrice.toLocaleString("id-ID")}
              </p>

              {hasDiscount && (
                <span className="bg-red-100 text-red-600 font-bold px-3 py-1 rounded-full text-sm inline-block">
                  HEMAT {product.discountPercent}%
                </span>
              )}
            </div>

            {/* Tombol */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <button
                onClick={() => addToCart(product)}
                className="flex-1 bg-[#234C6A] hover:bg-[#1b3a52] text-white p-4 rounded-xl text-xl font-bold flex items-center justify-center gap-2 shadow-2xl shadow-[#234C6A]/50 transition transform hover:scale-[1.01]"
              >
                <ShoppingCart size={24} /> Masukkan Keranjang
              </button>

              <button className="flex-1 border-2 border-[#FF6D1F] text-[#FF6D1F] hover:bg-[#FF6D1F] hover:text-white p-4 rounded-xl text-xl font-bold transition shadow-lg hover:shadow-xl">
                Beli Sekarang
              </button>
            </div>

            <p className="text-xs text-gray-500 pt-2 flex items-center gap-1">
              <Info size={16} className="text-gray-400" /> Pesanan akan diproses
              dalam 1x24 jam setelah pembayaran.
            </p>
          </div>
        </div>

        {/* Jaminan */}
        <div className="mt-10 p-6 bg-white rounded-2xl shadow-xl border border-gray-100">
          <h2 className="text-xl font-bold mb-4 text-[#234C6A]">
            Jaminan Belanja
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {productFeatures.map((feature, index) => (
              <FeatureHighlight key={index} {...feature} />
            ))}
          </div>
        </div>

        {/* Deskripsi */}
        <div className="mt-10 bg-white p-8 rounded-2xl shadow-xl">
          <h2 className="text-2xl font-bold mb-4 text-[#234C6A] border-b pb-2">
            📋 Deskripsi Produk
          </h2>
          <p className="text-gray-700 leading-relaxed text-base whitespace-pre-wrap">
            {product.description}
          </p>
        </div>

        <hr className="my-10" />

        {/* Ulasan */}
        <div className="bg-white p-8 rounded-2xl shadow-xl space-y-6">
          <h2 className="text-2xl font-bold text-[#234C6A] flex items-center gap-3 border-b pb-2">
            <MessageSquare size={28} /> Ulasan Pembeli ({dummyReviews.length})
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {dummyReviews.map((review, index) => (
              <ReviewCard key={index} {...review} />
            ))}
          </div>

          <button className="w-full bg-gray-100 text-[#234C6A] hover:bg-gray-200 p-3 rounded-xl font-semibold transition">
            Lihat Semua Ulasan (128)
          </button>
        </div>
      </div>
    </div>
  );
}
