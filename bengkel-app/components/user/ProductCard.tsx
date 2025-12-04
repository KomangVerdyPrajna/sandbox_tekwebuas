"use client";

import { PlusCircle } from "lucide-react";

interface Product {
  id: number;
  name: string;
  price: number;
  category: { name: string; slug: string };
  image_url: string;
}

export default function ProductCard({
  product,
  addToCart
}: {
  product: Product;
  addToCart: (p: Product) => void;
}) {

  return (
    <div className="group bg-white rounded-xl shadow-lg border border-gray-200 hover:shadow-xl hover:border-[#FF6D1F] transition duration-300 overflow-hidden">

      {/* Klik gambar → Detail Produk */}
      <a href={`/marketplace/detailProduk?id=${product.id}`} className="block">
        <img
          src={product.image_url}
          alt={product.name}
          className="w-full h-44 object-cover transition group-hover:scale-[1.05]"
        />
      </a>

      <div className="p-4 flex flex-col justify-between h-36">
        <h2 className="font-bold text-lg text-[#234C6A] line-clamp-2">{product.name}</h2>

        <p className="text-[#FF6D1F] font-extrabold text-xl">
          Rp {product.price.toLocaleString("id-ID")}
        </p>

        <button
          onClick={() => addToCart(product)}
          className="bg-[#234C6A] text-white p-2 rounded-full hover:bg-[#1A374A] transition flex items-center gap-1 self-end"
        >
          <PlusCircle size={22} />
        </button>
      </div>
    </div>
  );
}
