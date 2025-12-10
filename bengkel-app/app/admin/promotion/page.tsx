"use client";

import { useEffect, useState } from "react";
import { Plus, Trash2, Edit } from "lucide-react";

interface Promotion {
  id:number;
  name:string;
  discount_type:string;
  discount_value:number;
  is_active:boolean;
  start_date:string;
  end_date:string;
  products:{ id:number; name:string; price:number }[];
}

export default function PromotionPage(){

  const [list,setList]=useState<Promotion[]>([]);
  const token = typeof document!=="undefined" 
      ? document.cookie.match(/token=([^;]+)/)?.[1] : null;

  // ===== GET PROMO LIST =====
  const getPromo=async()=>{
    const res = await fetch("http://localhost:8000/api/promotions",{
      headers:{ Authorization:`Bearer ${token}` }
    });

    const data = await res.json();

    // API mu return `promotions`
    setList(data.promotions ?? data.data ?? []);
  };

  useEffect(()=>{ getPromo(); },[]);

  // ===== Hapus promo =====
  const deletePromo=async(id:number)=>{
    if(!confirm("Yakin hapus promo?")) return;

    const res = await fetch(`http://localhost:8000/api/promotions/${id}`,{
      method:"DELETE",
      headers:{ Authorization:`Bearer ${token}` }
    });

    if(res.ok){
      alert("Promo berhasil dihapus");
      getPromo();
    }
  };

  return(
    <div className="max-w-5xl mx-auto p-8">

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-[#234C6A]">📢 Daftar Promo</h1>

        <a 
          href="/admin/promotion/create"
          className="flex items-center gap-2 bg-[#FF6D1F] hover:bg-[#e55f19] text-white px-4 py-2 rounded-lg font-semibold shadow"
        >
          <Plus size={18}/> Tambah Promo
        </a>
      </div>

      {list.length === 0 ? (
        <div className="bg-white p-10 text-center rounded-xl shadow">
          <p className="text-gray-500">Belum ada promo tersedia</p>
        </div>
      ):(
        <div className="space-y-4">
        {list.map(p=>(
          <div key={p.id} 
            className="bg-white p-5 rounded-xl shadow hover:shadow-lg transition border-l-4
            border-[#FF6D1F]">

            <div className="flex justify-between items-center">

              <div>
                <h2 className="font-bold text-xl text-[#234C6A]">{p.name}</h2>
                <p className="text-gray-600 text-sm">
                  {p.discount_type === 'percentage' 
                    ? `Diskon ${p.discount_value}%`
                    : `Potongan Rp ${p.discount_value.toLocaleString()}`
                  }
                </p>

                <p className="text-xs mt-1 text-gray-500">
                  {new Date(p.start_date).toLocaleDateString("id-ID")}
                  {" "} - {" "}
                  {new Date(p.end_date).toLocaleDateString("id-ID")}
                </p>

                <div className="mt-2 text-[13px]">
                  Produk terkait:
                  <ul className="list-disc ml-6">
                    {p.products?.map(pr=>(
                      <li key={pr.id}>{pr.name}</li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <a 
                  href={`/admin/promotions/edit/${p.id}`}
                  className="flex items-center gap-1 px-3 py-1 border rounded text-blue-600 hover:bg-blue-50"
                >
                  <Edit size={16}/> Edit
                </a>

                <button
                  onClick={()=>deletePromo(p.id)}
                  className="flex items-center gap-1 px-3 py-1 border rounded text-red-600 hover:bg-red-50"
                >
                  <Trash2 size={16}/> Hapus
                </button>
              </div>

            </div>
          </div>
        ))}
        </div>
      )}
    </div>
  );
}
