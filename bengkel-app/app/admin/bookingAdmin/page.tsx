"use client";

import { useEffect, useState } from "react";
import { Trash2, RefreshCcw, ClipboardList } from "lucide-react";

interface Booking {
  id: number;
  vehicle: string;
  booking_date: string;
  notes: string | null;
  status: string;
}

export default function AdminBookingPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  // Dummy fallback jika API kosong
  const dummyData: Booking[] = [
    {
      id: 1,
      vehicle: "Matic",
      booking_date: "2025-01-10T10:30",
      notes: "Ganti oli + cek rem",
      status: "Pending",
    },
    {
      id: 2,
      vehicle: "Manual",
      booking_date: "2025-01-12T14:00",
      notes: "Servis berat",
      status: "Diproses",
    },
    {
      id: 3,
      vehicle: "Matic",
      booking_date: "2025-01-15T09:15",
      notes: null,
      status: "Selesai",
    },
  ];

  async function fetchBookings() {
    setLoading(true);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/booking`, {
        credentials: "include",
      });

      const data = await res.json();

      if (Array.isArray(data) && data.length > 0) {
        setBookings(data);
      } else {
        setBookings(dummyData); // fallback demo
      }
    } catch {
      setBookings(dummyData);
    } finally {
      setLoading(false);
    }
  }

  async function updateStatus(id: number, status: string) {
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/booking/${id}`, {
        method: "PUT",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status }),
      });

      fetchBookings();
    } catch {
      alert("Gagal mengubah status");
    }
  }

  async function deleteBooking(id: number) {
    if (!confirm("Yakin ingin menghapus booking ini?")) return;

    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/booking/${id}`, {
        method: "DELETE",
        credentials: "include",
      });

      fetchBookings();
    } catch {
      alert("Gagal menghapus booking");
    }
  }

  useEffect(() => {
    fetchBookings();
  }, []);

  const statusBadge = (status: string) => {
    const base = "px-3 py-1 rounded-full text-xs font-semibold";

    switch (status) {
      case "Pending":
        return `${base} bg-yellow-100 text-yellow-700`;
      case "Diproses":
        return `${base} bg-blue-100 text-blue-700`;
      case "Selesai":
        return `${base} bg-green-100 text-green-700`;
      default:
        return `${base} bg-gray-200 text-gray-700`;
    }
  };

  if (loading)
    return (
      <p className="text-center py-10 text-gray-500 animate-pulse">
        Memuat data booking...
      </p>
    );

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <ClipboardList size={32} className="text-[#234C6A]" />
          Manajemen Booking Bengkel
        </h1>

        <button
          onClick={fetchBookings}
          className="flex items-center gap-2 px-4 py-2 bg-[#234C6A] text-white rounded-lg hover:bg-[#1b3a50] transition"
        >
          <RefreshCcw size={18} />
          Refresh
        </button>
      </div>

      {/* Card Container */}
      <div className="bg-white shadow-xl rounded-xl overflow-hidden border border-gray-200">
        <table className="w-full text-sm">
          <thead className="bg-[#234C6A] text-white">
            <tr>
              <th className="p-4 text-left">Kendaraan</th>
              <th className="p-4 text-left">Tanggal Booking</th>
              <th className="p-4 text-left">Catatan</th>
              <th className="p-4 text-left">Status</th>
              <th className="p-4 text-left">Aksi</th>
            </tr>
          </thead>

          <tbody>
            {bookings.map((b, index) => (
              <tr
                key={b.id}
                className={`border-b transition hover:bg-gray-50 ${
                  index % 2 === 0 ? "bg-gray-50/40" : "bg-white"
                }`}
              >
                <td className="p-4 font-medium">{b.vehicle}</td>

                <td className="p-4">
                  {new Date(b.booking_date).toLocaleString("id-ID")}
                </td>

                <td className="p-4">{b.notes || "-"}</td>

                <td className="p-4">
                  <span className={statusBadge(b.status)}>{b.status}</span>
                </td>

                <td className="p-4 flex items-center gap-2">
                  <select
                    className="border rounded-lg p-2 bg-white"
                    value={b.status}
                    onChange={(e) => updateStatus(b.id, e.target.value)}
                  >
                    <option value="Pending">Pending</option>
                    <option value="Diproses">Diproses</option>
                    <option value="Selesai">Selesai</option>
                  </select>

                  <button
                    onClick={() => deleteBooking(b.id)}
                    className="p-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                  >
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {bookings.length === 0 && (
          <p className="p-6 text-center text-gray-500">Tidak ada booking.</p>
        )}
      </div>
    </div>
  );
}
