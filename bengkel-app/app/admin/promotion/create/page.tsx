"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface Product {
  id:number;
  name:string;
}

export default function PromotionCreate() {
  const router = useRouter();
  const [name,setName]=useState("");
  const [type,setType]=useState("percentage");
  const [value,setValue]=useState(0);
  const [start,setStart]=useState("");
  const [end,setEnd]=useState("");
  const [products,setProducts]=useState<Product[]>([]);
  const [selected,setSelected]=useState<number[]>([]);

  const token = typeof document!=="undefined"
    ? document.cookie.match(/token=([^;]+)/)?.[1] : null;

  // get produk
  const getProducts = async()=>{
    const r=await fetch("http://localhost:8000/api/products");
    const d=await r.json();
    setProducts(d.products || []);
  };

  useEffect(()=>{ getProducts(); },[]);

  const createPromo=async()=>{
    const send={
      name,
      discount_type:type,
      discount_value:value,
      start_date:start,
      end_date:end,
      is_active:true,
      product_ids:selected
    };

    const res=await fetch("http://localhost:8000/api/promotions",{
      method:"POST",
      headers:{
        "Authorization":`Bearer ${token}`,
        "Content-Type":"application/json"
      },
      body:JSON.stringify(send)
    });

    if(res.ok){
      alert("Promo berhasil dibuat");
      router.push("/admin/promotion");
    }else alert("Gagal membuat promo");
  };

  return (
    <div className="max-w-3xl mx-auto p-8">
      <h1 className="text-3xl font-bold text-[#234C6A] mb-6">➕ Tambah Promo</h1>

      <div className="space-y-4">

        <input
          placeholder="Nama Promo"
          className="border p-2 rounded w-full"
          value={name} onChange={e=>setName(e.target.value)}
        />

        <select value={type} onChange={e=>setType(e.target.value)}
          className="border p-2 rounded w-full"
        >
          <option value="percentage">Diskon Persen (%)</option>
          <option value="fixed">Potongan Harga (Rp)</option>
        </select>

        <input
          type="number"
          placeholder="Nilai Diskon"
          className="border p-2 rounded w-full"
          value={value} onChange={e=>setValue(Number(e.target.value))}
        />

        <label className="font-semibold">Tanggal Mulai</label>
        <input type="datetime-local" className="border p-2 rounded w-full"
          value={start} onChange={e=>setStart(e.target.value)}
        />

        <label className="font-semibold">Tanggal Berakhir</label>
        <input type="datetime-local" className="border p-2 rounded w-full"
          value={end} onChange={e=>setEnd(e.target.value)}
        />

        <label className="font-semibold block">Pilih Produk</label>
        <div className="grid grid-cols-2 gap-2">
          {products.map(p=>(
            <label key={p.id} className="flex gap-2 items-center border p-2 rounded">
              <input type="checkbox"
                onChange={e=>{
                  e.target.checked
                  ? setSelected([...selected,p.id])
                  : setSelected(selected.filter(id=>id!==p.id))
                }}
              />
              {p.name}
            </label>
          ))}
        </div>

        <button
          onClick={createPromo}
          className="w-full p-3 bg-[#FF6D1F] hover:bg-[#e55a18] text-white rounded font-semibold text-lg"
        >
          Simpan Promo
        </button>
      </div>
    </div>
  );
}
