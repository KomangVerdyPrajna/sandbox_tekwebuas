"use client";

import { useState, useEffect } from "react";
import { CheckCircle, Clock, Wrench, Calendar, Tag, Car, Phone, BookOpen, User } from "lucide-react";

// === Interface sesuai API ===
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

// Helper baca cookie
function getCookie(name: string) {
  const match = document.cookie.match(new RegExp("(^| )" + name + "=([^;]+)"));
  return match ? decodeURIComponent(match[2]) : null;
}

export default function RiwayatBooking() {

  const [riwayat, setRiwayat] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  // ================= FETCH BOOKING =================
  async function loadBooking() {
    try {
      const token = getCookie("token");
      if (!token) return alert("Silahkan login terlebih dahulu!");

      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

      const res = await fetch(`${apiUrl}/bookings`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      const data = await res.json();

      // Ambil array apapun struktur API
      const list = Array.isArray(data) ? data :
                   Array.isArray(data.bookings) ? data.bookings :
                   Array.isArray(data.data) ? data.data : [];

      setRiwayat(list);

    } catch (err) {
      console.error("Error fetch bookings:", err);
      alert("Gagal memuat booking");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { loadBooking(); }, []);


  // ================= UI UTILITIES =================
  const statusBadge = (status: Booking["status"]) => ({
    Pending: <span className="px-3 py-1 rounded-full text-sm font-semibold bg-yellow-100 text-yellow-700">Pending</span>,
    Diterima: <span className="px-3 py-1 rounded-full text-sm font-semibold bg-blue-100 text-blue-700">Diterima</span>,
    Selesai: <span className="px-3 py-1 rounded-full text-sm font-semibold bg-green-100 text-green-700">Selesai</span>
  }[status]);

  const statusBorder = (status: Booking["status"]) => ({
    Pending: "border-l-4 border-yellow-500",
    Diterima: "border-l-4 border-blue-500",
    Selesai: "border-l-4 border-green-500"
  }[status]);

  const statusIcon = (status: Booking["status"]) => ({
    Pending: <span className="bg-yellow-100 text-yellow-700 p-2 rounded-full shadow"><Clock size={18} /></span>,
    Diterima: <span className="bg-blue-100 text-blue-700 p-2 rounded-full shadow"><Wrench size={18} /></span>,
    Selesai: <span className="bg-green-100 text-green-700 p-2 rounded-full shadow"><CheckCircle size={18} /></span>
  }[status]);

  const formatDate = (date: string) =>
    new Date(date).toLocaleString("id-ID", { year:"numeric", month:"long", day:"numeric", hour:"2-digit", minute:"2-digit" });

  // ================= LOADING =================
  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <svg className="animate-spin h-8 w-8 text-[#FF6D1F]" viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" className="opacity-30" />
        <path fill="currentColor" d="M4 12a8 8 0 018-8V0A12 12 0 002 12h2z" />
      </svg>
      <p className="ml-3 text-[#234C6A] font-semibold">Memuat riwayat booking...</p>
    </div>
  );

  // ================= MAIN =================
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">

        <h1 className="text-4xl font-extrabold text-[#234C6A] mb-10 text-center">
          Riwayat Booking Servis 🗓️
        </h1>

        <div className="space-y-6">

        {riwayat.length === 0 ? (
          <div className="text-center p-10 bg-white rounded-xl shadow-md border">
            <p className="text-gray-500 text-lg">Belum ada booking tercatat.</p>
          </div>
        ) : (
          riwayat.map(item => (
            <div key={item.id} className={`bg-white rounded-xl shadow-md p-6 hover:shadow-xl transition ${statusBorder(item.status)}`}>

              {/* Header */}
              <div className="flex justify-between items-center border-b pb-4 mb-4">
                <div className="flex items-center gap-3">
                  {statusIcon(item.status)}
                  <h2 className="text-xl font-bold text-gray-800 flex items-center">
                    <User size={18} className="mr-1 text-gray-700" /> {item.nama_kendaraan}
                  </h2>
                </div>
                {statusBadge(item.status)}
              </div>

              {/* Detail */}
              <div className="grid sm:grid-cols-2 gap-6 text-base">
                <Detail icon={<Car />} title="Jenis Kendaraan" value={item.jenis_kendaraan}/>
                <Detail icon={<Tag />} title="Jenis Servis" value={item.jenis_service}/>
                <Detail icon={<Calendar />} title="Tanggal Booking" value={formatDate(item.booking_date)}/>
                <Detail icon={<Phone />} title="Whatsapp" value={item.no_wa}/>
              </div>

              {item.notes && (
                <div className="mt-6 pt-4 border-t">
                  <p className="font-semibold text-[#234C6A] flex items-center gap-2">
                    <BookOpen size={16}/> Catatan
                  </p>
                  <p className="bg-gray-50 border rounded-lg p-3 mt-2 text-gray-700 italic">
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

// === Reusable Detail Component (ICON STYLE BARU, LEBIH TEGAS) ===
function Detail({icon,title,value}:{icon:any,title:string,value:string}){
  return(
    <div className="flex items-center gap-3">
      <div className="p-2 rounded-full bg-[#FFEDD5] text-[#FF6D1F] shadow-sm">{icon}</div>
      <div>
        <p className="text-xs text-gray-500 uppercase">{title}</p>
        <p className="font-semibold text-gray-800">{value}</p>
      </div>
    </div>
  );
}
