"use client";

interface PromoProduct {
  id: number;
  name: string;
  price_before: number;
  price_after: number;
  img_url: string;
}

interface PromotionProps {
  title: string;
  discount_type: string;       // percentage | fixed
  discount_value: number;
  products: PromoProduct[];
}

export default function PromotionCard({ title, discount_type, discount_value, products }: PromotionProps) {

  return (
    <div className="mb-8 bg-white/80 backdrop-blur-xl p-4 rounded-xl shadow-md border">
      
      {/* Header Promo */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-[#234C6A]">{title}</h2>

        <span className="bg-[#FF6D1F] text-white px-3 py-1 text-xs rounded-full shadow">
          {discount_type === "percentage"
            ? `${discount_value}% OFF`
            : `- Rp ${discount_value.toLocaleString("id-ID")}`}
        </span>
      </div>

      {/* Produk Promo */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">

        {products.map((p) => (
          <div
            key={p.id}
            className="group p-3 rounded-xl shadow hover:shadow-lg border hover:border-[#FF6D1F] transition cursor-pointer"
            onClick={()=>{
              localStorage.setItem("selectedProduct", JSON.stringify(p));
              window.location.href="/marketplace/detailProduk";
            }}
          >

            {/* Image */}
            <div className="relative">
              <img
                src={p.img_url}
                className="w-full h-32 object-cover rounded-lg"
                alt={p.name}
              />

              <span className="absolute top-2 right-2 bg-[#FF6D1F] text-white text-xs px-2 py-[2px] rounded-sm shadow">
                PROMO
              </span>
            </div>

            {/* Nama Produk */}
            <p className="font-semibold mt-2 text-gray-800 truncate group-hover:text-[#FF6D1F]">
              {p.name}
            </p>

            {/* Harga */}
            <div>
              <p className="text-sm line-through text-gray-400">
                Rp {p.price_before.toLocaleString("id-ID")}
              </p>
              
              <p className="text-lg text-[#234C6A] font-bold">
                Rp {p.price_after.toLocaleString("id-ID")}
              </p>
            </div>

          </div>
        ))}
      </div>
    </div>
  );
}
