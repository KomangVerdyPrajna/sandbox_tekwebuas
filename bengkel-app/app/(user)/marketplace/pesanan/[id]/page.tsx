"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Package, Wallet, Truck, CheckCircle, Clock } from "lucide-react";

interface Order {
  id: number;
  items: { product_id:number; quantity:number; subtotal:number }[];
  name: string;
  no_tlp: string;
  address: string;
  payment: string;
  bank?: string;
  delivery: string;
  total: number;
  status: string;
  created_at: string;
}

const getCookie = (name:string) =>{
    const match=document.cookie.match(new RegExp("(^| )"+name+"=([^;]+)"));
    return match ? decodeURIComponent(match[2]) : null;
};

export default function DetailPesanan(){
  const { id } = useParams();
  const [order,setOrder]=useState<Order|null>(null);
  const [loading,setLoading]=useState(true);

  const fetchDetail=async()=>{
    try{
      const token=getCookie("token");
      if(!token) return alert("Login dulu!");

      const res=await fetch(`http://localhost:8000/api/orders/${id}`,{
        headers:{Authorization:`Bearer ${token}`}
      });

      const data=await res.json();
      if(!res.ok) throw new Error(data);

      // FIX disini ⬇
      setOrder({
        ...data.order,
        items: typeof data.order.items === "string" 
              ? JSON.parse(data.order.items) 
              : data.order.items
      });

    }catch(err){
      console.error(err);
      alert("Gagal memuat detail pesanan!");
    }finally{
      setLoading(false);
    }
  };

  useEffect(()=>{fetchDetail();},[]);

  if(loading) return <p className="text-center mt-10">Memuat detail...</p>;
  if(!order) return <p className="text-center mt-10 text-red-500">Data tidak ditemukan</p>;

  return (
    <div className="max-w-3xl mx-auto p-6 bg-gray-50 min-h-screen space-y-6">

      {/* HEADER */}
      <div className="flex items-center gap-3 mb-4">
        <Link href="/marketplace/pesanan">
          <ArrowLeft size={28} className="text-[#234C6A] hover:text-black cursor-pointer"/>
        </Link>
        <h1 className="text-2xl font-bold text-[#234C6A]">Detail Pesanan #{order.id}</h1>
      </div>

      {/* CARD */}
      <div className="bg-white p-6 rounded-xl shadow border space-y-5">

        {/* STATUS */}
        <div className="flex justify-between items-center border-b pb-3">
          <span className="text-gray-500">
            {new Date(order.created_at).toLocaleDateString("id-ID",{day:"2-digit",month:"short",year:"numeric"})}
          </span>

          <span className={`px-3 py-1 text-xs rounded-full uppercase font-bold flex items-center gap-1
              ${order.status==="completed"?"bg-green-100 text-green-700":
                order.status==="pending"?"bg-orange-200 text-orange-700":
                "bg-blue-200 text-blue-700"}`}>
            {order.status==="completed" && <CheckCircle size={12}/>}
            {order.status==="pending" && <Clock size={12}/>}
            {order.status!=="pending" && order.status!=="completed" && <Truck size={12}/>}
            {order.status}
          </span>
        </div>

        {/* INFO */}
        <div>
          <h2 className="font-semibold text-[#234C6A] text-lg flex items-center gap-2">
            <Package size={18}/> Informasi Penerima
          </h2>
          <div className="text-sm mt-2 space-y-1">
            <p><b>Nama:</b> {order.name}</p>
            <p><b>Telp:</b> {order.no_tlp}</p>
            <p><b>Alamat:</b> {order.address}</p>
          </div>
        </div>

        {/* PAYMENT */}
        <div>
          <h2 className="font-semibold text-[#234C6A] text-lg flex items-center gap-2">
            <Wallet size={18}/> Pembayaran
          </h2>
          <div className="mt-2 text-sm space-y-1">
            <p><b>Metode:</b> {order.payment}</p>

            {order.payment==="transfer" && (
              <div className="bg-gray-100 p-3 rounded-lg border text-sm">
                <p><b>Bank:</b> BCA</p>
                <p><b>No Rek:</b> 123 456 7890</p>
                <p><b>A/N:</b> Bengkel Motor Jaya</p>
                <p className="text-red-500 mt-1">Upload bukti transfer setelah pembayaran</p>
              </div>
            )}
          </div>
        </div>

        {/* LIST PRODUK */}
        <div>
          <h2 className="font-semibold text-[#234C6A] text-lg">Daftar Produk</h2>

          <div className="mt-2 space-y-1">
            {order.items.map((it,i)=>(
              <div key={i} className="flex justify-between text-sm border-b pb-1">
                <span>Produk ID {it.product_id} x{it.quantity}</span>
                <span>Rp {it.subtotal.toLocaleString("id-ID")}</span>
              </div>
            ))}
          </div>

        </div>

        {/* TOTAL */}
        <div className="border-t pt-3 flex justify-between text-[#FF6D1F] font-bold text-lg">
          <span>Total</span>
          <span>Rp {order.total.toLocaleString("id-ID")}</span>
        </div>

      </div>

      <Link href="/marketplace" className="block text-center">
        <button className="bg-[#FF6D1F] text-white px-6 py-3 rounded-full font-bold shadow hover:bg-[#e65b14]">
          Belanja Lagi
        </button>
      </Link>

    </div>
  );
}
