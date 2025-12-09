"use client";

import Link from "next/link";
import { Truck, CheckCircle } from "lucide-react"; 
import { useEffect, useState } from "react";

// ===============================
// Type Order sesuai database
// ===============================
interface Order {
  id: number;
  items: {
    product_id: number;
    quantity: number;
    subtotal: number;
  }[];
  name: string;
  total: number;
  status: string;
  created_at: string;
}

// Ambil token pada cookie
const getCookie = (name: string) => {
  const match = document.cookie.match(new RegExp("(^| )" + name + "=([^;]+)"));
  return match ? decodeURIComponent(match[2]) : null;
};

export default function PesananPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  // ================= GET DATA ORDER =================
  const fetchOrders = async () => {
    try {
      const token = getCookie("token");
      if (!token) return alert("Silahkan login dulu!");

      const res = await fetch("http://localhost:8000/api/orders", {
        headers: { Authorization: `Bearer ${token}` }
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data);

      setOrders(data.orders);
    } catch (e) {
      console.error(e);
      alert("Gagal memuat daftar pesanan!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchOrders(); }, []);

  if (loading) return <p className="text-center mt-10">Memuat pesanan...</p>;

  return (
    <div className="p-4 sm:p-6 max-w-3xl mx-auto space-y-6 sm:space-y-8 bg-gray-50 min-h-screen">
      {/* TITLE */}
      <h1 className="text-3xl font-bold text-[#234C6A] text-center border-b pb-2">
        Pesanan Saya 📦
      </h1>

      {/* LIST PESANAN */}
      <div className="space-y-4">
        {orders.length > 0 ? (
          orders.map((item) => (
            <div 
              key={item.id}
              className="bg-white rounded-xl shadow-lg border border-gray-200 hover:shadow-xl transition-all"
            >
              {/* HEADER */}
              <div className="flex justify-between items-center px-4 py-3 border-b bg-gray-50 rounded-t-xl">
                <span className="text-sm text-gray-500">
                  {new Date(item.created_at).toLocaleDateString("id-ID", {
                    day:"2-digit", month:"short", year:"numeric"
                  })}
                </span>

                <span className={`flex items-center gap-1 text-xs font-bold px-3 py-1 rounded-full uppercase
                  ${item.status === "completed" ? "bg-green-100 text-green-700" : "bg-orange-100 text-orange-700"}`}
                >
                  {item.status === "completed"
                    ? <><CheckCircle size={12}/> Selesai</>
                    : <><Truck size={12}/> Diproses</>}
                </span>
              </div>

              <div className="p-4 space-y-1">
                <p className="font-semibold text-[#234C6A] text-lg">Pesanan #{item.id}</p>
                <p className="text-sm text-gray-600">Jumlah barang: {item.items.length}</p>
                <p className="font-bold text-[#FF6D1F] text-lg">
                  Total: Rp {item.total.toLocaleString("id-ID")}
                </p>
              </div>

              <div className="border-t px-4 py-3 flex justify-end bg-gray-50 rounded-b-xl">
                <Link 
                  href={`/marketplace/pesanan/${item.id}`}
                  className="bg-[#234C6A] text-white px-4 py-2 rounded-lg hover:bg-[#1A374A] transition text-sm font-medium shadow-md"
                >
                  Lihat Detail
                </Link>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500 py-10 border rounded-xl bg-white shadow-sm">
            Belum ada pesanan yang tercatat.
          </p>
        )}
      </div>
    </div>
  );
}
