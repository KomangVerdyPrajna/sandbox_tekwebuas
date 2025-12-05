"use client";

import { useState, useEffect } from "react";
import { User, Mail, Phone, Pencil, LogOut, Camera, Save, XCircle, ShieldCheck, ShoppingBag, ShoppingCart, Clock } from "lucide-react";

interface UserData {
    name: string;
    email: string;
    phone: string;
}

export default function ProfilePage() {
    const [user, setUser] = useState<UserData>({
        name: "Pengguna Baru",
        email: "user@example.com",
        phone: "08xxxxxxxxxx",
    });

    const [editing, setEditing] = useState(false);
    const [formData, setFormData] = useState<UserData>(user);
    // State untuk mengecek apakah ada pesanan terakhir
    const [hasLatestOrder, setHasLatestOrder] = useState(false);

    useEffect(() => {
        // Cek apakah ada pesanan terakhir saat komponen dimuat
        if (typeof window !== 'undefined' && localStorage.getItem("latestOrder")) {
            setHasLatestOrder(true);
        }

        // Memuat data user dari localStorage (jika ada)
        const savedUser = localStorage.getItem("profileUser");
        if (savedUser) {
            const parsedUser = JSON.parse(savedUser);
            setUser(parsedUser);
            setFormData(parsedUser);
        }
    }, []);

    const handleSave = () => {
        // Implementasi validasi dasar
        if (!formData.name || !formData.email) {
            // Note: In a real app, replace window.alert with a custom modal/toast notification.
            window.alert("Nama dan Email tidak boleh kosong!");
            return;
        }
        
        // Simpan data ke state dan localStorage
        setUser(formData);
        localStorage.setItem("profileUser", JSON.stringify(formData));
        setEditing(false);
    };

    const handleCancel = () => {
        // Kembalikan formData ke data user asli
        setFormData(user);
        setEditing(false);
    };

    return (
        <div className="min-h-screen bg-gray-50 flex justify-center items-center py-12 px-4">

            {/* CARD PROFILE */}
            <div className="max-w-xl w-full bg-white rounded-3xl shadow-2xl p-8 border-t-8 border-[#234C6A]">

                {/* PROFILE TOP (HEADER & AVATAR) */}
                <div className="flex flex-col items-center border-b pb-6 mb-6">
                    
                    {/* Avatar */}
                    <div className="relative mb-4">
                        <div className="w-32 h-32 rounded-full bg-[#FF6D1F] text-white flex items-center justify-center text-5xl font-extrabold shadow-lg ring-4 ring-[#FF6D1F]/50 ring-offset-2">
                            {user.name.charAt(0).toUpperCase()}
                        </div>
                        <button 
                            className="absolute bottom-1 right-1 p-2 rounded-full bg-white shadow-md hover:bg-gray-100 transition border"
                            title="Ubah Foto Profil"
                        >
                            <Camera size={20} className="text-gray-600" />
                        </button>
                    </div>

                    {/* Info Utama */}
                    <div className="text-center">
                        <h2 className="text-3xl font-extrabold text-[#234C6A]">{user.name}</h2>
                        
                        {/* Status Akun - Tambahan Informasi */}
                        <div className="flex items-center justify-center gap-2 mt-1 text-sm text-green-600 font-medium bg-green-50 px-3 py-1 rounded-full border border-green-200">
                            <ShieldCheck size={16} /> Akun Terverifikasi
                        </div>
                    </div>
                </div>

                {/* FORM INPUT / DETAIL LIST */}
                <h3 className="text-xl font-bold mb-4 text-[#234C6A] flex items-center gap-2">
                    <Pencil size={20} /> Detail Akun {editing && <span className="text-sm font-normal text-red-500">(Mode Edit Aktif)</span>}
                </h3>
                
                <div className="space-y-4">
                    {[
                        { label: "Nama Lengkap", icon: User, key: "name", type: "text" },
                        { label: "Email", icon: Mail, key: "email", type: "email" },
                        { label: "Nomor WhatsApp", icon: Phone, key: "phone", type: "text" },
                    ].map((item: any) => (
                        <div key={item.key} className="flex items-center gap-4">
                            <div className="w-1/4 flex items-center gap-2 text-gray-700 font-medium whitespace-nowrap">
                                <item.icon size={18} className="text-[#234C6A]" /> {item.label}
                            </div>
                            
                            <input
                                type={item.type}
                                disabled={!editing}
                                placeholder={`Masukkan ${item.label}`}
                                className={`w-3/4 p-3 rounded-xl border transition duration-200 text-gray-800 ${
                                    editing
                                        ? "border-[#FF6D1F] bg-white ring-2 ring-[#FF6D1F]/30 focus:outline-none"
                                        : "border-gray-300 bg-gray-100 cursor-default"
                                }`}
                                value={(formData as any)[item.key]}
                                onChange={(e) =>
                                    setFormData({ ...formData, [item.key]: e.target.value })
                                }
                            />
                        </div>
                    ))}
                </div>

                {/* BUTTONS */}
                <div className="mt-8 flex flex-col gap-4 border-t pt-6">

                    {/* KELOMPOK NAVIGASI E-COMMERCE */}
                    <div className="flex flex-wrap gap-4 border-b pb-4">
                        
                        {/* RIWAYAT PESANAN - Primary Action */}
                        {hasLatestOrder && (
                            <a
                                href="/marketplace/detailPesanan"
                                className="flex items-center justify-center gap-2 bg-[#234C6A] hover:bg-[#1A374A] text-white
                                            font-semibold px-4 py-2 rounded-full transition shadow-md flex-1 min-w-[200px]"
                            >
                                <Clock size={20} /> Detail Pesanan
                            </a>
                        )}

                        {/* LIHAT KERANJANG - Secondary Action, menonjol dengan warna oranye */}
                        <a
                            href="/cart"
                            className="flex items-center justify-center gap-2 bg-[#FF6D1F] hover:bg-[#E05B1B] text-white
                                        font-semibold px-4 py-2 rounded-full transition shadow-md flex-1 min-w-[200px] transform hover:scale-[1.01]"
                        >
                            <ShoppingCart size={20} /> Lihat Keranjang
                        </a>
                        
                    </div>


                    {/* KELOMPOK AKSI UTAMA & LOGOUT */}
                    <div className="flex flex-wrap gap-4 justify-start items-center">
                        {!editing ? (
                            <button
                                onClick={() => {
                                    setEditing(true);
                                    setFormData(user);
                                }}
                                className="flex items-center gap-2 bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold px-6 py-3 rounded-full transition shadow-lg"
                            >
                                <Pencil size={20} /> Edit Profil
                            </button>
                        ) : (
                            <>
                                <button
                                    onClick={handleSave}
                                    className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-bold px-6 py-3 rounded-full transition shadow-lg shadow-green-500/30"
                                >
                                    <Save size={20} /> Simpan Perubahan
                                </button>
                                <button
                                    onClick={handleCancel}
                                    className="flex items-center gap-2 border border-red-400 text-red-600 hover:bg-red-50 font-semibold px-6 py-3 rounded-full transition"
                                >
                                    <XCircle size={20} /> Batal
                                </button>
                            </>
                        )}
                        
                        <button className="flex items-center gap-2 text-gray-500 hover:text-red-600 font-semibold px-6 py-3 transition">
                            <LogOut size={20} /> Logout
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}