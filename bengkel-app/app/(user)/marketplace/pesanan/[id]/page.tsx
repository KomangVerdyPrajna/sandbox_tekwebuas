"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { ArrowLeft, CheckCircle, Package, Truck, Wallet, MapPin, Calendar, ShoppingBag } from "lucide-react";

interface OrderItem {
    product_id: number;
    quantity: number;
    subtotal: number;
}

interface Order {
    id: number;
    items: OrderItem[];
    name: string;
    no_tlp: string;
    address: string;
    delivery: string;   // kurir / ambil_di_tempat
    payment: string;    // tunai / transfer
    total: number;
    status: string;
    created_at: string;
}

// Ambil token cookie
const getCookie = (name: string) => {
    const match = document.cookie.match(new RegExp("(^| )" + name + "=([^;]+)"));
    return match ? decodeURIComponent(match[2]) : null;
};

// Untuk tampilan progress status
const STATUS_STEPS = [
    { key:'pending', title:'Menunggu Pembayaran', icon:Wallet },
    { key:'processing', title:'Diproses', icon:Package },
    { key:'shipped', title:'Sedang Dikirim', icon:Truck },
    { key:'completed', title:'Selesai', icon:CheckCircle },
];

const StatusTimeline = ({ currentStatus }: { currentStatus: string }) => {
    const index = STATUS_STEPS.findIndex(s=>s.key===currentStatus);

    return (
        <div className="relative pt-6">
            <div className="absolute top-8 left-6 w-1 bg-gray-200 h-[calc(100%-4rem)]"></div>
            {STATUS_STEPS.map((s,i)=>{
                const Icon=s.icon;
                const done=i<=index;
                const active=i===index;
                return(
                    <div key={s.key} className="flex items-start mb-10 relative">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center
                            ${done? active?"bg-[#FF6D1F] ring-4 ring-[#FF6D1F]/40":"bg-[#234C6A]":'bg-gray-300'}`}>
                            <Icon size={22} className={done?'text-white':'text-gray-500'}/>
                        </div>
                        <div className={`ml-4 p-4 rounded-xl shadow w-full transition
                            ${active?'bg-[#FF6D1F] text-white scale-[1.03]':
                            done?'bg-white border border-[#234C6A]/30 text-[#234C6A]':
                            'bg-gray-100 text-gray-500'}`}>
                            <h3 className="font-bold text-lg">{s.title}</h3>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default function DetailPesananPage() {
    const { id } = useParams();
    const [order,setOrder]=useState<Order|null>(null);
    const [loading,setLoading]=useState(true);

    // Fetch order dari API Laravel
    const fetchOrder = async () =>{
        try{
            const token=getCookie("token");
            if(!token) return alert("Harus login!");

            const res=await fetch(`http://localhost:8000/api/orders/${id}`,{
                headers:{Authorization:`Bearer ${token}`}
            });
            const data=await res.json();
            if(!res.ok) throw data;

            setOrder(data.order);
        }catch(e){
            console.log(e);
            alert("Gagal memuat detail pesanan");
        }finally{
            setLoading(false);
        }
    };

    useEffect(()=>{ fetchOrder(); },[]);

    if(loading) return <p className="text-center mt-10">Memuat detail pesanan...</p>;
    if(!order) return (
        <div className="text-center py-20">
            <p>Tidak ada data pesanan</p>
            <a href="/marketplace/pesanan" className="text-blue-600 underline">Kembali</a>
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-50 py-10 px-4">
            <div className="max-w-4xl mx-auto">

                {/* Header Order */}
                <div className="bg-white p-6 rounded-xl shadow border-l-8 border-[#FF6D1F] mb-8">
                    <h1 className="text-3xl font-extrabold text-[#234C6A] flex gap-2">
                        <ShoppingBag/> Detail Pesanan
                    </h1>
                    <p>ID Pesanan: <b>#{order.id}</b></p>
                    <p className="flex gap-1 text-sm text-gray-600">
                        <Calendar size={16}/> {new Date(order.created_at).toLocaleDateString("id-ID")}
                    </p>
                </div>

                {/* Status */}
                <div className="bg-white p-6 rounded-xl shadow mb-8">
                    <h2 className="text-xl font-bold border-b pb-2 text-[#234C6A]">Status Pesanan</h2>
                    <StatusTimeline currentStatus={order.status}/>
                </div>

                <div className="grid md:grid-cols-2 gap-6">

                    {/* Pengiriman */}
                    <div className="bg-white p-6 rounded-xl shadow space-y-2">
                        <h2 className="font-bold text-[#234C6A] border-b pb-2 mb-3 flex gap-2"><MapPin/> Pengiriman</h2>
                        <p>Penerima: <b>{order.name}</b></p>
                        <p>No. Hp: {order.no_tlp}</p>
                        <p>Alamat: {order.address}</p>
                        <p>Metode: {order.delivery === "kurir" ? "Kurir" : "Ambil di Tempat"}</p>
                        <p>Pembayaran: <b>{order.payment}</b></p>
                    </div>

                    {/* Harga + Items */}
                    <div className="bg-white p-6 rounded-xl shadow space-y-2">
                        <h2 className="font-bold text-[#234C6A] border-b pb-2">Ringkasan Harga</h2>
                        <p className="text-xl font-bold text-[#FF6D1F]">Total: Rp {order.total.toLocaleString()}</p>

                        <h3 className="mt-3 font-bold border-b pb-2">Item</h3>
                        {order.items.map((i,index)=>(
                            <p key={index}>Produk #{i.product_id} — {i.quantity}x | Rp {i.subtotal.toLocaleString()}</p>
                        ))}
                    </div>

                </div>

                <a href="/marketplace/pesanan" 
                   className="block text-center mt-10 text-[#234C6A] hover:text-[#FF6D1F] font-semibold">
                    <ArrowLeft className="inline"/> Kembali
                </a>

            </div>
        </div>
    );
}
