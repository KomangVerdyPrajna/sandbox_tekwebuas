"use client";

import Link from "next/link";

interface Order {
  id: number;
  product: string;
  image: string;
  status: "diproses" | "selesai";
  date: string;
  price: number;
}

// Dummy Data (sementara — nanti bisa dari DB/localStorage)
const orders: Order[] = [
  { id: 1, product: "Oli Mesin Yamalube", image: "/oli.jpg", status: "selesai", date: "12 Feb 2025", price: 65000 },
  { id: 2, product: "Kampas Rem Depan Racing", image: "/kampas.jpg", status: "diproses", date: "13 Feb 2025", price: 85000 },
];

export default function PesananPage() {
  return (
    <div className="p-6 max-w-3xl mx-auto space-y-8">

      {/* TITLE */}
      <h1 className="text-3xl font-bold text-[#234C6A] text-center">Pesanan Saya</h1>

      {/* LIST KARTU PESANAN */}
      <div className="space-y-4">
        {orders.map((item) => (
          <div 
            key={item.id}
            className="bg-white rounded-xl shadow-md overflow-hidden border hover:shadow-xl transition-all"
          >
            {/* HEADER */}
            <div className="flex justify-between items-center px-4 py-2 border-b bg-gray-50">
              <span className="text-sm text-gray-500">{item.date}</span>

              <span className={`text-xs font-bold px-3 py-1 rounded-full
                ${item.status === "selesai" ? "bg-green-100 text-green-600" : "bg-orange-100 text-orange-600"}
              `}>
                {item.status === "selesai" ? "Selesai" : "Sedang Diproses"}
              </span>
            </div>

            {/* PRODUCT ROW */}
            <div className="flex gap-4 p-4 items-center">
              <img 
                src={item.image} 
                alt={item.product} 
                className="w-20 h-20 object-cover rounded-lg border"
              />

              <div className="flex-1">
                <p className="text-lg font-semibold text-[#234C6A]">{item.product}</p>
                <p className="text-sm text-gray-500">Jumlah: 1 barang</p>
                <p className="font-bold text-[#FF6D1F] mt-1">Rp {item.price.toLocaleString()}</p>
              </div>
            </div>

            {/* FOOTER BUTTON */}
            <div className="border-t px-4 py-3 flex justify-end bg-gray-50">
              <Link 
                href={`/marketplace/pesanan/${item.id}`}
                className="bg-[#234C6A] text-white px-4 py-2 rounded-lg hover:bg-[#1A374A] text-sm font-medium"
              >
                Lihat Detail
              </Link>
            </div>
          </div>
        ))}

        {orders.length === 0 && (
          <p className="text-center text-gray-500">Belum ada pesanan...</p>
        )}
      </div>

    </div>
  );
}
