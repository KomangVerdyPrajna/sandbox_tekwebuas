"use client";
import { useEffect, useState } from "react";
import PromotionCard from "@/components/user/PromotionCard";

export default function PromoPage(){

  const [promo,setPromo]=useState<any[]>([]);

  useEffect(()=>{
    fetch("http://localhost:8000/api/promotions/public")
      .then(r=>r.json())
      .then(d=>setPromo(d.promotions||[]));
  },[]);

  return(
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-[#234C6A] mb-6">
        Promo Spesial 🚀
      </h1>

      {promo.length>0 ? promo.map((p)=>(
        <PromotionCard
          key={p.id}
          title={p.name}
          discount_type={p.type}
          discount_value={p.value}
          products={p.products}
        />
      )):(
        <p className="text-gray-600 text-center mt-10">Belum ada promo aktif...</p>
      )}
    </div>
  );
}
