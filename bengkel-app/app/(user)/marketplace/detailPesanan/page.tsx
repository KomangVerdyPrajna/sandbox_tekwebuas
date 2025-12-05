"use client";

import { useEffect, useState } from "react";
import { ArrowLeft, CheckCircle, Hourglass, Package, Truck, Wallet, MapPin, Calendar, ShoppingBag } from "lucide-react";

// Tipe Data Order/Pesanan (Harus sama dengan di Checkout)
interface Order {
    orderId: string;
    date: string;
    status: 'Menunggu Pembayaran' | 'Diproses' | 'Dikirim' | 'Selesai';
    items: { id: number; name: string; price: number; qty: number; }[];
    subtotal: number;
    shippingMethod: string;
    shippingCost: number;
    paymentMethod: string;
    total: number;
    recipientName: string;
    address: string;
    phone: string; // <-- FIX: Tambahkan field phone
}

// Data Status untuk Timeline
const STATUS_STEPS = [
    { key: 'Menunggu Pembayaran', title: 'Menunggu Pembayaran', icon: Wallet },
    { key: 'Diproses', title: 'Pesanan Diproses', icon: Package },
    { key: 'Dikirim', title: 'Sedang Dikirim', icon: Truck },
    { key: 'Selesai', title: 'Pesanan Selesai', icon: CheckCircle },
];

