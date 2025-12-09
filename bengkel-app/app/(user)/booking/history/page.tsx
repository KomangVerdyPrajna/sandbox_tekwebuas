"use client";

import { useState, useEffect } from "react";
import { CheckCircle, Clock, Wrench, Calendar, Tag, Car, Phone, BookOpen, User } from "lucide-react";

// === Interface berdasarkan response Laravel ===
interface Booking {
  id: number;
  jenis_kendaraan: string;
  nama_kendaraan: string;
  jenis_service: string;
  booking_date: string;
  no_wa: string;
  notes: string | null;
  status: "Pending" | "Diterima" | "Selesai";
}

// Helper ambil token cookie
function getCookie(name: string) {
  const match = document.cookie.match(new RegExp("(^| )" + name + "=([^;]+)"));
  return match ? decodeURIComponent(match[2]) : null;
}

export default function RiwayatBooking() {

  const [riwayat, setRiwayat] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  // ================= FETCH DATA FROM API =================
  async function loadBooking() {
    try {
      const token = getCookie("token");
      if (!token) return alert("Silahkan login terlebih dahulu!");

      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

      const res = await fetch(`${apiUrl}/bookings`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      const data = await res.json();

      if (!res.ok) {
        console.log(data);
        return alert("Gagal mengambil booking!");
      }

      setRiwayat(data.data || data); // antisipasi format berbeda
    } catch (err) {
      console.error("Error fetch bookings:", err);
      alert("Server error");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadBooking();
  }, []);

  // =======================================================
  // VIEW COMPONENT
  // =======================================================

  function statusBadge(status: Booking["status"]) {
    let base = "px-3 py-1 rounded-full text-sm font-bold tracking-wider";
    return {
      Pending: <span className={`${base} bg-yellow-100 text-yellow-800 border border-yellow-300`}>Pending</span>,
      Diterima: <span className={`${base} bg-blue-100 text-blue-800 border border-blue-300`}>Diterima</span>,
      Selesai: <span className={`${base} bg-green-100 text-green-800 border border-green-300`}>Selesai</span>
    }[status];
  }

  function statusBorder(status: Booking["status"]) {
    return {
      Pending: "border-l-4 border-yellow-500",
      Diterima: "border-l-4 border-blue-500",
      Selesai: "border-l-4 border-green-500"
    }[status];
  }

  function statusIcon(status: Booking["status"]) {
    return {
      Pending: <Clock className="text-yellow-600" size={24} />,
      Diterima: <Wrench className="text-blue-600" size={24} />,
      Selesai: <CheckCircle className="text-green-600" size={24} />
    }[status];
  }

  function formatDate(date: string) {
    return new Date(date).toLocaleString("id-ID", {
      year: "numeric", month: "long", day: "numeric",
      hour: "2-digit", minute: "2-digit"
    });
  }

  // =======================================================

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="flex items-center text-[#234C6A] text-lg font-medium">
          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-[#FF6D1F]" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" className="opacity-25" />
            <path fill="currentColor" className="opacity-75" d="M4 12a8 8..." />
          </svg>
          Memuat riwayat booking...
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">

        <h1 className="text-4xl font-extrabold text-[#234C6A] mb-10 text-center">
          Riwayat Booking Servis 🗓️
        </h1>

        <div className="space-y-6">
          {riwayat.length === 0 ? (
            <div className="text-center p-10 bg-white rounded-xl shadow-md border border-gray-200">
              <p className="text-gray-500 text-lg">Belum ada booking tercatat.</p>
            </div>
          ) : (
            riwayat.map(item => (
              <div key={item.id} className={`bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition ${statusBorder(item.status)}`}>
                
                {/* Header */}
                <div className="flex justify-between items-start border-b pb-4 mb-4">
                  <div className="flex items-center gap-4">
                    {statusIcon(item.status)}
                    <h2 className="text-2xl font-bold text-gray-800 flex items-center">
                      <User className="w-5 h-5 mr-2 text-gray-600" /> {item.nama_kendaraan}
                    </h2>
                  </div>
                  {statusBadge(item.status)}
                </div>

                {/* Detail */}
                <div className="grid sm:grid-cols-2 gap-y-4 gap-x-8 text-base">

                  <div className="flex items-center">
                    <Car className="text-gray-400 mr-3 w-5 h-5" />
                    <div>
                      <p className="text-xs text-gray-500 uppercase">Jenis Kendaraan</p>
                      <p className="font-semibold">{item.jenis_kendaraan}</p>
                    </div>
                  </div>

                  <div className="flex items-center">
                    <Tag className="text-gray-400 mr-3 w-5 h-5" />
                    <div>
                      <p className="text-xs text-gray-500 uppercase">Servis</p>
                      <p className="font-semibold">{item.jenis_service}</p>
                    </div>
                  </div>

                  <div className="flex items-center">
                    <Calendar className="text-gray-400 mr-3 w-5 h-5" />
                    <div>
                      <p className="text-xs text-gray-500 uppercase">Tanggal</p>
                      <p className="font-semibold">{formatDate(item.booking_date)}</p>
                    </div>
                  </div>

                  <div className="flex items-center">
                    <Phone className="text-gray-400 mr-3 w-5 h-5" />
                    <div>
                      <p className="text-xs text-gray-500 uppercase">WA</p>
                      <p className="font-semibold">{item.no_wa}</p>
                    </div>
                  </div>
                </div>

                {item.notes && (
                  <div className="mt-6 pt-4 border-t">
                    <div className="flex items-center text-sm font-medium text-[#234C6A] mb-2">
                      <BookOpen size={14} className="mr-2" /> Catatan
                    </div>
                    <p className="text-gray-600 italic bg-gray-50 p-3 rounded-lg border">
                      {item.notes}
                    </p>
                  </div>
                )}
              </div>
            ))
          )}
        </div>

      </div>
    </div>
  );
}
