"use client";

import { useState } from "react";

export default function BookingPage() {
  const [loading, setLoading] = useState<boolean>(false);

  async function handleBooking(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    const form = new FormData(e.currentTarget);
    const payload = {
      name: form.get("name"),              // ➜ NAMA DITAMBAHKAN
      vehicle: form.get("vehicle"),
      booking_date: form.get("booking_date"),
      service_type: form.get("service_type"),
      phone: form.get("phone"),
      notes: form.get("notes"),
    };

    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/sanctum/csrf-cookie`, {
        credentials: "include",
      });

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/booking`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        alert("Booking gagal!");
        return;
      }

      alert("Booking berhasil!");
      e.currentTarget.reset();
    } catch {
      alert("Terjadi kesalahan server");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-white py-10">
      <div className="grid md:grid-cols-2 gap-20 max-w-6xl mx-auto p-6">

        {/* ================= FORM KIRI ================= */}
        <div className="bg-white p-6 rounded-xl shadow border-4 border-black">
          <h1 className="text-2xl font-semibold mb-4">Booking Bengkel</h1>

          <form onSubmit={handleBooking} className="grid gap-4">

            {/* === FIELD NAMA === */}
            <input
              name="name"
              type="text"
              required
              placeholder="Nama Lengkap"
              className="border-2 border-black p-2 rounded focus:border-[#234C6A] outline-none"
            />

            <select
              name="vehicle"
              required
              className="border-2 border-black p-2 rounded focus:border-[#234C6A] outline-none"
            >
              <option value="">Pilih Jenis Kendaraan</option>
              <option value="Matic">Matic</option>
              <option value="Manual">Manual</option>
            </select>

            <input
              name="booking_date"
              type="datetime-local"
              required
              className="border-2 border-black p-2 rounded focus:border-[#234C6A] outline-none"
            />

            <select
              required
              name="service_type"
              className="border-2 border-black p-2 rounded focus:border-[#234C6A] outline-none"
            >
              <option value="">Pilih Jenis Servis</option>
              <option value="Servis Ringan">Servis Ringan</option>
              <option value="Servis Berat">Servis Berat</option>
              <option value="Ganti Oli">Ganti Oli</option>
              <option value="Perbaikan Rem">Perbaikan Rem</option>
              <option value="Tune Up">Tune Up</option>
            </select>

            <input
              name="phone"
              type="text"
              required
              placeholder="Nomor WhatsApp"
              className="border-2 border-black p-2 rounded focus:border-[#234C6A] outline-none"
            />

            <textarea
              name="notes"
              placeholder="Catatan (opsional)"
              className="border-2 border-black p-2 rounded focus:border-[#234C6A] outline-none"
            />

            <button
              disabled={loading}
              className="
                py-2 rounded text-white font-semibold
                disabled:bg-gray-400 
                bg-[#FF6D1F] 
                hover:bg-[#234C6A] 
                transition duration-200
              "
            >
              {loading ? "Memproses..." : "Booking"}
            </button>
          </form>
        </div>

        {/* ================= INFORMASI SERVIS KANAN ================= */}
        <div className="bg-[#234C6A] text-white p-6 rounded-xl shadow leading-relaxed pl-6 md:pl-12">
          <h2 className="text-2xl font-bold mb-4">Informasi Servis Bengkel</h2>

          <p className="text-white/90 mb-6">
            Kami menyediakan berbagai layanan servis untuk kendaraan matic dan manual.
            Teknisi berpengalaman siap membantu menjaga kondisi kendaraan Anda tetap optimal.
          </p>

          <h3 className="text-xl font-semibold mb-3">Jenis Servis:</h3>

          <ul className="space-y-3">
            <li className="bg-white/10 p-3 rounded">
              <strong>Servis Ringan</strong>
              <p className="text-sm opacity-80">
                Perawatan ringan seperti pengecekan filter, busi, dan setelan.
              </p>
            </li>

            <li className="bg-white/10 p-3 rounded">
              <strong>Servis Berat</strong>
              <p className="text-sm opacity-80">
                Termasuk turun mesin dan perbaikan komponen utama.
              </p>
            </li>

            <li className="bg-white/10 p-3 rounded">
              <strong>Ganti Oli</strong>
              <p className="text-sm opacity-80">
                Oli mesin & gardan untuk menjaga performa kendaraan.
              </p>
            </li>

            <li className="bg-white/10 p-3 rounded">
              <strong>Perbaikan Rem</strong>
              <p className="text-sm opacity-80">
                Perbaikan kampas, cakram, dan minyak rem.
              </p>
            </li>

            <li className="bg-white/10 p-3 rounded">
              <strong>Tune Up</strong>
              <p className="text-sm opacity-80">
                Membersihkan sistem pembakaran dan optimasi mesin.
              </p>
            </li>
          </ul>
        </div>

      </div>
    </div>
  );
}
