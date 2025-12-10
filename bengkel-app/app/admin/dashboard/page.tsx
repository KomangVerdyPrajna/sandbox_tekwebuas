"use client";

import { useEffect, useState } from "react";
import { Package, CalendarCheck, Users, DollarSign, ArrowRight } from "lucide-react";
import Link from "next/link";

// Ambil token dari cookie
function getCookie(name: string): string | null {
  const match = document.cookie.match(new RegExp("(^| )" + name + "=([^;]+)"));
  return match ? decodeURIComponent(match[2]) : null;
}

export default function AdminDashboardPage() {

  const [productCount, setProductCount] = useState(0);
  const [bookingCount, setBookingCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

  // ================= FETCH DATA =================
  async function loadDashboard() {
    try {
      const token = getCookie("token");

      // --- Ambil produk
      const productRes = await fetch(`${API_URL}/products`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const productData = await productRes.json();
      setProductCount(productData?.products?.length || 0);

      // --- Ambil booking
      const bookingRes = await fetch(`${API_URL}/bookings`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const bookingData = await bookingRes.json();
      setBookingCount(
        Array.isArray(bookingData?.bookings || bookingData?.data)
          ? (bookingData.bookings ?? bookingData.data).length
          : 0
      );

    } catch (err) {
      console.error("Dashboard load error:", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { loadDashboard(); }, []);

  return (
    <div className="space-y-8">
      
      <h1 className="text-3xl font-bold text-[#234C6A]">Dashboard Admin</h1>
      <p className="text-gray-600">Selamat datang kembali! Berikut ringkasan aktivitas sistem.</p>

      {/* ================= STATS CARD ================= */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        
        <div className="bg-white p-6 rounded-xl shadow hover:shadow-md transition flex items-center gap-4 border-l-4 border-[#FF6D1F]">
          <Package size={40} className="text-[#234C6A]" />
          <div>
            <h3 className="font-bold text-lg">
              {loading ? "..." : productCount} Produk
            </h3>
            <p className="text-gray-500 text-sm">Tersedia di marketplace</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow hover:shadow-md transition flex items-center gap-4 border-l-4 border-[#FF6D1F]">
          <CalendarCheck size={40} className="text-[#234C6A]" />
          <div>
            <h3 className="font-bold text-lg">{loading ? "..." : bookingCount} Booking</h3>
            <p className="text-gray-500 text-sm">Belum diproses</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow hover:shadow-md transition flex items-center gap-4 border-l-4 border-[#FF6D1F]">
          <Users size={40} className="text-[#234C6A]" />
          <div>
            <h3 className="font-bold text-lg">54 User</h3> {/* Dummy sesuai permintaan */}
            <p className="text-gray-500 text-sm">Terdaftar</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow hover:shadow-md transition flex items-center gap-4 border-l-4 border-[#FF6D1F]">
          <DollarSign size={40} className="text-[#234C6A]" />
          <div>
            <h3 className="font-bold text-lg">Rp 4.250.000</h3> {/* Dummy pendapatan */}
            <p className="text-gray-500 text-sm">Pendapatan bulan ini</p>
          </div>
        </div>

      </div>

      {/* ================= SHORTCUT MENU ================= */}
      <div>
        <h2 className="text-xl font-bold text-[#234C6A] mb-3">Akses Cepat</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          <Link href="/admin/produk" className="bg-[#234C6A] hover:bg-[#1a3a52] text-white p-6 rounded-xl shadow flex justify-between items-center transition">
            Kelola Produk <ArrowRight />
          </Link>

          <Link href="/admin/bookingAdmin" className="bg-[#FF6D1F] hover:bg-orange-600 text-white p-6 rounded-xl shadow flex justify-between items-center transition">
            Lihat Booking <ArrowRight />
          </Link>

          <Link href="/admin/kasir/transaksi" className="bg-green-600 hover:bg-green-700 text-white p-6 rounded-xl shadow flex justify-between items-center transition">
            Riwayat Transaksi <ArrowRight />
          </Link>

        </div>
      </div>

      {/* ================= Grafik Dummy ================= */}
      <div className="bg-white p-6 rounded-xl shadow">
        <h3 className="font-bold text-lg text-[#234C6A]">Grafik Penjualan Bulanan</h3>
        <div className="w-full h-48 flex items-end gap-2 pt-6">
          {[40,60,30,80,55,95,70,88].map((h,i)=>(
            <div key={i} className="bg-[#FF6D1F] w-8 rounded-t-lg" style={{height: `${h}%`}} />
          ))}
        </div>
        <p className="text-gray-500 text-sm mt-2">*Data contoh, bisa terhubung database nanti.</p>
      </div>

    </div>
  );
}
