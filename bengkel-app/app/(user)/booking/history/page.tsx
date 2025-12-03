"use client";

import { useState, useEffect } from "react";
import { CheckCircle, Clock, Wrench } from "lucide-react";

interface Booking {
  id: number;
  name: string;
  vehicle: string;
  service_type: string;
  booking_date: string;
  phone: string;
  notes: string | null;
  status: "Pending" | "Diterima" | "Selesai";
}

export default function RiwayatBooking() {
  // DATA DUMMY
  const dummyData: Booking[] = [
    {
      id: 1,
      name: "Rian Pradana",
      vehicle: "Honda Beat (Matic)",
      service_type: "Servis Ringan",
      booking_date: "2025-01-03T09:30",
      phone: "081234567890",
      notes: "Mohon dicek bagian CVT ada suara",
      status: "Pending",
    },
    {
      id: 2,
      name: "Made Anton",
      vehicle: "Yamaha NMAX",
      service_type: "Ganti Oli",
      booking_date: "2025-01-02T14:00",
      phone: "081987654321",
      notes: null,
      status: "Diterima",
    },
    {
      id: 3,
      name: "Putri Ayu",
      vehicle: "Vario 125",
      service_type: "Tune Up",
      booking_date: "2025-01-01T10:00",
      phone: "085765421000",
      notes: "Tenaga motor kurang saat gas awal",
      status: "Selesai",
    },
  ];

  const [riwayat, setRiwayat] = useState<Booking[]>([]);

  useEffect(() => {
    // simulasi loading data
    setTimeout(() => {
      setRiwayat(dummyData);
    }, 500);
  }, []);

  function statusBadge(status: Booking["status"]) {
    switch (status) {
      case "Pending":
        return <span className="px-3 py-1 rounded-full bg-gray-300 text-gray-800 text-sm font-semibold">Pending</span>;
      case "Diterima":
        return <span className="px-3 py-1 rounded-full bg-blue-500 text-white text-sm font-semibold">Diterima</span>;
      case "Selesai":
        return <span className="px-3 py-1 rounded-full bg-green-600 text-white text-sm font-semibold">Selesai</span>;
    }
  }

  function statusIcon(status: Booking["status"]) {
    switch (status) {
      case "Pending":
        return <Clock className="text-gray-600" size={22} />;
      case "Diterima":
        return <Wrench className="text-blue-600" size={22} />;
      case "Selesai":
        return <CheckCircle className="text-green-600" size={22} />;
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 py-10">
      <div className="max-w-5xl mx-auto px-6">

        <h1 className="text-3xl font-bold text-[#234C6A] mb-8">
          Riwayat Booking Servis
        </h1>

        <div className="space-y-6">
          {riwayat.map((item) => (
            <div
              key={item.id}
              className="
                bg-white border-2 border-black rounded-xl shadow-lg
                p-6 hover:shadow-xl transition-all duration-200
              "
            >

              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-3">
                  {statusIcon(item.status)}
                  <h2 className="text-xl font-bold text-[#234C6A]">{item.name}</h2>
                </div>

                {statusBadge(item.status)}
              </div>

              <div className="grid md:grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-500">Kendaraan</p>
                  <p className="font-semibold">{item.vehicle}</p>
                </div>

                <div>
                  <p className="text-gray-500">Jenis Servis</p>
                  <p className="font-semibold">{item.service_type}</p>
                </div>

                <div>
                  <p className="text-gray-500">Tanggal Booking</p>
                  <p className="font-semibold">
                    {new Date(item.booking_date).toLocaleString("id-ID")}
                  </p>
                </div>

                <div>
                  <p className="text-gray-500">Nomor WA</p>
                  <p className="font-semibold">{item.phone}</p>
                </div>
              </div>

              {item.notes && (
                <div className="mt-4 bg-gray-50 p-3 rounded border">
                  <p className="text-gray-500 text-sm">Catatan:</p>
                  <p className="italic text-gray-800">{item.notes}</p>
                </div>
              )}
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