// Komponen Timeline Status
const StatusTimeline = ({ currentStatus }: { currentStatus: Order['status'] }) => {
    const statusIndex = STATUS_STEPS.findIndex(s => s.key === currentStatus);

    return (
        <div className="relative pt-6">
            {/* Garis Vertikal */}
            <div className="absolute top-8 left-6 md:left-8 w-1 bg-gray-200 h-[calc(100%-4rem)]"></div>
            
            <div className="relative">
                {STATUS_STEPS.map((step, index) => {
                    const isCompleted = index <= statusIndex;
                    const isCurrent = index === statusIndex;
                    const Icon = step.icon;
                    
                    return (
                        <div key={step.key} className="flex items-start mb-10 relative">
                            {/* Icon & Bullet */}
                            <div className={`flex items-center justify-center w-12 h-12 md:w-16 md:h-16 rounded-full shrink-0 z-10 transition duration-300
                                ${isCompleted 
                                    ? isCurrent ? 'bg-[#FF6D1F] ring-4 ring-[#FF6D1F]/30' : 'bg-[#234C6A] shadow-md shadow-[#234C6A]/50'
                                    : 'bg-gray-300'}`}
                            >
                                <Icon size={24} className={isCompleted ? 'text-white' : 'text-gray-500'} />
                            </div>
                            
                            {/* Detail Status */}
                            <div className={`ml-4 p-4 rounded-xl transition duration-300 shadow-md w-full 
                                ${isCurrent ? 'bg-[#FF6D1F] text-white transform scale-[1.02]' 
                                : isCompleted ? 'bg-white text-[#234C6A] border border-[#234C6A]/20' 
                                : 'bg-gray-100 text-gray-500 border border-gray-200'}`}
                            >
                                <h3 className="font-extrabold text-lg">{step.title}</h3>
                                <p className={`text-sm ${isCurrent ? 'text-white/80' : 'text-gray-500'}`}>
                                    {isCompleted 
                                        ? (step.key === 'Menunggu Pembayaran' ? 'Lakukan transfer segera.' : `Status saat ini per ${new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}.`) 
                                        : 'Akan diproses setelah langkah sebelumnya selesai.'}
                                </p>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

// ===============================
// KOMPONEN UTAMA
// ===============================
export default function DetailPesananPage() {
    const [order, setOrder] = useState<Order | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const savedOrder = localStorage.getItem("latestOrder");
        if (savedOrder) {
            const parsedOrder: Order = JSON.parse(savedOrder);
            
            // --- SIMULASI STATUS (HANYA UNTUK DEBUG/DEMO) ---
            // Setelah 5 detik, ubah status menjadi "Diproses"
            // Ini akan memicu render ulang dan menggeser timeline
            setTimeout(() => {
                const updatedOrder = { ...parsedOrder, status: 'Diproses' as Order['status'] };
                setOrder(updatedOrder);
                localStorage.setItem("latestOrder", JSON.stringify(updatedOrder));
            }, 5000);
            // ------------------------------------------------

            setOrder(parsedOrder);
        }
        setLoading(false);
    }, []);

    if (loading) return (
        <div className="text-center py-20 text-[#234C6A] text-xl font-semibold">Memuat Detail Pesanan...</div>
    );

    if (!order) return (
        <div className="text-center py-20 px-4 md:px-8">
            <div className="bg-white p-8 rounded-xl shadow-lg max-w-lg mx-auto">
                <p className="text-gray-600 text-lg">Tidak ada pesanan aktif yang ditemukan 😢</p>
                <a href="/marketplace" className="mt-4 inline-flex items-center text-[#FF6D1F] underline hover:text-[#234C6A] transition">
                    <ArrowLeft size={18} className="mr-1"/> Mulai berbelanja
                </a>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 md:px-8">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="mb-8 p-6 bg-white rounded-2xl shadow-xl border-t-8 border-[#FF6D1F]">
                    <h1 className="text-3xl font-extrabold text-[#234C6A] flex items-center gap-3">
                        <ShoppingBag size={32} className="text-[#FF6D1F]" /> Detail Pesanan
                    </h1>
                    <p className="text-gray-600 mt-2 text-lg">
                        ID Pesanan: <span className="font-bold text-[#FF6D1F]">{order.orderId}</span>
                    </p>
                    <p className="text-sm text-gray-500 flex items-center gap-1">
                        <Calendar size={16}/> Dipesan pada: {order.date}
                    </p>
                </div>

                {/* ================= STATUS TRACKING (TIMELINE) ================= */}
                <div className="mb-10 p-8 bg-white rounded-2xl shadow-xl">
                    <h2 className="text-2xl font-bold text-[#234C6A] mb-6 border-b pb-3">Status Pengiriman</h2>
                    <StatusTimeline currentStatus={order.status} />
                </div>


                <div className="grid md:grid-cols-2 gap-8">
                    {/* ================= INFO PENGIRIMAN & PEMBAYARAN ================= */}
                    <div className="p-6 bg-white rounded-2xl shadow-xl space-y-4">
                        <h2 className="text-xl font-bold text-[#234C6A] border-b pb-2 flex items-center gap-2">
                            <MapPin size={22}/> Alamat & Kurir
                        </h2>
                        <div className="text-gray-700 text-sm space-y-2">
                            <p><strong>Penerima:</strong> {order.recipientName}</p>
                            <p><strong>Telepon:</strong> {order.phone || 'Tidak tersedia'}</p>
                            <p><strong>Alamat:</strong> {order.address}</p>
                            <p><strong>Kurir:</strong> {order.shippingMethod === 'express' ? 'Express (1-2 Hari)' : 'Reguler (3-5 Hari)'}</p>
                        </div>

                        <h2 className="text-xl font-bold text-[#234C6A] border-b pb-2 pt-4 flex items-center gap-2">
                            <Wallet size={22}/> Pembayaran
                        </h2>
                        <div className="text-gray-700 text-sm space-y-1">
                            <p><strong>Metode:</strong> {order.paymentMethod === 'transfer' ? 'Transfer Bank' : order.paymentMethod.toUpperCase()}</p>
                            <p className="text-lg font-extrabold text-[#FF6D1F]">Total Bayar: Rp {order.total.toLocaleString('id-ID')}</p>
                            <p className="text-xs text-red-500 pt-1">Lakukan pembayaran sebelum batas waktu (simulasi)</p>
                        </div>
                    </div>

                    {/* ================= RINGKASAN HARGA & ITEM ================= */}
                    <div className="p-6 bg-white rounded-2xl shadow-xl space-y-4">
                        <h2 className="text-xl font-bold text-[#234C6A] border-b pb-2">Ringkasan Harga</h2>
                        <div className="text-sm space-y-2">
                            <div className="flex justify-between"><span>Subtotal Produk:</span> <span>Rp {order.subtotal.toLocaleString("id-ID")}</span></div>
                            <div className="flex justify-between"><span>Ongkos Kirim:</span> <span>Rp {order.shippingCost.toLocaleString("id-ID")}</span></div>
                        </div>
                        <div className="flex justify-between font-bold text-xl pt-3 border-t-2 border-dashed border-gray-300">
                            <span className="text-[#234C6A]">Total Tagihan</span>
                            <span className="text-[#FF6D1F]">Rp {order.total.toLocaleString("id-ID")}</span>
                        </div>

                        <h2 className="text-xl font-bold text-[#234C6A] border-b pb-2 pt-4">Item Dipesan ({order.items.length})</h2>
                        <div className="text-sm space-y-2 max-h-40 overflow-y-auto">
                            {order.items.map(item => (
                                <div key={item.id} className="flex justify-between text-gray-700">
                                    <span className="truncate pr-2">{item.name}</span>
                                    <span>{item.qty} x Rp {item.price.toLocaleString("id-ID")}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
                
                <a href="/marketplace/pesanan" className="mt-8 block text-center text-[#234C6A] font-bold hover:text-[#FF6D1F] transition">
                    <ArrowLeft size={18} className="inline mr-1"/> Kembali ke Toko
                </a>
            </div>
        </div>
    );
}